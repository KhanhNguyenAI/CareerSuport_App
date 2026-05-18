// ─────────────────────────────────────
// Firebase Configuration
// キーは env.js の window.__ENV__ から読み込みます
// ─────────────────────────────────────

const _e = window.__ENV__ || {};

const FIREBASE_CONFIG = {
  apiKey:            _e.FIREBASE_API_KEY,
  authDomain:        _e.FIREBASE_AUTH_DOMAIN,
  projectId:         _e.FIREBASE_PROJECT_ID,
  storageBucket:     _e.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: _e.FIREBASE_MESSAGING_SENDER_ID,
  appId:             _e.FIREBASE_APP_ID,
  measurementId:     _e.FIREBASE_MEASUREMENT_ID,
};

if (!_e.FIREBASE_API_KEY) {
  console.error('[firebase-config] env.js が読み込まれていないか、FIREBASE_API_KEY が未設定です。');
}

// Attach to window so it's accessible by modules like auth.js
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
