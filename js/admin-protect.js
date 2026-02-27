(function adminProtect() {
  // SECURITY RULE:
  // If user tries to open admin.html directly and admin_logged_in !== "true"
  // → redirect to index.html
  try {
    var isLoggedIn = window.sessionStorage.getItem('admin_logged_in') === 'true';
    if (!isLoggedIn) {
      window.location.replace('index.html');
    }
  } catch {
    window.location.replace('index.html');
  }
})();

