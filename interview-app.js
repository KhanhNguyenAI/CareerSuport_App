import {
  loginWithGoogle,
  logout,
  onAuthChange,
  loadUserData,
  saveScheduleEntries,
} from './auth.js';

// Expose so schedule.js (non-module) can call it
window.saveScheduleEntries = saveScheduleEntries;

const loginScreen = document.getElementById('login-screen');
const appScreen   = document.getElementById('app');
const btnLogin    = document.getElementById('btn-login');
const btnLogout   = document.getElementById('btn-logout');

// ── Auth state ──
onAuthChange(async (user) => {
  if (user) {
    loginScreen.style.display = 'none';
    appScreen.style.display   = 'block';

    // Sync profile from Firestore to localStorage
    try {
      const data = await loadUserData();
      if (data?.profile) {
        localStorage.setItem('user_profile', JSON.stringify({
          ...data.profile,
          examDates: data.examDates || {},
        }));
      }

      // ── Sync interview schedule ──
      const fsSchedule    = data?.schedule || [];
      const localSchedule = JSON.parse(localStorage.getItem('interview_schedule') || '[]');
      if (fsSchedule.length > 0) {
        localStorage.setItem('interview_schedule', JSON.stringify(fsSchedule));
      } else if (localSchedule.length > 0) {
        saveScheduleEntries(localSchedule).catch(() => {});
      }
    } catch (e) {
      console.warn('Firestore sync failed (UI will still render):', e.message);
    }

    // Update header avatar
    const avatarImg   = document.getElementById('header-avatar-img');
    const avatarEmoji = document.getElementById('header-avatar-emoji');
    const headerName  = document.getElementById('header-name');
    const profile     = JSON.parse(localStorage.getItem('user_profile') || '{}');

    if (headerName) headerName.textContent = profile.name || user.displayName || 'プロフィール';
    if (user.photoURL && avatarImg) {
      avatarImg.src           = user.photoURL;
      avatarImg.style.display = 'inline-block';
      if (avatarEmoji) avatarEmoji.style.display = 'none';
    }

    // Init interview simulator
    if (window.renderQuestion) window.renderQuestion();

  } else {
    loginScreen.style.display = 'flex';
    appScreen.style.display   = 'none';
  }
});

// ── Login ──
btnLogin?.addEventListener('click', async () => {
  btnLogin.disabled    = true;
  btnLogin.textContent = 'ログイン中...';
  try {
    await loginWithGoogle();
  } catch (err) {
    btnLogin.disabled = false;
    btnLogin.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
      </svg>
      Googleでログイン`;
    if (err.code === 'auth/popup-closed-by-user') return;
    alert('ログインに失敗しました: ' + err.message);
  }
});

// ── Logout ──
btnLogout?.addEventListener('click', async () => {
  await logout();
  window.location.href = 'index.html';
});
