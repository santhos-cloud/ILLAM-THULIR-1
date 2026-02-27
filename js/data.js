const PRODUCT_STORAGE_KEY = 'thulir_products';
const CART_STORAGE_KEY = 'thulir_cart';

const DEFAULT_PRODUCTS = [
  {
    id: 'ethnic-1',
    name: 'Blush Handloom Saree',
    description: 'Soft cotton saree with subtle zari border for daily elegance.',
    price: 1890,
    category: 'Ethnic Wear',
    sizes: ['Free'],
    image: 'assets/ethnic-saree-1.jpg',
    isBestDeal: false,
  },
  {
    id: 'ethnic-2',
    name: 'Marigold Kurta Set',
    description: 'Straight-fit kurta with matching pants, perfect for functions.',
    price: 2290,
    category: 'Ethnic Wear',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/ethnic-kurta-1.jpg',
    isBestDeal: true,
  },
  {
    id: 'casual-1',
    name: 'Everyday Pastel Dress',
    description: 'Breathable A-line dress for errands and coffee dates.',
    price: 1490,
    category: 'Casuals',
    sizes: ['S', 'M', 'L'],
    image: 'assets/casual-dress-1.jpg',
    isBestDeal: false,
  },
  {
    id: 'kids-1',
    name: 'Little Blossom Frock',
    description: 'Soft cotton frock with gentle gathers, perfect for play.',
    price: 990,
    category: 'Kids',
    sizes: ['1-2Y', '3-4Y', '5-6Y'],
    image: 'assets/kids-frock-1.jpg',
    isBestDeal: true,
  },
  {
    id: 'maternity-1',
    name: 'Maternity Front-Open Kurta',
    description: 'Feeding-friendly kurta with extra room and soft fabric.',
    price: 1990,
    category: 'Maternity',
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: 'assets/maternity-kurta-1.jpg',
    isBestDeal: false,
  },
  {
    id: 'deal-1',
    name: 'Everyday Kurta Duo',
    description: 'Set of two everyday kurtas in soft pastel hues.',
    price: 2490,
    category: 'Best Deals',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/deals-kurta-1.jpg',
    isBestDeal: true,
  },
];

function safeParseJSON(value, fallback) {
  try {
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function getProducts() {
  const stored = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
  const products = safeParseJSON(stored, null);
  if (!Array.isArray(products) || products.length === 0) {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return [...DEFAULT_PRODUCTS];
  }
  return products;
}

export function saveProducts(products) {
  window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id);
}

export function getCart() {
  const stored = window.localStorage.getItem(CART_STORAGE_KEY);
  const cart = safeParseJSON(stored, []);
  return Array.isArray(cart) ? cart : [];
}

export function saveCart(cart) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function clearCart() {
  window.localStorage.removeItem(CART_STORAGE_KEY);
}

