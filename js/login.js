import { initPasswordResetFlow } from './reset.js';

const ADMIN_ID = 'THULIR-28';
const ADMIN_EMAIL = 'thulirfabrics28@gmail.com';
const DEFAULT_PASSWORD = 'suba@123';
const ADMIN_PHONE = '9629226235';

function seedAdminCredentials() {
  // Required keys:
  // thulir_admin_id, thulir_admin_email, thulir_admin_password, thulir_admin_phone
  if (!window.localStorage.getItem('thulir_admin_id')) {
    window.localStorage.setItem('thulir_admin_id', ADMIN_ID);
  }
  if (!window.localStorage.getItem('thulir_admin_email')) {
    window.localStorage.setItem('thulir_admin_email', ADMIN_EMAIL);
  }
  if (!window.localStorage.getItem('thulir_admin_password')) {
    window.localStorage.setItem('thulir_admin_password', DEFAULT_PASSWORD);
  }
  if (!window.localStorage.getItem('thulir_admin_phone')) {
    window.localStorage.setItem('thulir_admin_phone', ADMIN_PHONE);
  }
}

function getSavedPassword() {
  return window.localStorage.getItem('thulir_admin_password') || '';
}

function initLogin() {
  const loginSection = document.getElementById('loginSection');
  const resetSection = document.getElementById('resetSection');

  const form = document.getElementById('loginForm');
  const idInput = document.getElementById('adminId');
  const emailInput = document.getElementById('adminEmail');
  const pwdInput = document.getElementById('adminPassword');
  const error = document.getElementById('loginError');

  const forgotLink = document.getElementById('forgotLink');
  const backToLoginBtn = document.getElementById('backToLogin');

  const resetFlow = initPasswordResetFlow({
    resetSection,
    loginSection,
    backToLoginBtn,
  });

  forgotLink.addEventListener('click', () => {
    error.textContent = '';
    resetFlow.showReset();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.textContent = '';

    const id = idInput.value.trim();
    const email = emailInput.value.trim();
    const password = pwdInput.value;

    const savedPassword = getSavedPassword();

    const ok =
      id === ADMIN_ID &&
      email === ADMIN_EMAIL &&
      password === savedPassword;

    if (!ok) {
      error.textContent = 'Invalid ID, email, or password';
      return;
    }

    window.sessionStorage.setItem('admin_logged_in', 'true');
    window.location.href = 'admin.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  seedAdminCredentials();
  initLogin();
});

