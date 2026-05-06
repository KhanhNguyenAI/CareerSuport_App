// ─────────────────────────────────────
// theme.js — Light / Dark mode toggle
// Shared across cert.html, interview.html, index.html
// ─────────────────────────────────────

(function () {
  const KEY = 'app_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.title = theme === 'light' ? 'ダークモードに切替' : 'ライトモードに切替';
    });
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Apply immediately (prevents flash of wrong theme)
  const saved = localStorage.getItem(KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  // Sync button labels after DOM ready
  document.addEventListener('DOMContentLoaded', () => applyTheme(saved));
})();
