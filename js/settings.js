const SETTINGS_STORAGE_KEY = 'thulir_site_settings';
const PAYMENT_INFO_KEY = 'thulir_payment_info';

const DEFAULT_SETTINGS = {
  brandName: 'ILLAM THULIR FABRICS',
  logoUrl: '', // optional, currently using text logo
  phone: '9629226235',
  whatsapp: '9629226235',
  email: 'thulirfabrics28@gmail.com',
  address:
    'Illam Thulir Fabrics,\nJallipatti, Sulur Thaluka,\nCoimbatore - 641671',
  instagram: 'https://instagram.com/illam_thulir_fabrics',
  heroTitle: 'Soft, elegant styles for every woman.',
  heroSubtitle:
    'Discover sarees, kurtas, kids wear and maternity looks curated with care from Illam Thulir Fabrics – Jallipatti, Coimbatore.',
  shippingText: 'Standard delivery timeline is 2–5 business days from dispatch.',
  noReturnText:
    'Due to the nature of our products, we currently follow a no return policy. For sizing help or queries, please reach us on WhatsApp before ordering.',
  paymentInstructions:
    'Please scan the QR code using your UPI app to complete the payment. Share the payment screenshot with us on WhatsApp along with your order ID.',
  paymentQrData: '', // URL or data:image/... base64 string
};

function safeParse(value, fallback) {
  try {
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getSiteSettings() {
  const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  const stored = safeParse(raw, null);
  if (!stored) {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS),
    );
    return { ...DEFAULT_SETTINGS };
  }
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSiteSettings(partialSettings) {
  const current = getSiteSettings();
  const updated = { ...current, ...partialSettings };
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getPaymentInfo() {
  const raw = window.localStorage.getItem(PAYMENT_INFO_KEY);
  return safeParse(raw, null);
}

export function savePaymentInfo(info) {
  if (!info) {
    window.localStorage.removeItem(PAYMENT_INFO_KEY);
  } else {
    window.localStorage.setItem(PAYMENT_INFO_KEY, JSON.stringify(info));
  }
}

