// ─────────────────────────────────────
// env.example.js — セットアップテンプレート
// このファイルを env.js にコピーして
// 実際のキーを入力してください:
//   cp env.example.js env.js
// ─────────────────────────────────────

window.__ENV__ = {
  // Firebase（Firebase Console → プロジェクト設定 → マイアプリ）
  FIREBASE_API_KEY:             'YOUR_FIREBASE_API_KEY',
  FIREBASE_AUTH_DOMAIN:         'YOUR_PROJECT_ID.firebaseapp.com',
  FIREBASE_PROJECT_ID:          'YOUR_PROJECT_ID',
  FIREBASE_STORAGE_BUCKET:      'YOUR_PROJECT_ID.firebasestorage.app',
  FIREBASE_MESSAGING_SENDER_ID: 'YOUR_MESSAGING_SENDER_ID',
  FIREBASE_APP_ID:              'YOUR_APP_ID',
  FIREBASE_MEASUREMENT_ID:      'YOUR_MEASUREMENT_ID',

  // Gemini AI（https://aistudio.google.com/api-keys）
  GEMINI_KEY_CERT:      'YOUR_GEMINI_KEY_FOR_CERT_PAGE',
  GEMINI_KEY_INTERVIEW: 'YOUR_GEMINI_KEY_FOR_INTERVIEW_PAGE',
};
