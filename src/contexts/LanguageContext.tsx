import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Header
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.products': { en: 'Explore Products', hi: 'उत्पाद देखें' },
  'nav.artisans': { en: 'Artisans', hi: 'कारीगर' },
  'nav.becomeSeller': { en: 'Become a Seller', hi: 'विक्रेता बनें' },
  'search.placeholder': { en: 'Search products...', hi: 'उत्पाद खोजें...' },
  
  // Hero
  'hero.title': { en: "Discover India's Finest Handmade Treasures", hi: 'भारत के बेहतरीन हस्तनिर्मित खजाने खोजें' },
  'hero.subtitle1': { en: 'Welcome to Handmade Haven — a home for authentic, handcrafted artistry.', hi: 'हस्तनिर्मित हेवन में आपका स्वागत है — प्रामाणिक, हस्तनिर्मित कलाकारी का घर।' },
  'hero.subtitle2': { en: 'Our creations are inspired by nature, life, and imagination.', hi: 'हमारी रचनाएं प्रकृति, जीवन और कल्पना से प्रेरित हैं।' },
  'hero.subtitle3': { en: 'We craft with heart so you can decorate with soul.', hi: 'हम दिल से बनाते हैं ताकि आप आत्मा से सजा सकें।' },
  'hero.shopNow': { en: 'Start Shopping', hi: 'खरीदारी शुरू करें' },
  'hero.becomeSeller': { en: 'Become a Seller', hi: 'विक्रेता बनें' },
  
  // Stats
  'stats.artisans': { en: 'Artisans', hi: 'कारीगर' },
  'stats.products': { en: 'Products', hi: 'उत्पाद' },
  'stats.customers': { en: 'Happy Customers', hi: 'खुश ग्राहक' },
  'stats.states': { en: 'States', hi: 'राज्य' },
  
  // Categories
  'categories.title': { en: 'Shop by Category', hi: 'श्रेणी के अनुसार खरीदें' },
  'categories.pottery': { en: 'Pottery', hi: 'मिट्टी के बर्तन' },
  'categories.textiles': { en: 'Textiles', hi: 'वस्त्र' },
  'categories.jewelry': { en: 'Jewelry', hi: 'आभूषण' },
  'categories.woodwork': { en: 'Woodwork', hi: 'लकड़ी का काम' },
  'categories.paintings': { en: 'Paintings', hi: 'चित्रकारी' },
  'categories.metalwork': { en: 'Metalwork', hi: 'धातु का काम' },
  
  // Sections
  'section.bestSelling': { en: 'Best Selling Products', hi: 'सबसे ज्यादा बिकने वाले उत्पाद' },
  'section.topArtisans': { en: 'Top Artisans', hi: 'शीर्ष कारीगर' },
  'section.viewAll': { en: 'View All', hi: 'सभी देखें' },
  
  // Product Card
  'product.addToCart': { en: 'Add to Cart', hi: 'कार्ट में डालें' },
  'product.outOfStock': { en: 'Out of Stock', hi: 'स्टॉक में नहीं' },
  'product.reviews': { en: 'reviews', hi: 'समीक्षाएं' },
  
  // Artisan
  'artisan.viewProfile': { en: 'View Profile', hi: 'प्रोफ़ाइल देखें' },
  'artisan.phoneVerified': { en: 'Phone Verified', hi: 'फ़ोन सत्यापित' },
  'artisan.notVerified': { en: 'Not Verified', hi: 'सत्यापित नहीं' },
  'artisan.follow': { en: 'Follow', hi: 'फ़ॉलो करें' },
  'artisan.message': { en: 'Message Seller', hi: 'विक्रेता को संदेश' },
  'artisan.products': { en: 'Products by', hi: 'द्वारा उत्पाद' },
  
  // Footer
  'footer.about': { en: 'A home for authentic, handcrafted artistry from India\'s finest artisans. We connect skilled craftspeople with discerning customers who appreciate the beauty of handmade treasures.', hi: 'भारत के बेहतरीन कारीगरों से प्रामाणिक, हस्तनिर्मित कलाकारी का घर। हम कुशल शिल्पकारों को उन ग्राहकों से जोड़ते हैं जो हस्तनिर्मित खजाने की सुंदरता की सराहना करते हैं।' },
  'footer.quickLinks': { en: 'Quick Links', hi: 'त्वरित लिंक' },
  'footer.followUs': { en: 'Follow Us', hi: 'हमें फ़ॉलो करें' },
  'footer.contact': { en: 'Contact', hi: 'संपर्क' },
  'footer.rights': { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।' },
  
  // Filters
  'filter.category': { en: 'Category', hi: 'श्रेणी' },
  'filter.all': { en: 'All', hi: 'सभी' },
  'filter.priceRange': { en: 'Price Range', hi: 'मूल्य सीमा' },
  'filter.sortBy': { en: 'Sort by', hi: 'क्रमबद्ध करें' },
  'filter.newest': { en: 'Newest', hi: 'नवीनतम' },
  'filter.priceLow': { en: 'Price: Low to High', hi: 'मूल्य: कम से अधिक' },
  'filter.priceHigh': { en: 'Price: High to Low', hi: 'मूल्य: अधिक से कम' },
  'filter.rating': { en: 'Rating', hi: 'रेटिंग' },
  
  // Become Seller
  'seller.title': { en: 'Become a Seller', hi: 'विक्रेता बनें' },
  'seller.subtitle': { en: 'Join our community of skilled artisans', hi: 'कुशल कारीगरों के हमारे समुदाय में शामिल हों' },
  'seller.step1': { en: 'Personal Details', hi: 'व्यक्तिगत विवरण' },
  'seller.step2': { en: 'About Your Craft', hi: 'आपकी कला के बारे में' },
  'seller.step3': { en: 'Verification', hi: 'सत्यापन' },
  'seller.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'seller.city': { en: 'City', hi: 'शहर' },
  'seller.state': { en: 'State', hi: 'राज्य' },
  'seller.phone': { en: 'Phone Number', hi: 'फ़ोन नंबर' },
  'seller.bio': { en: 'Tell us about yourself and your craft', hi: 'अपने और अपनी कला के बारे में बताएं' },
  'seller.mainCategory': { en: 'Main Category', hi: 'मुख्य श्रेणी' },
  'seller.uploadDoc': { en: 'Upload Verification Document', hi: 'सत्यापन दस्तावेज़ अपलोड करें' },
  'seller.next': { en: 'Next', hi: 'आगे' },
  'seller.previous': { en: 'Previous', hi: 'पीछे' },
  'seller.submit': { en: 'Submit Application', hi: 'आवेदन जमा करें' },
  'seller.success': { en: 'Thank you! We\'ll review your application.', hi: 'धन्यवाद! हम आपके आवेदन की समीक्षा करेंगे।' },
  
  // Common
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.error': { en: 'Something went wrong', hi: 'कुछ गलत हुआ' },
  'common.noResults': { en: 'No results found', hi: 'कोई परिणाम नहीं मिला' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
