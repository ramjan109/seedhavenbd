import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductCard, ProductCardSkeleton } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ContactModal } from './components/ContactModal';
import { PolicyModal } from './components/PolicyModal';
import { ToastNotification } from './components/ToastNotification';
import { ClearanceBanner } from './components/ClearanceBanner';
import { NoticePopupModal } from './components/NoticePopupModal';
import { QuickActionsBar } from './components/QuickActionsBar';
import { MenuDrawer } from './components/MenuDrawer';
import { OrderTrackerPage } from './components/OrderTrackerModal';
import { PromoSection } from './components/PromoSection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { BlogSection } from './components/BlogSection';
import { TrustSection } from './components/TrustSection';
import { ProductCompareModal } from './components/ProductCompareModal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { AIChatWidget } from './components/AIChatWidget';
import { Scale } from 'lucide-react';
import { trackAddToCart, trackPurchase } from './lib/pixel';
import { PRODUCTS, CATEGORIES } from './data/fallbackData';
import { CartItem, OrderDetails, Product, Category, Banner, Coupon } from './types';
import {
  subscribeToProducts,
  subscribeToCategories,
  subscribeToFooterSettings,
  subscribeToHomepageSettings,
  subscribeToNoticeSettings,
  subscribeToContactSettings,
  subscribeToPolicySettings,
  subscribeToSeoSettings,
  subscribeToStoreSettings,
  subscribeToBanners,
  subscribeToCoupons,
  FooterSettings,
  HomepageSettings,
  NoticeSettings,
  ContactSettings,
  PolicySettings,
  SeoSettings,
  StoreSettings,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_NOTICE_SETTINGS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_POLICY_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_STORE_SETTINGS,
  saveOrderFirebase,
  subscribeToOrders,
  recordVisitor,
  subscribeToProductRatings,
  saveProductRatingFirebase,
} from './lib/firestoreProducts';

