import {
  getProducts,
  saveProducts,
} from './data.js';
import {
  getSiteSettings,
  saveSiteSettings,
} from './settings.js';

function getFormElements() {
  return {
    id: document.getElementById('productId'),
    name: document.getElementById('productName'),
    description: document.getElementById('productDescription'),
    price: document.getElementById('productPrice'),
    category: document.getElementById('productCategory'),
    sizes: document.getElementById('productSizes'),
    image: document.getElementById('productImage'),
    bestDeal: document.getElementById('productBestDeal'),
    error: document.getElementById('productFormError'),
    success: document.getElementById('productFormSuccess'),
    title: document.getElementById('adminFormTitle'),
    saveBtn: document.getElementById('productSaveBtn'),
  };
}

function clearForm() {
  const els = getFormElements();
  els.id.value = '';
  els.name.value = '';
  els.description.value = '';
  els.price.value = '';
  els.category.value = '';
  els.sizes.value = '';
  els.image.value = '';
  els.bestDeal.checked = false;
  els.error.textContent = '';
  els.success.textContent = '';
  if (els.title) els.title.textContent = 'Add new product';
  if (els.saveBtn) els.saveBtn.textContent = 'Save product';
}

function renderProductsTable() {
  const tbody = document.getElementById('adminProductsBody');
  if (!tbody) return;
  const products = getProducts();
  tbody.innerHTML = '';

  if (!products.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.textContent = 'No products yet. Use the form to add your first product.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  products.forEach((product) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category || '-'}</td>
      <td>₹${Number(product.price || 0).toLocaleString('en-IN')}</td>
      <td>${(product.sizes || []).join(', ') || '-'}</td>
      <td>${product.isBestDeal ? '<span class="tag">Yes</span>' : '<span class="tag tag-muted">No</span>'}</td>
      <td></td>
    `;
    const actionsTd = tr.lastElementChild;
    actionsTd.className = 'admin-row-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn-text';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => loadProductIntoForm(product.id));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-text';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      if (!window.confirm('Delete this product? This cannot be undone.')) return;
      const updated = getProducts().filter((p) => p.id !== product.id);
      saveProducts(updated);
      renderProductsTable();
    });

    actionsTd.append(editBtn, delBtn);
    tbody.appendChild(tr);
  });
}

function loadProductIntoForm(id) {
  const els = getFormElements();
  const product = getProducts().find((p) => p.id === id);
  if (!product) return;
  els.id.value = product.id;
  els.name.value = product.name || '';
  els.description.value = product.description || '';
  els.price.value = product.price != null ? String(product.price) : '';
  els.category.value = product.category || '';
  els.sizes.value = (product.sizes || []).join(',');
  els.image.value = product.image || '';
  els.bestDeal.checked = !!product.isBestDeal;
  els.error.textContent = '';
  els.success.textContent = '';
  if (els.title) els.title.textContent = 'Edit product';
  if (els.saveBtn) els.saveBtn.textContent = 'Update product';
}

function initForm() {
  const form = document.getElementById('productForm');
  const resetBtn = document.getElementById('productResetBtn');
  if (!form) return;
  const els = getFormElements();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    els.error.textContent = '';
    els.success.textContent = '';

    const name = els.name.value.trim();
    const price = Number(els.price.value);
    const category = els.category.value;

    if (!name || !price || !category) {
      els.error.textContent = 'Name, price and category are required.';
      return;
    }

    const sizes =
      els.sizes.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [];

    const products = getProducts();
    const existingId = els.id.value;

    if (existingId) {
      const index = products.findIndex((p) => p.id === existingId);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          name,
          price,
          category,
          description: els.description.value.trim(),
          sizes,
          image: els.image.value.trim(),
          isBestDeal: els.bestDeal.checked,
        };
      }
    } else {
      const id =
        name.toLowerCase().replace(/\s+/g, '-') +
        '-' +
        Math.random().toString(36).slice(2, 6);
      products.push({
        id,
        name,
        price,
        category,
        description: els.description.value.trim(),
        sizes,
        image: els.image.value.trim(),
        isBestDeal: els.bestDeal.checked,
      });
    }

    saveProducts(products);
    renderProductsTable();
    els.success.textContent = existingId ? 'Product updated.' : 'Product added.';

    if (!existingId) {
      clearForm();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => clearForm());
  }
}

function initExportImport() {
  const exportBtn = document.getElementById('adminExportBtn');
  const importInput = document.getElementById('adminImportInput');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = JSON.stringify(getProducts(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'thulir-products.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (!Array.isArray(parsed)) throw new Error('Invalid JSON');
          saveProducts(parsed);
          renderProductsTable();
          clearForm();
        } catch {
          window.alert('Could not import file. Please make sure it is a valid products JSON.');
        } finally {
          importInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initExportImport();
  renderProductsTable();
  initSettingsForm();
});

function initSettingsForm() {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  const settings = getSiteSettings();

  const brandName = document.getElementById('setBrandName');
  const logoUrl = document.getElementById('setLogoUrl');
  const phone = document.getElementById('setPhone');
  const whatsapp = document.getElementById('setWhatsApp');
  const email = document.getElementById('setEmail');
  const address = document.getElementById('setAddress');
  const instagram = document.getElementById('setInstagram');
  const heroTitle = document.getElementById('setHeroTitle');
  const heroSubtitle = document.getElementById('setHeroSubtitle');
  const shippingText = document.getElementById('setShippingText');
  const noReturnText = document.getElementById('setNoReturnText');
  const paymentInstructions = document.getElementById('setPaymentInstructions');
  const qrFile = document.getElementById('setQrFile');
  const qrUrl = document.getElementById('setQrUrl');
  const qrPreview = document.getElementById('qrPreview');
  const error = document.getElementById('settingsFormError');
  const success = document.getElementById('settingsFormSuccess');

  brandName.value = settings.brandName || '';
  logoUrl.value = settings.logoUrl || '';
  phone.value = settings.phone || '';
  whatsapp.value = settings.whatsapp || '';
  email.value = settings.email || '';
  address.value = settings.address || '';
  instagram.value = settings.instagram || '';
  heroTitle.value = settings.heroTitle || '';
  heroSubtitle.value = settings.heroSubtitle || '';
  shippingText.value = settings.shippingText || '';
  noReturnText.value = settings.noReturnText || '';
  paymentInstructions.value = settings.paymentInstructions || '';
  qrUrl.value = settings.paymentQrData && !settings.paymentQrData.startsWith('data:')
    ? settings.paymentQrData
    : '';
  if (settings.paymentQrData) {
    qrPreview.src = settings.paymentQrData;
  }

  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.sessionStorage.removeItem('admin_logged_in');
      window.location.replace('index.html');
    });
  }

  qrFile.addEventListener('change', () => {
    const file = qrFile.files && qrFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === 'string') {
        qrPreview.src = dataUrl;
        qrUrl.value = '';
        saveSiteSettings({ paymentQrData: dataUrl });
        success.textContent = 'QR code updated from uploaded image. Remember to save settings.';
        error.textContent = '';
      }
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.textContent = '';
    success.textContent = '';

    const updated = saveSiteSettings({
      brandName: brandName.value.trim() || settings.brandName,
      logoUrl: logoUrl.value.trim(),
      phone: phone.value.trim(),
      whatsapp: whatsapp.value.trim(),
      email: email.value.trim(),
      address: address.value,
      instagram: instagram.value.trim(),
      heroTitle: heroTitle.value.trim(),
      heroSubtitle: heroSubtitle.value,
      shippingText: shippingText.value,
      noReturnText: noReturnText.value,
      paymentInstructions: paymentInstructions.value,
      paymentQrData: qrUrl.value.trim() || settings.paymentQrData,
    });

    if (updated.paymentQrData) {
      qrPreview.src = updated.paymentQrData;
    }

    success.textContent = 'Site settings saved.';
  });
}


