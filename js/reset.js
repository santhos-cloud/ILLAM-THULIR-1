const ADMIN_ID_CONSTANT = 'THULIR-28';

function getAdminPhone() {
  return window.localStorage.getItem('thulir_admin_phone') || '';
}

function getAdminId() {
  return window.localStorage.getItem('thulir_admin_id') || ADMIN_ID_CONSTANT;
}

export function initPasswordResetFlow(options) {
  const {
    resetSection,
    loginSection,
    backToLoginBtn,
  } = options;

  const step1 = document.getElementById('resetStep1');
  const step2 = document.getElementById('resetStep2');
  const step3 = document.getElementById('resetStep3');

  const phoneInput = document.getElementById('resetPhone');
  const idInput = document.getElementById('resetAdminId');
  const newPwd = document.getElementById('newPassword');
  const confirmPwd = document.getElementById('confirmPassword');

  const err1 = document.getElementById('resetError1');
  const err2 = document.getElementById('resetError2');
  const err3 = document.getElementById('resetError3');
  const success = document.getElementById('resetSuccess');

  function showReset() {
    loginSection.classList.add('hidden');
    resetSection.classList.remove('hidden');
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    err1.textContent = '';
    err2.textContent = '';
    err3.textContent = '';
    success.textContent = '';
    phoneInput.value = '';
    idInput.value = '';
    newPwd.value = '';
    confirmPwd.value = '';
    setTimeout(() => phoneInput.focus(), 10);
  }

  function showLogin() {
    resetSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  }

  backToLoginBtn.addEventListener('click', () => showLogin());

  step1.addEventListener('submit', (e) => {
    e.preventDefault();
    err1.textContent = '';
    const phone = phoneInput.value.trim();
    if (phone !== getAdminPhone()) {
      err1.textContent = 'Phone number not recognized';
      return;
    }
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    setTimeout(() => idInput.focus(), 10);
  });

  step2.addEventListener('submit', (e) => {
    e.preventDefault();
    err2.textContent = '';
    const id = idInput.value.trim();
    if (id !== getAdminId() || id !== ADMIN_ID_CONSTANT) {
      err2.textContent = 'Incorrect ID number';
      return;
    }
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    setTimeout(() => newPwd.focus(), 10);
  });

  step3.addEventListener('submit', (e) => {
    e.preventDefault();
    err3.textContent = '';
    success.textContent = '';

    const a = newPwd.value;
    const b = confirmPwd.value;

    if (!a || !b) {
      err3.textContent = 'Both fields are required.';
      return;
    }
    if (a !== b) {
      err3.textContent = 'Passwords do not match.';
      return;
    }

    window.localStorage.setItem('thulir_admin_password', a);
    window.sessionStorage.removeItem('admin_logged_in');

    success.textContent = 'Password updated successfully. Please login again.';
    step3.querySelector('button[type="submit"]').disabled = true;

    setTimeout(() => {
      step3.querySelector('button[type="submit"]').disabled = false;
      showLogin();
    }, 1200);
  });

  return {
    showReset,
    showLogin,
  };
}

