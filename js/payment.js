import {
  getSiteSettings,
  getPaymentInfo,
} from './settings.js';

function buildPayment() {
  const container = document.getElementById('paymentLayout');
  if (!container) return;

  const settings = getSiteSettings();
  const paymentInfo = getPaymentInfo();

  const amount = paymentInfo?.subtotal ?? 0;

  const detailsCard = document.createElement('section');
  detailsCard.className = 'checkout-card';
  detailsCard.innerHTML = `
    <h2>Payment details</h2>
    <p class="checkout-summary-item">
      <span>Amount to pay</span>
      <span>₹${amount.toLocaleString('en-IN')}</span>
    </p>
    <p class="checkout-policy">
      ${settings.paymentInstructions || 'Please scan the QR code with your UPI app to complete the payment. Then share the payment screenshot with us on WhatsApp.'}
    </p>
  `;

  const qrCard = document.createElement('section');
  qrCard.className = 'checkout-card';
  const title = document.createElement('h2');
  title.textContent = 'Scan QR to pay';
  qrCard.appendChild(title);

  if (settings.paymentQrData) {
    const img = document.createElement('img');
    img.src = settings.paymentQrData;
    img.alt = 'Payment QR code';
    img.style.maxWidth = '260px';
    img.style.margin = '0 auto 0.8rem';
    img.style.display = 'block';
    qrCard.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'badge-soft';
    placeholder.style.display = 'inline-block';
    placeholder.style.marginBottom = '0.6rem';
    placeholder.textContent = 'QR code not set yet – please contact the store on WhatsApp';
    qrCard.appendChild(placeholder);
  }

  const note = document.createElement('p');
  note.className = 'checkout-policy';
  note.textContent =
    'After completing the payment, please share your payment reference and order details with us on WhatsApp for faster confirmation.';
  qrCard.appendChild(note);

  const actions = document.createElement('div');
  actions.className = 'contact-actions';
  const backBtn = document.createElement('a');
  backBtn.href = 'checkout.html';
  backBtn.className = 'btn btn-ghost';
  backBtn.textContent = 'Back to checkout';
  const waBtn = document.createElement('a');
  const waNumber = settings.whatsapp || settings.phone;
  if (waNumber) {
    const text = encodeURIComponent(
      `Hi ${settings.brandName}, I have completed a payment of ₹${amount.toLocaleString(
        'en-IN',
      )}. Here are my order details:`,
    );
    waBtn.href = `https://wa.me/${encodeURIComponent(waNumber)}?text=${text}`;
  } else {
    waBtn.href = 'https://wa.me/';
  }
  waBtn.target = '_blank';
  waBtn.rel = 'noopener';
  waBtn.className = 'btn btn-primary';
  waBtn.textContent = 'Message on WhatsApp';
  actions.append(backBtn, waBtn);
  qrCard.appendChild(actions);

  container.innerHTML = '';
  container.append(detailsCard, qrCard);
}

document.addEventListener('DOMContentLoaded', () => {
  buildPayment();
});

