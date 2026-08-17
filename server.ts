import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_PATH = path.join(DATA_DIR, 'orders.json');

function getLocalOrders() {
  if (fs.existsSync(ORDERS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf-8'));
    } catch (e) {
      console.error('Error reading local orders:', e);
      return [];
    }
  }
  return [];
}

function saveLocalOrder(order: any) {
  const orders = getLocalOrders();
  orders.unshift(order);
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));
  return orders;
}

// CSV line parser helper
function parseCSVRows(csvText: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentToken = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentToken += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentToken.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      lines.push(currentRow);
    }
  }
  return lines;
}

// API Routes

// Get Products from Google Sheet
app.get('/api/products', async (req, res) => {
  const sheetId = (req.query.sheetId as string) || '1kPzbYFUkgN8dW5BVqeNtoKM8LbRvHAIfQIQZBKkv-Ws';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Google Sheet response: ${response.statusText}`);
    }
    const csvText = await response.text();
    const rows = parseCSVRows(csvText);

    if (rows.length < 2) {
      return res.json({ products: [], source: 'empty-sheet' });
    }

    const cleanHeader = (s: string) => s.toLowerCase().replace(/[\s_\-\/\\]+/g, '').trim();

    const parseNumber = (val: string): number => {
      if (!val) return NaN;
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      let converted = '';
      for (let i = 0; i < val.length; i++) {
        const char = val[i];
        const idx = bnDigits.indexOf(char);
        if (idx !== -1) {
          converted += idx;
        } else {
          converted += char;
        }
      }
      const clean = converted.replace(/[^0-9.]/g, '');
      const n = parseFloat(clean);
      return isNaN(n) ? NaN : n;
    };

    const rawHeaders = rows[0].map((h) => h.trim());
    const normalizedHeaders = rawHeaders.map(cleanHeader);

    const products = rows
      .slice(1)
      .map((row, index) => {
        const getVal = (...aliases: string[]) => {
          for (const alias of aliases) {
            const normAlias = cleanHeader(alias);
            const colIdx = normalizedHeaders.indexOf(normAlias);
            if (colIdx !== -1 && row[colIdx] !== undefined && row[colIdx].trim() !== '') {
              return row[colIdx].trim();
            }
          }
          return '';
        };

        const id = getVal('id') || `sheet-prod-${index + 1}`;
        const name = getVal('name');
        if (!name) return null; // Skip empty rows

        const rawCat = getVal('category').toLowerCase();
        let category = 'veg';
        if (rawCat.includes('veg') || rawCat.includes('সবজি')) {
          category = 'veg';
        } else if (rawCat.includes('fruit') || rawCat.includes('fol') || rawCat.includes('ফল')) {
          category = 'fruit';
        } else if (rawCat.includes('flow') || rawCat.includes('ful') || rawCat.includes('ফুল')) {
          category = 'ful';
        } else if (rawCat.includes('other') || rawCat.includes('অন্য')) {
          category = 'other';
        } else if (rawCat) {
          category = rawCat;
        }

        const parsedPrice = parseNumber(getVal('price', 'মূল্য', 'দাম'));
        const price = !isNaN(parsedPrice) ? parsedPrice : 0;

        const parsedOrigPrice = parseNumber(getVal('originalPrice', 'original_price', 'oldPrice', 'পূর্বেরদাম', 'আগেরদাম'));
        const originalPrice = !isNaN(parsedOrigPrice) && parsedOrigPrice > price ? parsedOrigPrice : undefined;

        const parsedStock = parseNumber(getVal('stock', 'স্টক'));
        const stock = !isNaN(parsedStock) ? parsedStock : 50;

        const parsedRating = parseNumber(getVal('rating', 'রেটিং'));
        const rating = !isNaN(parsedRating) ? parsedRating : 5;

        const parsedReviews = parseNumber(getVal('reviewsCount', 'reviews_count', 'reviews', 'রিভিউ'));
        const reviewsCount = !isNaN(parsedReviews) ? parsedReviews : 10;
        
        const rawImage = getVal('image', 'image1', 'img1');
        const img2 = getVal('image2', 'img2');
        const img3 = getVal('image3', 'img3');
        const rawImagesCol = getVal('images');

        let imageList: string[] = [];

        if (rawImagesCol) {
          imageList = rawImagesCol.split(',').map((s) => s.trim()).filter(Boolean);
        } else {
          if (rawImage) {
            rawImage.split(',').forEach((s) => {
              const trimmed = s.trim();
              if (trimmed && !imageList.includes(trimmed)) imageList.push(trimmed);
            });
          }
          if (img2 && !imageList.includes(img2)) imageList.push(img2);
          if (img3 && !imageList.includes(img3)) imageList.push(img3);
        }

        const defaultImg =
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80';
        const image = imageList.length > 0 ? imageList[0] : defaultImg;
        const images = imageList.length > 0 ? imageList : [defaultImg];

        const description = getVal('description', 'desc', 'details', 'বিবরণ') || '';
        const germinationDays =
          getVal('germinationDays', 'germination_days', 'germination', 'sproutDays', 'sprout_days', 'sprout', 'গজানোর সময়', 'গজানোরসময়') || '';
        const season = getVal('season', 'seasonType', 'ঋতু', 'উপযুক্ত ঋতু') || '';
        const packSize = getVal('packSize', 'pack_size', 'pack', 'size', 'প্যাক সাইজ', 'প্যাকসাইজ', 'সাইজ') || '';
        const plantingTip =
          getVal('plantingTip', 'planting_tip', 'plantingTips', 'planting_tips', 'tip', 'tips', 'রোপণ টিপস', 'রোপণটিপস') || '';

        const rawBadges = getVal('badgeTags', 'badge_tags', 'badges', 'tags', 'ট্যাগ/ব্যাজ', 'ট্যাগব্যাজ', 'ট্যাগ', 'ব্যাজ');
        const badgeTags = rawBadges
          ? rawBadges.split(/[,/|]+/).map((b) => b.trim()).filter(Boolean)
          : [];

        const parsedCashback = parseNumber(getVal('cashback', 'cash_back', 'ক্যাশব্যাক'));
        const cashback = !isNaN(parsedCashback) && parsedCashback > 0 ? parsedCashback : 0;

        const isPopularVal = getVal('isPopular', 'is_popular', 'popular').toLowerCase();
        const isNewVal = getVal('isNew', 'is_new', 'new').toLowerCase();

        return {
          id,
          name,
          category,
          price,
          originalPrice,
          cashback,
          stock,
          rating,
          reviewsCount,
          image,
          images,
          description,
          germinationDays,
          sproutDays: germinationDays,
          season,
          packSize,
          plantingTip,
          plantingTips: plantingTip,
          badgeTags,
          isPopular:
            isPopularVal === 'true' || isPopularVal === '1' || isPopularVal === 'yes',
          isNew: isNewVal === 'true' || isNewVal === '1' || isNewVal === 'yes',
        };
      })
      .filter((p) => p && p.name);

    res.json({ products, count: products.length, source: 'google-sheet' });
  } catch (error: any) {
    console.error('Error fetching products from Google Sheet:', error.message);
    res.status(500).json({ error: error.message, products: [] });
  }
});

// Place new Order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order || !order.orderId) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const orders = saveLocalOrder(order);
  res.json({
    success: true,
    order,
    totalOrdersCount: orders.length,
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  const orders = getLocalOrders();
  res.json({ orders });
});

// AI Chatbot endpoint using @google/genai
import { GoogleGenAI } from '@google/genai';

app.post('/api/ai-chat', async (req, res) => {
  const { message, productsContext, customerName, userOrders } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: 'দুঃখিত, এআই অ্যাসিস্ট্যান্টের এপিআই কি (API Key) কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিন সেটিংস চেক করুন।' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct context prompt including user's purchase history
    const systemPrompt = `You are "বীজ হাব সহকারী", a concise and fast AI shopping assistant for "Seed Haven BD".
Customer Name: ${customerName || 'Customer'}
Customer Previous Orders/Purchase History:
${JSON.stringify(userOrders || [])}

Rules:
1. If and only if the customer greets you with "আসসালামু আলাইকুম" or similar greeting, reply with "ওয়ালাইকুমুস সালাম". If the customer asks a direct question like "কেমন আছেন" or about a product without salam, do NOT say "ওয়ালাইকুমুস সালাম", simply answer politely and directly in brief Bengali (maximum 2-3 short sentences).
2. Analyze the customer's purchase history above to recommend complementary seeds, organic fertilizers, or gardening tools tailored to their past purchases.
3. Never write long paragraphs. Be direct and helpful.
Products available in store catalog:
${JSON.stringify(productsContext || []).slice(0, 4000)}

Customer question: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] }
      ],
      config: {
        maxOutputTokens: 200,
        temperature: 0.3
      }
    });

    const reply = response.text || 'দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।';
    res.json({ reply });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: error.message || 'AI generation failed', reply: 'এআই চ্যাট সার্ভারে একটি সমস্যা হয়েছে।' });
  }
});

// Admin Panel route
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(process.cwd(), 'admin.html'));
});

// Start Express + Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
