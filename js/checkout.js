import {
  getCart,
  clearCart,
  getProducts,
} from './data.js';
import {
  getSiteSettings,
  savePaymentInfo,
} from './settings.js';

const WHATSAPP_NUMBER = '9629226235';

function updateCartBadgeAfterClear() {
  const badge = document.getElementById('navCartCount');
  if (badge) {
    badge.textContent = '0';
  }
}

function buildCheckout() {
  const container = document.getElementById('checkoutLayout');
  if (!container) return;
  const settings = getSiteSettings();
  const cart = getCart();
  const products = getProducts();

  if (!cart.length) {
    container.innerHTML = `
      <div class="checkout-card checkout-success">
        <p>Your cart is empty.</p>
        <p><a href="products.html" class="btn btn-primary">Browse products</a></p>
      </div>
    `;
    return;
  }

  let subtotal = 0;

  const summaryCard = document.createElement('section');
  summaryCard.className = 'checkout-card';
  const summaryTitle = document.createElement('h2');
  summaryTitle.textContent = 'Order summary';
  summaryCard.appendChild(summaryTitle);

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    const row = document.createElement('div');
    row.className = 'checkout-summary-item';
    row.innerHTML = `
      <span>${product.name} × ${item.quantity} (${item.size})</span>
      <span>₹${lineTotal.toLocaleString('en-IN')}</span>
    `;
    summaryCard.appendChild(row);
  });

  const totalRow = document.createElement('div');
  totalRow.className = 'checkout-summary-item';
  totalRow.style.fontWeight = '600';
  totalRow.innerHTML = `
    <span>Subtotal</span>
    <span>₹${subtotal.toLocaleString('en-IN')}</span>
  `;

  const policy = document.createElement('p');
  policy.className = 'checkout-policy';
  policy.innerHTML =
    (settings.shippingText ||
      'Standard delivery timeline is <strong>2–5 business days</strong> from dispatch.') +
    ' Shipping charges and final confirmation will be shared with you personally.';

  const noReturn = document.createElement('p');
  noReturn.className = 'checkout-policy';
  noReturn.innerHTML =
    settings.noReturnText ||
    'Please note we currently follow a <strong>no return policy</strong>. For any concerns around sizing or quality, we encourage you to reach us on WhatsApp before confirming.';

  summaryCard.append(totalRow, policy, noReturn);

  const formCard = document.createElement('section');
  formCard.className = 'checkout-card';
  formCard.innerHTML = `
    <h2>Delivery details</h2>
    <form id="checkoutForm">
      <div class="field-grid">
        <label class="field">
          <span>Full name</span>
          <input required class="input" id="coName" />
        </label>
        <label class="field">
          <span>Phone number</span>
          <input required class="input" id="coPhone" type="tel" />
        </label>
      </div>
      <label class="field">
        <span>Email (optional)</span>
        <input class="input" id="coEmail" type="email" />
      </label>
      <label class="field">
        <span>Full address</span>
        <textarea required class="input" id="coAddress" rows="3"></textarea>
      </label>
      <div class="field-grid">
        <label class="field">
          <span>City / Town</span>
          <input required class="input" id="coCity" />
        </label>
        <label class="field">
          <span>State</span>
          <input required class="input" id="coState" />
        </label>
      </div>
      <label class="field">
        <span>Pincode</span>
        <input required class="input" id="coPincode" pattern="[0-9]{6}" />
      </label>
      <label class="field">
        <span>Notes (preferred delivery time, landmarks, etc.)</span>
        <textarea class="input" id="coNotes" rows="3"></textarea>
      </label>
      <p class="checkout-policy">
        On submitting, a WhatsApp window will open with your order details so you can confirm directly with Illam Thulir Fabrics.
      </p>
      <div class="contact-actions">
        <button type="submit" class="btn btn-primary">Confirm via WhatsApp</button>
        <button type="button" id="proceedPaymentBtn" class="btn btn-outline">Proceed to payment</button>
      </div>
      <p id="coError" class="form-error" aria-live="polite"></p>
    </form>
  `;

  container.innerHTML = '';
  container.append(summaryCard, formCard);

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('coName').value.trim();
    const phone = document.getElementById('coPhone').value.trim();
    const email = document.getElementById('coEmail').value.trim();
    const address = document.getElementById('coAddress').value.trim();
    const city = document.getElementById('coCity').value.trim();
    const state = document.getElementById('coState').value.trim();
    const pincode = document.getElementById('coPincode').value.trim();
    const notes = document.getElementById('coNotes').value.trim();
    const error = document.getElementById('coError');

    if (!name || !phone || !address || !city || !state || !pincode) {
      error.textContent = 'Please fill in all required fields.';
      return;
    }

    const orderLines = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const lineTotal = product.price * item.quantity;
        return `${product.name} (${item.size}) × ${item.quantity} – ₹${lineTotal.toLocaleString('en-IN')}`;
      })
      .filter(Boolean)
      .join('\n');

    const text = encodeURIComponent(
      `New order request from website\n\n` +
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email || '-'}\n\n` +
        `Address:\n${address}\n${city}, ${state} - ${pincode}\n\n` +
        `Order items:\n${orderLines}\n\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\n\n` +
        `Notes:\n${notes || '-'}`,
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    clearCart();
    updateCartBadgeAfterClear();

    container.innerHTML = `
      <div class="checkout-card checkout-success">
        <h2>Thank you!</h2>
        <p>Your order details have been prepared in WhatsApp. Please send the message there to confirm your order.</p>
        <p class="checkout-policy">
          You will also receive final shipping costs and delivery expectations in the chat.
        </p>
        <p><a href="index.html" class="btn btn-primary">Back to home</a></p>
      </div>
    `;
  });

  const proceedPaymentBtn = document.getElementById('proceedPaymentBtn');
  if (proceedPaymentBtn) {
    proceedPaymentBtn.addEventListener('click', () => {
      // Save current subtotal for the payment page
      savePaymentInfo({
        subtotal,
        createdAt: Date.now(),
      });
      window.location.href = 'payment.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  buildCheckout();
});

