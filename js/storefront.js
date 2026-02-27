import {
  getProducts,
  getCart,
  saveCart,
} from './data.js';
import {
  getSiteSettings,
} from './settings.js';

function initNav() {
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function initYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
}

function applySiteSettings() {
  const settings = getSiteSettings();

  // Brand name text
  document
    .querySelectorAll('.brand-name')
    .forEach((el) => (el.textContent = settings.brandName));

  // Footer location / address if present
  document
    .querySelectorAll('.footer-location')
    .forEach((el) => (el.textContent = settings.address.replace(/\n/g, ' ')));

  // Hero content
  const heroTitle = document.querySelector('.hero-copy h1');
  if (heroTitle && settings.heroTitle) heroTitle.textContent = settings.heroTitle;
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && settings.heroSubtitle) {
    heroSubtitle.textContent = settings.heroSubtitle;
  }

  // WhatsApp floating button + contact links
  const waNumber = settings.whatsapp || settings.phone;
  const waLink = document.querySelector('.whatsapp-float');
  if (waLink && waNumber) {
    const base = `https://wa.me/${encodeURIComponent(waNumber)}`;
    const text = encodeURIComponent(
      `Hi ${settings.brandName}, I'd like to know more about your collections.`,
    );
    waLink.href = `${base}?text=${text}`;
  }

  document
    .querySelectorAll('a[href^="https://wa.me/9629226235"],a[href^="https://wa.me/"]')
    .forEach((el) => {
      if (!waNumber) return;
      const base = `https://wa.me/${encodeURIComponent(waNumber)}`;
      if (el.classList.contains('whatsapp-float')) return;
      el.href = base;
    });

  // Email
  if (settings.email) {
    document
      .querySelectorAll('a[href^="mailto:thulirfabrics28"],a[href^="mailto:"]')
      .forEach((el) => {
        el.href = `mailto:${settings.email}`;
      });
  }

  // Instagram
  if (settings.instagram) {
    document
      .querySelectorAll(
        'a[href*="instagram.com/illam_thulir_fabrics"],a[data-role="insta-link"]',
      )
      .forEach((el) => {
        el.href = settings.instagram;
      });
  }

  // Shipping + no return blocks (if present on page)
  const shippingBlock = document.querySelector(
    '.info-item h3 + p strong, .shipping-text',
  );
  if (shippingBlock && settings.shippingText) {
    shippingBlock.textContent = settings.shippingText;
  }

  const noReturnBlock = document.querySelector('.no-return-text');
  if (noReturnBlock && settings.noReturnText) {
    noReturnBlock.textContent = settings.noReturnText;
  }
}

function updateCartBadge() {
  const badge = document.getElementById('navCartCount');
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  badge.textContent = String(total);
}

function addToCart(productId, size) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId && item.size === size);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, size, quantity: 1 });
  }
  saveCart(cart);
  updateCartBadge();
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  card.dataset.category = product.category;

  const media = document.createElement('div');
  media.className = 'product-media';
  const img = document.createElement('div');
  img.className = 'product-image';
  if (product.image) {
    img.style.backgroundImage = `url('${product.image}')`;
  }
  media.appendChild(img);
  if (product.isBestDeal) {
    const badge = document.createElement('div');
    badge.className = 'product-badge';
    badge.textContent = 'Best deal';
    media.appendChild(badge);
  }

  const body = document.createElement('div');
  body.className = 'product-body';
  const title = document.createElement('h3');
  title.className = 'product-title';
  title.textContent = product.name;
  const desc = document.createElement('p');
  desc.className = 'product-desc';
  desc.textContent = product.description;

  const meta = document.createElement('div');
  meta.className = 'product-meta';
  const price = document.createElement('span');
  price.className = 'product-price';
  price.textContent = `₹${product.price.toLocaleString('en-IN')}`;
  const cat = document.createElement('span');
  cat.className = 'product-category';
  cat.textContent = product.category;
  meta.append(price, cat);

  const sizesWrap = document.createElement('div');
  sizesWrap.className = 'product-sizes';
  let selectedSize = null;
  (product.sizes || []).forEach((size) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'size-chip';
    btn.textContent = size;
    btn.addEventListener('click', () => {
      selectedSize = size;
      sizesWrap.querySelectorAll('.size-chip').forEach((el) => el.classList.remove('selected'));
      btn.classList.add('selected');
    });
    sizesWrap.appendChild(btn);
  });

  const actions = document.createElement('div');
  actions.className = 'product-actions';
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-primary';
  addBtn.textContent = 'Add to cart';
  const note = document.createElement('span');
  note.className = 'product-note';
  note.textContent = 'Select a size first';
  addBtn.addEventListener('click', () => {
    if (!selectedSize && product.sizes && product.sizes.length === 1) {
      selectedSize = product.sizes[0];
    }
    if (!selectedSize) {
      note.textContent = 'Please choose a size to continue.';
      note.style.color = '#b3261e';
      return;
    }
    addToCart(product.id, selectedSize);
    note.textContent = 'Added to cart.';
    note.style.color = '#0b7a4b';
    setTimeout(() => {
      note.textContent = 'Added to cart.';
      note.style.color = '';
    }, 1500);
  });
  actions.append(addBtn, note);

  body.append(title, desc, meta, sizesWrap, actions);
  card.append(media, body);
  return card;
}