export default function App() {
  // Products State (Real-time synced with Firebase Firestore)
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);
  const [bannersList, setBannersList] = useState<Banner[]>([]);
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({});
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [noticeSettings, setNoticeSettings] = useState<NoticeSettings>(DEFAULT_NOTICE_SETTINGS);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [policySettings, setPolicySettings] = useState<PolicySettings>(DEFAULT_POLICY_SETTINGS);
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(DEFAULT_SEO_SETTINGS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [ordersList, setOrdersList] = useState<OrderDetails[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('seedhaven_user_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem('seedhaven_user_ratings', JSON.stringify(userRatings));
    } catch (e) {
      console.error('Failed to save user ratings', e);
    }
  }, [userRatings]);

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRateProduct = async (productId: string, rating: number) => {
    setUserRatings((prev) => ({
      ...prev,
      [productId]: rating,
    }));
    await saveProductRatingFirebase(productId, rating);
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  useEffect(() => {
    const unsubscribe = subscribeToProductRatings((ratingsMap) => {
      setUserRatings((prev) => ({
        ...prev,
        ...ratingsMap,
      }));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleCompare = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          alert('সর্বোচ্চ ৩টি পণ্য একসাথে তুলনা করা যাবে।');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  // Subscribe to Firebase Firestore live products, categories, banners, homepage, footer, notice, contact, policy, SEO, store settings & orders
  useEffect(() => {
    recordVisitor();
    const unsubProd = subscribeToProducts((products) => {
      setProductsList(products || []);
      setIsLoadingProducts(false);
    });

    const unsubCat = subscribeToCategories((cats) => {
      setCategoriesList(cats || []);
      setIsLoadingCategories(false);
    });

    const unsubBanners = subscribeToBanners((bns) => {
      setBannersList(bns || []);
    });

    const unsubCoupons = subscribeToCoupons((coupons) => {
      setCouponsList(coupons || []);
    });

    const unsubOrders = subscribeToOrders((orders) => {
      setOrdersList(orders || []);
      setIsLoadingOrders(false);
    });

    const unsubFooter = subscribeToFooterSettings((settings) => {
      setFooterSettings(settings || {});
    });

    const unsubHomepage = subscribeToHomepageSettings((settings) => {
      setHomepageSettings(settings || {});
    });

    const unsubNotice = subscribeToNoticeSettings((settings) => {
      setNoticeSettings(settings || {});
    });

    const unsubContact = subscribeToContactSettings((settings) => {
      setContactSettings(settings || DEFAULT_CONTACT_SETTINGS);
    });

    const unsubPolicy = subscribeToPolicySettings((settings) => {
      setPolicySettings(settings || DEFAULT_POLICY_SETTINGS);
    });

    const unsubSeo = subscribeToSeoSettings((settings) => {
      setSeoSettings(settings || DEFAULT_SEO_SETTINGS);
    });

    const unsubStore = subscribeToStoreSettings((settings) => {
      setStoreSettings(settings || DEFAULT_STORE_SETTINGS);
    });

    return () => {
      unsubProd();
      unsubCat();
      unsubBanners();
      unsubCoupons();
      unsubOrders();
      unsubFooter();
      unsubHomepage();
      unsubNotice();
      unsubContact();
      unsubPolicy();
      unsubSeo();
      unsubStore();
    };
  }, []);

  // Dynamic document head & SEO updates
  useEffect(() => {
    if (seoSettings.siteTitle) {
      document.title = seoSettings.siteTitle;
    }

    // Helper to set or create meta tag
    const setMetaTag = (nameAttr: string, attrVal: string, contentVal?: string) => {
      if (!contentVal) return;
      let el = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    setMetaTag('name', 'description', seoSettings.description);
    setMetaTag('name', 'keywords', seoSettings.keywords);
    setMetaTag('name', 'google-site-verification', seoSettings.googleVerification);
    setMetaTag('property', 'og:title', seoSettings.siteTitle);
    setMetaTag('property', 'og:description', seoSettings.description);
    setMetaTag('property', 'og:image', seoSettings.ogImage);

    // Favicon update
    if (storeSettings.favicon) {
      let iconEl = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!iconEl) {
        iconEl = document.createElement('link');
        iconEl.rel = 'shortcut icon';
        document.head.appendChild(iconEl);
      }
      iconEl.href = storeSettings.favicon;
    }
  }, [seoSettings, storeSettings]);

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; email?: string; photoUrl?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('seedhaven_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Per-user storage keys
  const userCartKey = currentUser ? `seedhaven_cart_${currentUser.phone}` : 'seedhaven_cart_guest';
  const userWishlistKey = currentUser ? `seedhaven_wishlist_${currentUser.phone}` : 'seedhaven_wishlist_guest';

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(userCartKey) || localStorage.getItem('seedhaven_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(userWishlistKey) || localStorage.getItem('seedhaven_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart and wishlist whenever user or items change
  useEffect(() => {
    try {
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
      localStorage.setItem('seedhaven_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems, userCartKey]);

  useEffect(() => {
    try {
      localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
      localStorage.setItem('seedhaven_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist, userWishlistKey]);

  // When user logs in, load their specific cart & wishlist if available
  const handleLoginSuccess = (user: { name: string; phone: string; email?: string; photoUrl?: string }) => {
    setCurrentUser(user);
    try {
      const savedCart = localStorage.getItem(`seedhaven_cart_${user.phone}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem(`seedhaven_wishlist_${user.phone}`);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('seedhaven_current_user');
    setCartItems([]);
    setWishlist([]);
  };

  // Active Product Page State (Dedicated Product Details View)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Modals & UI Controls State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactModalTab, setContactModalTab] = useState<'about' | 'contact'>('contact');
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<'privacy' | 'terms' | 'refund' | 'shipping'>('privacy');
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Navigation & Modal handlers with browser history management for mobile back button
  const handleSelectProduct = (product: Product | null) => {
    if (product) {
      window.history.pushState({ view: 'product', id: product.id }, '');
      setActiveProduct(product);
    } else {
      setActiveProduct(null);
    }
  };

  const handleOpenOrderTracker = (open: boolean) => {
    if (open) {
      window.history.pushState({ view: 'tracker' }, '');
      setIsOrderTrackerOpen(true);
    } else {
      setIsOrderTrackerOpen(false);
    }
  };

  const handleOpenCart = (open: boolean) => {
    if (open) {
      window.history.pushState({ view: 'cart' }, '');
      setIsCartOpen(true);
    } else {
      setIsCartOpen(false);
    }
  };

  const handleOpenMenu = (open: boolean) => {
    if (open) {
      window.history.pushState({ view: 'menu' }, '');
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleOpenSearch = (open: boolean) => {
    if (open) {
      window.history.pushState({ view: 'search' }, '');
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleOpenContact = (open: boolean, tab: 'about' | 'contact' = 'contact') => {
    if (open) {
      window.history.pushState({ view: 'contact' }, '');
      setContactModalTab(tab);
      setIsContactOpen(true);
    } else {
      setIsContactOpen(false);
    }
  };

  const handleOpenPolicy = (open: boolean, tab: 'privacy' | 'terms' | 'refund' | 'shipping' = 'privacy') => {
    if (open) {
      window.history.pushState({ view: 'policy' }, '');
      setPolicyModalTab(tab);
      setIsPolicyOpen(true);
    } else {
      setIsPolicyOpen(false);
    }
  };

  // Mobile Back Button (popstate) Handler to prevent accidental site exit
  useEffect(() => {
    const handlePopState = () => {
      if (isCartOpen) {
        setIsCartOpen(false);
      } else if (activeProduct) {
        setActiveProduct(null);
      } else if (isOrderTrackerOpen) {
        setIsOrderTrackerOpen(false);
      } else if (isMenuOpen) {
        setIsMenuOpen(false);
      } else if (isSearchOpen) {
        setIsSearchOpen(false);
      } else if (isContactOpen) {
        setIsContactOpen(false);
      } else if (isPolicyOpen) {
        setIsPolicyOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isCartOpen, activeProduct, isOrderTrackerOpen, isMenuOpen, isSearchOpen, isContactOpen, isPolicyOpen]);

  // Phone/Browser Hardware Back Button Listener for Modals & Detail View
  const isAnyModalOpen =
    isMenuOpen ||
    isCartOpen ||
    isSearchOpen ||
    isContactOpen ||
    isPolicyOpen ||
    isOrderTrackerOpen;

  // Lock body scroll when drawer/modal is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isAnyModalOpen]);

  // Cart Functions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });

    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    }, quantity);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = async (orderDetails: OrderDetails) => {
    // Save order to Firebase Firestore
    await saveOrderFirebase(orderDetails);

    trackPurchase(orderDetails.orderId, orderDetails.total, orderDetails.items);

    // Save profile to localStorage for profile tracking
    const existingProfile = localStorage.getItem('seed_haven_customer_profile');
    let parsedProfile = existingProfile ? JSON.parse(existingProfile) : {};
    const updatedProfile = {
      ...parsedProfile,
      name: orderDetails.customerName || parsedProfile.name || '',
      phone: orderDetails.phone || parsedProfile.phone || '',
      address: orderDetails.address || parsedProfile.address || '',
      district: orderDetails.district || parsedProfile.district || '',
    };
    localStorage.setItem('seed_haven_customer_profile', JSON.stringify(updatedProfile));

    // Save order ID to local storage my order IDs
    if (orderDetails.orderId) {
      const existingIds = JSON.parse(localStorage.getItem('seed_haven_my_order_ids') || '[]');
      if (!existingIds.includes(orderDetails.orderId)) {
        existingIds.push(orderDetails.orderId);
        localStorage.setItem('seed_haven_my_order_ids', JSON.stringify(existingIds));
      }
    }

    setCartItems([]);
    setIsCartOpen(true);
  };

  // Category & Quick Search Filtering Logic
  const filteredProducts = productsList.filter((p) => {
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      const cat = (p.category || '').toLowerCase();
      const target = selectedCategory.toLowerCase();
      if (cat === target) matchesCategory = true;
      else if (target === 'veg' && (cat.includes('veg') || cat.includes('সবজি'))) matchesCategory = true;
      else if (target === 'fruit' && (cat.includes('fruit') || cat.includes('fol') || cat.includes('ফল'))) matchesCategory = true;
      else if (target === 'ful' && (cat.includes('flow') || cat.includes('ful') || cat.includes('ফুল'))) matchesCategory = true;
      else if (target === 'offers' || target === 'offer' || target.includes('অফার')) {
        matchesCategory =
          cat.includes('offer') ||
          cat.includes('অফার') ||
          cat.includes('discount') ||
          cat.includes('ছাড়') ||
          (p.originalPrice !== undefined && p.originalPrice > p.price) ||
          Boolean(p.cashback);
      } else matchesCategory = false;
    }

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#16331f] flex justify-center selection:bg-[#49a845]/20 selection:text-[#063d24]">
      {/* Mobile Wrapper Container (Max 480px width) */}
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative flex flex-col justify-between border-x border-gray-200">
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-[#118137] transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div>
          {/* Main Header (Shown only on home/catalog view) */}
          {!activeProduct && (
            <Header
              cartCount={totalCartCount}
              onOpenCart={() => handleOpenCart(true)}
              onOpenMenu={() => handleOpenMenu(true)}
              storeSettings={storeSettings}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
            />
          )}

          {/* Dedicated Product Details Page OR Order Tracker Page OR Homepage Content */}
          {activeProduct ? (
            <ProductDetailPage
              product={activeProduct}
              allProducts={productsList}
              cartCount={totalCartCount}
              userRating={userRatings[activeProduct.id]}
              onRateProduct={handleRateProduct}
              onBack={() => handleSelectProduct(null)}
              onOpenCart={() => handleOpenCart(true)}
              onAddToCart={handleAddToCart}
              onDirectCheckout={(p, q) => {
                handleAddToCart(p, q);
                handleOpenCart(true);
              }}
              onSelectProduct={(p) => handleSelectProduct(p)}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                handleSelectProduct(null);
              }}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          ) : isOrderTrackerOpen ? (
            <OrderTrackerPage
              onBack={() => handleOpenOrderTracker(false)}
              ordersList={ordersList}
              onOpenCart={() => handleOpenCart(true)}
              cartCount={totalCartCount}
              isLoading={isLoadingOrders}
            />
          ) : (
            <>
              {/* Quick Actions Row */}
              <QuickActionsBar
                searchQuery={searchQuery}
                onSearchChange={(query) => {
                  setSearchQuery(query);
                  if (query) {
                    setSelectedCategory('all');
                    if (activeProduct) handleSelectProduct(null);
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onOpenSearch={() => {
                  setSelectedCategory('all');
                  if (activeProduct) handleSelectProduct(null);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenTracker={() => handleOpenOrderTracker(true)}
              />

              {/* Notice / Popup Offer Modal */}
              <NoticePopupModal settings={noticeSettings} />

              {/* Notice / Clearance Banner */}
              {noticeSettings.noticeEnabled === true && (
                <ClearanceBanner
                  noticeText={noticeSettings.noticeText}
                  noticeLink={noticeSettings.noticeLink}
                  onViewOffer={() => {
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              )}

              {/* Hero Section */}
              <Hero banners={bannersList} />

              {/* Category Strip */}
              {homepageSettings.showCategories !== false && (
                <Categories
                  categories={categoriesList}
                  selectedCategory={selectedCategory}
                  isLoading={isLoadingCategories}
                  onSelectCategory={(id) => {
                    setSelectedCategory(id);
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              )}

              {/* Promo Banner Section */}
              {homepageSettings.showPromoBanner !== false && (
                <PromoSection
                  title={homepageSettings.promoTitle}
                  subtext={homepageSettings.promoSubtext}
                  buttonText={homepageSettings.promoButtonText}
                  couponCode={couponsList.length > 0 ? couponsList[0].code : 'SEED10'}
                />
              )}

              {/* Product Catalog Section */}
              <section className="px-3 py-4" id="products">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col gap-0.5">
                    {/* Main Section Breadcrumb Trail */}
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mb-1 select-none">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="hover:text-[#1c3822] transition-colors cursor-pointer"
                      >
                        হোম
                      </button>
                      <span className="text-gray-400">›</span>
                      <span className="text-[#2b5019] font-bold">
                        {selectedCategory === 'all'
                          ? 'সকল পণ্য'
                          : CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
                            'পণ্য তালিকা'}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-[#153a1a] flex items-center gap-2">
                      {searchQuery ? (
                        <span className="truncate max-w-[200px] sm:max-w-[300px]">🔍 "{searchQuery}" এর ফলাফল</span>
                      ) : selectedCategory === 'all' ? (
                        '🔥 সেরা বীজ কালেকশন'
                      ) : (
                        '🌱 বাছাইকৃত পণ্যসমূহ'
                      )}
                    </h2>
                  </div>

                  {/* Reset Filter Button if Active */}
                  {(selectedCategory !== 'all' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="text-xs font-bold text-[#35682d] bg-[#f0f9f1] px-2.5 py-1.5 rounded-lg border border-[#3e7235]/30 hover:bg-[#3d7034] hover:text-white transition-all cursor-pointer"
                    >
                      সব দেখুন
                    </button>
                  )}
                </div>

                {isLoadingProducts ? (
                  <div className="grid grid-cols-2 gap-3 py-2">
                    {[1, 2, 3, 4].map((n) => (
                      <ProductCardSkeleton key={n} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-12 text-center bg-[#f8faf8] rounded-2xl border border-dashed border-[#a6d1a3] p-6">
                    <div className="text-4xl mb-2">🌱</div>
                    <p className="text-sm font-bold text-[#1a3821]">
                      {searchQuery ? `"${searchQuery}" নামে কোনো বীজ পাওয়া যায়নি` : 'এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 mb-4">
                      {searchQuery ? 'অন্য কোনো নাম দিয়ে অনুসন্ধান অথবা সম্পূর্ণ তালিকা দেখুন' : 'অনুগ্রহ করে অন্য কোনো ক্যাটাগরি অথবা সম্পূর্ণ তালিকা চেক করুন'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 bg-[#2c5828] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1b3d18] transition-colors cursor-pointer"
                    >
                      সকল পণ্য দেখুন
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onQuickView={(p) => handleSelectProduct(p)}
                        onSelectProduct={(p) => handleSelectProduct(p)}
                        onToggleCompare={handleToggleCompare}
                        isCompared={compareProducts.some((p) => p.id === product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some((p) => p.id === product.id)}
                        ordersList={ordersList}
                        userRating={userRatings[product.id]}
                        onRateProduct={handleRateProduct}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Leaderboard Section */}
              {homepageSettings.showLeaderboard !== false && (
                <LeaderboardSection
                  products={productsList}
                  onSelectProduct={(p) => handleSelectProduct(p)}
                />
              )}

              {/* Blog & Gardening Tips Section */}
              {homepageSettings.showBlogTips === true && <BlogSection />}

              {/* Trust Section */}
              {homepageSettings.showTrustSection !== false && <TrustSection />}
            </>
          )}

          {/* Footer Section (Shown only on home/catalog view) */}
          {!activeProduct && (
            <Footer
              settings={footerSettings}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                handleSelectProduct(null);
              }}
              onOpenContact={() => handleOpenContact(true, 'contact')}
              onOpenPolicy={(tab) => handleOpenPolicy(true, tab || 'privacy')}
            />
          )}
        </div>

        {/* Side Menu Drawer */}
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => handleOpenMenu(false)}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onOpenCart={() => {
            handleOpenMenu(false);
            handleOpenCart(true);
          }}
          wishlistCount={wishlist.length}
          onOpenWishlist={() => {
            handleOpenMenu(false);
            setIsWishlistModalOpen(true);
          }}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            handleOpenMenu(false);
          }}
          onOpenContact={(tab) => {
            handleOpenMenu(false);
            handleOpenContact(true, tab || 'contact');
          }}
          onOpenPolicy={(tab) => {
            handleOpenMenu(false);
            handleOpenPolicy(true, tab || 'privacy');
          }}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Wishlist Modal */}
        <WishlistModal
          isOpen={isWishlistModalOpen}
          onClose={() => setIsWishlistModalOpen(false)}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onSelectProduct={(p) => handleSelectProduct(p)}
          onClearWishlist={handleClearWishlist}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Cart Side Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => handleOpenCart(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onPlaceOrder={handlePlaceOrder}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Quick Search Modal */}
        <QuickSearchModal
          isOpen={isSearchOpen}
          onClose={() => handleOpenSearch(false)}
          products={productsList}
          onSelectProduct={(p) => {
            handleOpenSearch(false);
            handleSelectProduct(p);
          }}
        />

        {/* Contact & About Us Modal */}
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => handleOpenContact(false)}
          settings={contactSettings}
          initialTab={contactModalTab}
        />

        {/* Policy Pages Modal */}
        <PolicyModal
          isOpen={isPolicyOpen}
          onClose={() => handleOpenPolicy(false)}
          settings={policySettings}
          initialTab={policyModalTab}
        />

        {/* Product Comparison Modal */}
        <ProductCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          comparedProducts={compareProducts}
          onRemoveFromCompare={(id) => setCompareProducts((prev) => prev.filter((p) => p.id !== id))}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />

        {/* Floating Compare Bar */}
        {compareProducts.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1c3822] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-6 border border-emerald-700/50 animate-bounce-short">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-700 rounded-lg text-white">
                <Scale size={16} />
              </span>
              <span className="text-xs sm:text-sm font-bold">
                তুলনা তালিকা ({compareProducts.length}/3)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#118137] hover:bg-[#0d6b2c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                তুলনা করুন
              </button>
              <button
                onClick={() => setCompareProducts([])}
                className="text-xs text-emerald-200 hover:text-white underline cursor-pointer"
              >
                সব মুছুন
              </button>
            </div>
          </div>
        )}

        {/* Customer Profile Page rendered conditionally above */}

        {/* AI Chatbot Widget */}
        <AIChatWidget products={productsList.length > 0 ? productsList : PRODUCTS} currentUser={currentUser} orders={ordersList} onOpenAuth={() => setIsAuthModalOpen(true)} />

      </div>
    </div>
  );
}
