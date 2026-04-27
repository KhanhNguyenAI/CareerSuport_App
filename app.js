// ─────────────────────────────────────
// app.js — Firebase Auth + Firestore bridge
// Connects Firebase auth state with script.js UI functions
// ─────────────────────────────────────

import {
  loginWithGoogle,
  logout,
  onAuthChange,
  currentUser,
  loadUserData,
  saveUserProfile,
  addVocabNote,
  removeVocabNote,
  clearVocabNotes,
  getGlobalVocab,
  saveGlobalVocab,
} from './auth.js';

// Expose global vocab helpers so script.js (non-module) can call them
window.getGlobalVocab  = getGlobalVocab;
window.saveGlobalVocab = saveGlobalVocab;

// ─────────────────────────────────────
// DOM refs
// ─────────────────────────────────────

const loginScreen = document.getElementById('login-screen');
const appScreen   = document.getElementById('app');
const btnLogin    = document.getElementById('btn-login');
const btnLogout   = document.getElementById('btn-logout');

// ─────────────────────────────────────
// Auth state listener
// ─────────────────────────────────────

onAuthChange(async (firebaseUser) => {
  if (firebaseUser) {
    // Show loading state
    loginScreen.style.display = 'none';
    appScreen.style.display   = 'block';

    // Load data from Firestore → sync to localStorage
    const userData = await loadUserData();
    if (userData) {
      if (userData.profile) {
        const profileData = {
          ...userData.profile,
          examDates: userData.examDates || {},
        };
        localStorage.setItem('user_profile', JSON.stringify(profileData));
      }
      if (userData.vocabNotes) {
        localStorage.setItem('vocab_notes', JSON.stringify(userData.vocabNotes));
      }
    }

    // Update header with Google avatar
    updateGoogleAvatar(firebaseUser);

    // Initialize UI
    if (window.renderCertCards)     window.renderCertCards();
    if (window.updateHeaderProfile) window.updateHeaderProfile();

  } else {
    // Not logged in
    localStorage.removeItem('user_profile');
    localStorage.removeItem('vocab_notes');
    loginScreen.style.display = 'flex';
    appScreen.style.display   = 'none';
  }
});

// ─────────────────────────────────────
// Google avatar in header
// ─────────────────────────────────────

function updateGoogleAvatar(user) {
  const avatarImg   = document.getElementById('header-avatar-img');
  const avatarEmoji = document.getElementById('header-avatar-emoji');
  const headerName  = document.getElementById('header-name');

  // Try to use local profile name first, fallback to Google display name
  const localProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  if (headerName) {
    headerName.textContent = localProfile.name || user.displayName || 'プロフィール';
  }

  if (user.photoURL && avatarImg) {
    avatarImg.src   = user.photoURL;
    avatarImg.style.display = 'inline-block';
    if (avatarEmoji) avatarEmoji.style.display = 'none';
  }

  // Also update modal avatar
  const modalAvatar = document.getElementById('modal-avatar');
  if (modalAvatar && user.photoURL) {
    modalAvatar.src   = user.photoURL;
    modalAvatar.style.display = 'inline-block';
  }
}

// ─────────────────────────────────────
// Login / Logout buttons
// ─────────────────────────────────────

btnLogin?.addEventListener('click', async () => {
  btnLogin.disabled    = true;
  btnLogin.textContent = 'ログイン中...';
  try {
    await loginWithGoogle();
  } catch (err) {
    console.error('Login error:', err);
    btnLogin.disabled = false;
    btnLogin.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
      </svg>
      Googleでログイン
    `;
    if (err.code === 'auth/popup-closed-by-user') return;
    if (err.code === 'auth/unauthorized-domain') {
      alert('このドメインはFirebaseで許可されていません。\nFirebase Console → Authentication → Authorized domainsにlocalhost等を追加してください。');
    } else {
      alert('ログインに失敗しました:\n' + err.message);
    }
  }
});

btnLogout?.addEventListener('click', async () => {
  await logout();
  window.location.href = 'index.html';
});

// ─────────────────────────────────────
// Override: Profile save → sync to Firestore
// ─────────────────────────────────────

// cert.html calls handleSaveProfile() — we define it here
window.handleSaveProfile = async () => {
  // Call the existing saveProfile() from script.js (saves to localStorage)
  if (window.saveProfile) window.saveProfile();

  // Sync to Firestore if logged in
  const user = currentUser();
  if (!user) return;

  const p = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const { examDates = {}, ...profileFields } = p;
  try {
    await saveUserProfile(profileFields, examDates);
  } catch (e) {
    console.error('Firestore profile sync error:', e);
  }
};

// ─────────────────────────────────────
// Override: Vocab save/delete/clear → sync to Firestore
// ─────────────────────────────────────
// ES modules run AFTER DOMContentLoaded has already fired,
// and AFTER regular scripts (script.js) have executed.
// So window.saveVocabNote etc. are already set — wrap them directly.

const origSaveVocabNote   = window.saveVocabNote;
const origDeleteVocabNote = window.deleteVocabNote;
const origClearAllVocab   = window.clearAllVocab;

// saveVocabNote: localStorage + Firestore
window.saveVocabNote = async (certId, term, explanation) => {
  if (origSaveVocabNote) origSaveVocabNote(certId, term, explanation);
  const user = currentUser();
  if (!user) return;
  try {
    await addVocabNote(certId, term, explanation);
  } catch (e) {
    console.error('Firestore addVocabNote error:', e);
  }
};

// deleteVocabNote: localStorage + Firestore
window.deleteVocabNote = async (term, certId) => {
  if (origDeleteVocabNote) origDeleteVocabNote(term, certId);
  const user = currentUser();
  if (!user) return;
  try {
    await removeVocabNote(certId, term);
  } catch (e) {
    console.error('Firestore removeVocabNote error:', e);
  }
};

// handleClearAllVocab: cert.html calls this directly
window.handleClearAllVocab = async () => {
  if (origClearAllVocab) origClearAllVocab();
  const user = currentUser();
  if (!user) return;
  try {
    await clearVocabNotes();
  } catch (e) {
    console.error('Firestore clearVocabNotes error:', e);
  }
};
