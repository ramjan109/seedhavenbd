// Facebook Pixel helper utility for tracking standard e-commerce events safely

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackPixelEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    }
  } catch (e) {
    console.error('Facebook Pixel tracking error:', e);
  }
};

// Standard helper events for SeedHaven BD E-commerce
export const trackViewContent = (product: { id: string; name: string; price: number; category?: string }) => {
  trackPixelEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'BDT',
  });
};

export const trackAddToCart = (product: { id: string; name: string; price: number }, quantity: number = 1) => {
  trackPixelEvent('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'BDT',
    num_items: quantity,
  });
};

export const trackInitiateCheckout = (totalAmount: number, numItems: number) => {
  trackPixelEvent('InitiateCheckout', {
    value: totalAmount,
    currency: 'BDT',
    num_items: numItems,
  });
};

export const trackPurchase = (orderId: string, totalAmount: number, items: Array<{ product: { id: string; name: string; price: number }; quantity: number }>) => {
  trackPixelEvent('Purchase', {
    order_id: orderId,
    value: totalAmount,
    currency: 'BDT',
    content_type: 'product',
    content_ids: items.map(i => i.product.id),
    num_items: items.reduce((acc, i) => acc + i.quantity, 0),
  });
};