function initFeatured() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;
  const products = getProducts();
  const featured = products.filter((p) => p.isBestDeal || p.category === 'Best Deals').slice(0, 6);
  if (!featured.length) {
    container.textContent = 'Products will appear here soon.';
    return;
  }
  featured.forEach((p) => container.appendChild(createProductCard(p)));
}

function initProductsGrid() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const products = getProducts();
  products.forEach((p) => grid.appendChild(createProductCard(p)));

  const chips = Array.from(document.querySelectorAll('.chip'));
  const searchInput = document.getElementById('productSearch');

  function applyFilters() {
    const activeChip = chips.find((c) => c.classList.contains('chip-active'));
    const filter = activeChip ? activeChip.dataset.filter : 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();
    const cards = Array.from(grid.children);
    cards.forEach((card) => {
      const cat = card.dataset.category;
      const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';
      let visible = true;
      if (filter && filter !== 'all') {
        if (filter === 'Best Deals') {
          visible =
            card.querySelector('.product-badge') ||
            cat === 'Best Deals';
        } else {
          visible = cat === filter;
        }
      }
      if (query && visible) {
        visible = title.includes(query) || desc.includes(query);
      }
      card.style.display = visible ? '' : 'none';
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('chip-active'));
      chip.classList.add('chip-active');
      applyFilters();
      const hashCategory = chip.dataset.filter;
      if (hashCategory && hashCategory !== 'all') {
        history.replaceState(null, '', `#${encodeURIComponent(hashCategory)}`);
      } else {
        history.replaceState(null, '', location.pathname);
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => applyFilters());
  }

  if (location.hash) {
    const decoded = decodeURIComponent(location.hash.slice(1));
    const targetChip = chips.find((chip) => chip.dataset.filter === decoded);
    if (targetChip) {
      chips.forEach((c) => c.classList.remove('chip-active'));
      targetChip.classList.add('chip-active');
      applyFilters();
    }
  }
}

function initReviews() {
  const reviewsContainer = document.getElementById('reviewsGrid');
  if (!reviewsContainer) return;
  const reviews = [
    {
      name: 'Priya, Coimbatore',
      rating: 5,
      text: 'Lovely fabrics and very comfortable fits. The team helped me pick sizes over WhatsApp.',
    },
    {
      name: 'Swapna, Tiruppur',
      rating: 5,
      text: 'Kids collections are so soft and cute. My daughter loves her frocks from here.',
    },
    {
      name: 'Deepa, Chennai',
      rating: 4,
      text: 'Maternity kurtas were a lifesaver – modest, breathable and feeding friendly.',
    },
  ];
  reviews.forEach((review) => {
    const card = document.createElement('article');
    card.className = 'review-card';
    const text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = `"${review.text}"`;
    const meta = document.createElement('div');
    meta.className = 'review-meta';
    const name = document.createElement('span');
    name.textContent = review.name;
    const stars = document.createElement('span');
    stars.className = 'review-stars';
    stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    meta.append(name, stars);
    card.append(text, meta);
    reviewsContainer.appendChild(card);
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput = document.getElementById('contactMessage');
  const waButton = document.getElementById('contactWhatsApp');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();
    const subject = encodeURIComponent('Enquiry – Illam Thulir Fabrics');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:thulirfabrics28@gmail.com?subject=${subject}&body=${body}`;
  });

  if (waButton) {
    waButton.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const message = msgInput.value.trim();
      const text = encodeURIComponent(
        `Hi Illam Thulir Fabrics,\n\nName: ${name || '-'}\n\nMessage:\n${message || '-'}`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    });
  }
}

function initAdminShortcut() {
  // Hidden admin entry point for the owner (no visible admin link).
  // Ctrl + Shift + A → open login.html
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'login.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initYear();
  applySiteSettings();
  updateCartBadge();
  initFeatured();
  initProductsGrid();
  initReviews();
  initContactForm();
  initAdminShortcut();
});

