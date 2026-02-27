import {
  getCart,
  saveCart,
  getProducts,
} from './data.js';

function updateCartBadgeFromCart() {
  const badge = document.getElementById('navCartCount');
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  badge.textContent = String(total);
}

function buildCartView() {
  const container = document.getElementById('cartContainer');
  if (!container) return;
  const cart = getCart();
  const products = getProducts();

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty text-center">
        <p>Your cart is empty right now.</p>
        <p><a href="products.html" class="btn btn-primary">Browse products</a></p>
      </div>
    `;
    return;
  }

  let subtotal = 0;

  const itemsDiv = document.createElement('div');
  itemsDiv.className = 'cart-items';

  cart.forEach((item, index) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const row = document.createElement('div');
    row.className = 'cart-item-row';

    const thumb = document.createElement('div');
    thumb.className = 'cart-thumb';
    if (product.image) {
      thumb.style.backgroundImage = `url('${product.image}')`;
    }

    const info = document.createElement('div');
    info.className = 'cart-item-info';
    const title = document.createElement('div');
    title.className = 'cart-item-title';
    title.textContent = product.name;
    const meta = document.createElement('div');
    meta.className = 'cart-item-meta';
    meta.textContent = `Size: ${item.size} • ₹${product.price.toLocaleString('en-IN')}`;

    const qtyControl = document.createElement('div');
    qtyControl.className = 'cart-qty-control';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'cart-qty-btn';
    minus.textContent = '−';
    const value = document.createElement('span');
    value.className = 'cart-qty-value';
    value.textContent = String(item.quantity);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'cart-qty-btn';
    plus.textContent = '+';

    minus.addEventListener('click', () => {
      const updated = getCart();
      const current = updated[index];
      if (!current) return;
      if (current.quantity > 1) {
        current.quantity -= 1;
      } else {
        updated.splice(index, 1);
      }
      saveCart(updated);
      buildCartView();
      updateCartBadgeFromCart();
    });

    plus.addEventListener('click', () => {
      const updated = getCart();
      const current = updated[index];
      if (!current) return;
      current.quantity += 1;
      saveCart(updated);
      buildCartView();
      updateCartBadgeFromCart();
    });

    qtyControl.append(minus, value, plus);

    info.append(title, meta, qtyControl);

    const price = document.createElement('div');
    price.className = 'cart-item-price';
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    price.innerHTML = `
      <div>₹${lineTotal.toLocaleString('en-IN')}</div>
      <button class="cart-item-remove" type="button">Remove</button>
    `;

    price.querySelector('.cart-item-remove').addEventListener('click', () => {
      const updated = getCart();
      updated.splice(index, 1);
      saveCart(updated);
      buildCartView();
      updateCartBadgeFromCart();
    });

    row.append(thumb, info, price);
    itemsDiv.appendChild(row);
  });

  const summary = document.createElement('aside');
  summary.className = 'cart-summary';
  const subtotalRow = document.createElement('div');
  subtotalRow.className = 'cart-summary-row total';
  subtotalRow.innerHTML = `<span>Subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span>`;
  const shippingRow = document.createElement('div');
  shippingRow.className = 'cart-summary-row';
  shippingRow.innerHTML = '<span>Shipping</span><span>Shared on confirmation</span>';
  const note = document.createElement('p');
  note.className = 'cart-note';
  note.textContent = 'Estimated delivery: 2–5 business days after dispatch.';

  const checkoutBtn = document.createElement('a');
  checkoutBtn.href = 'checkout.html';
  checkoutBtn.className = 'btn btn-primary';
  checkoutBtn.textContent = 'Proceed to checkout';

  summary.append(subtotalRow, shippingRow, note, checkoutBtn);

  container.innerHTML = '';
  container.append(itemsDiv, summary);
  updateCartBadgeFromCart();
}

document.addEventListener('DOMContentLoaded', () => {
  buildCartView();
});

