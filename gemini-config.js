// ─────────────────────────────────────
// gemini-config.js
// Shared Gemini API config + Settings UI
// Included in cert.html and interview.html
// ─────────────────────────────────────

const _GC_DEFAULT_KEY   = 'AIzaSyDst9TClnMCxy70KW_rIA1H_mI0aSR0sFw';
const _GC_DEFAULT_MODEL = 'gemini-2.5-flash';

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash',    name: 'Gemini 2.5 Flash',   tag: '推奨',   desc: '最新・高速・高精度' },
  { id: 'gemini-2.5-pro',      name: 'Gemini 2.5 Pro',     tag: '高精度', desc: '最高精度・やや低速' },
  { id: 'gemini-2.0-flash',    name: 'Gemini 2.0 Flash',   tag: '',       desc: 'バランス型・安定' },
  { id: 'gemini-1.5-flash',    name: 'Gemini 1.5 Flash',   tag: '軽量',   desc: '軽量・高速' },
  { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B',tag: '最軽量', desc: '最速・シンプルな用途向け' },
  { id: 'gemini-1.5-pro',      name: 'Gemini 1.5 Pro',     tag: '',       desc: '高精度・低速' },
];

// ── Public helpers (used by all scripts) ──

window.getGeminiKey = function () {
  return localStorage.getItem('gemini_api_key') || _GC_DEFAULT_KEY;
};

window.getGeminiModel = function () {
  return localStorage.getItem('gemini_model') || _GC_DEFAULT_MODEL;
};

window.getGeminiURL = function () {
  return `https://generativelanguage.googleapis.com/v1beta/models/${window.getGeminiModel()}:generateContent?key=${window.getGeminiKey()}`;
};

window.isUsingCustomKey = function () {
  const k = localStorage.getItem('gemini_api_key');
  return !!(k && k.trim());
};

// ── Settings Modal ──

function gcOpenSettings() {
  const existing = document.getElementById('gc-modal-overlay');
  if (existing) { existing.style.display = 'flex'; gcRefreshModal(); return; }

  const overlay = document.createElement('div');
  overlay.id = 'gc-modal-overlay';
  overlay.className = 'gc-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) gcCloseSettings(); };

  overlay.innerHTML = `
    <div class="gc-modal">
      <div class="gc-modal-header">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.3rem">⚙️</span>
          <span style="font-size:1rem;font-weight:800">AI設定</span>
        </div>
        <button class="gc-close-btn" onclick="gcCloseSettings()">✕</button>
      </div>

      <div class="gc-modal-body">

        <!-- API Key section -->
        <div class="gc-section">
          <div class="gc-section-label">🔑 Gemini APIキー</div>
          <p class="gc-section-desc">
            自分のAPIキーを使うと、レート制限を気にせず利用できます。<br>
            未入力の場合はデフォルトキーを使用します。
          </p>
          <div class="gc-key-row">
            <div class="gc-key-input-wrap">
              <input id="gc-key-input" class="gc-input" type="password"
                placeholder="AIzaSy..."
                value="${localStorage.getItem('gemini_api_key') || ''}"
                autocomplete="off"
              >
              <button class="gc-eye-btn" id="gc-eye-btn" onclick="gcToggleKeyVisibility()" title="表示/非表示">👁</button>
            </div>
          </div>
          <div class="gc-key-links">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" class="gc-link">
              🔗 Google AI Studio でAPIキーを取得 →
            </a>
          </div>
          <div id="gc-key-status" class="gc-key-status"></div>
        </div>

        <!-- Model section -->
        <div class="gc-section">
          <div class="gc-section-label">🤖 使用モデル</div>
          <p class="gc-section-desc">モデルによって回答の精度・速度が異なります。</p>
          <div class="gc-model-list" id="gc-model-list">
            ${GEMINI_MODELS.map(m => `
              <label class="gc-model-item ${(localStorage.getItem('gemini_model')||_GC_DEFAULT_MODEL)===m.id ? 'gc-model-selected' : ''}">
                <input type="radio" name="gc-model" value="${m.id}"
                  ${(localStorage.getItem('gemini_model')||_GC_DEFAULT_MODEL)===m.id ? 'checked' : ''}
                  onchange="gcSelectModel('${m.id}', this.closest('.gc-model-item'))"
                >
                <div class="gc-model-info">
                  <div class="gc-model-name">
                    ${m.name}
                    ${m.tag ? `<span class="gc-model-tag">${m.tag}</span>` : ''}
                    ${m.id === _GC_DEFAULT_MODEL ? '<span class="gc-model-tag" style="background:rgba(72,207,173,0.15);color:#48cfad;border-color:rgba(72,207,173,0.3)">デフォルト</span>' : ''}
                  </div>
                  <div class="gc-model-desc">${m.desc}</div>
                </div>
                <div class="gc-model-radio-dot"></div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Current status -->
        <div class="gc-status-card" id="gc-status-card">
          ${gcBuildStatusHTML()}
        </div>

      </div>

      <div class="gc-modal-footer">
        <button class="gc-btn-secondary" onclick="gcResetAll()">🔄 デフォルトに戻す</button>
        <button class="gc-btn-primary" onclick="gcSave()">💾 保存する</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function gcCloseSettings() {
  const overlay = document.getElementById('gc-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function gcRefreshModal() {
  const card = document.getElementById('gc-status-card');
  if (card) card.innerHTML = gcBuildStatusHTML();
}

function gcBuildStatusHTML() {
  const usingCustom = window.isUsingCustomKey();
  const model       = window.getGeminiModel();
  const modelName   = GEMINI_MODELS.find(m => m.id === model)?.name || model;
  return `
    <div style="font-size:0.7rem;font-weight:700;letter-spacing:1px;color:var(--text-sub);text-transform:uppercase;margin-bottom:10px">現在の設定</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem">
        <span style="color:var(--text-sub)">APIキー</span>
        <span style="font-weight:700;color:${usingCustom ? 'var(--accent)' : 'var(--accent3)'}">
          ${usingCustom ? '✅ カスタムキー使用中' : '⚠️ デフォルトキー使用中'}
        </span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.82rem">
        <span style="color:var(--text-sub)">モデル</span>
        <span style="font-weight:700;color:var(--accent2)">${modelName}</span>
      </div>
    </div>
  `;
}

function gcToggleKeyVisibility() {
  const input = document.getElementById('gc-key-input');
  const btn   = document.getElementById('gc-eye-btn');
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  if (btn) btn.textContent = isHidden ? '🙈' : '👁';
}

function gcSelectModel(modelId, el) {
  document.querySelectorAll('.gc-model-item').forEach(item => item.classList.remove('gc-model-selected'));
  el?.classList.add('gc-model-selected');
}

function gcSave() {
  const keyInput = document.getElementById('gc-key-input');
  const modelRadio = document.querySelector('input[name="gc-model"]:checked');

  const key   = keyInput?.value.trim() || '';
  const model = modelRadio?.value || _GC_DEFAULT_MODEL;

  if (key) {
    localStorage.setItem('gemini_api_key', key);
  } else {
    localStorage.removeItem('gemini_api_key');
  }
  localStorage.setItem('gemini_model', model);

  // Refresh status
  gcRefreshModal();
  gcUpdateHeaderBadge();

  // Show saved feedback
  const footer = document.querySelector('.gc-modal-footer');
  if (footer) {
    const msg = document.createElement('span');
    msg.style.cssText = 'font-size:0.78rem;color:var(--accent);font-weight:700;margin-right:auto';
    msg.textContent = '✅ 保存しました';
    footer.prepend(msg);
    setTimeout(() => msg.remove(), 2000);
  }
}

function gcResetAll() {
  if (!confirm('APIキーとモデルをデフォルトに戻しますか？')) return;
  localStorage.removeItem('gemini_api_key');
  localStorage.setItem('gemini_model', _GC_DEFAULT_MODEL);

  const keyInput = document.getElementById('gc-key-input');
  if (keyInput) keyInput.value = '';

  document.querySelectorAll('input[name="gc-model"]').forEach(r => {
    r.checked = r.value === _GC_DEFAULT_MODEL;
    r.closest('.gc-model-item')?.classList.toggle('gc-model-selected', r.value === _GC_DEFAULT_MODEL);
  });

  gcRefreshModal();
  gcUpdateHeaderBadge();
}

// ── Header badge (shows "カスタム" when using own key) ──

function gcUpdateHeaderBadge() {
  const badge = document.getElementById('gc-header-badge');
  if (!badge) return;
  const custom = window.isUsingCustomKey();
  badge.textContent  = custom ? window.getGeminiModel().replace('gemini-','').replace('-flash','F').replace('-pro','P') : '⚙️';
  badge.style.color  = custom ? 'var(--accent)' : 'var(--text-sub)';
  badge.title        = custom ? `カスタムキー使用中 / ${window.getGeminiModel()}` : 'AI設定';
}

// Init badge on load
document.addEventListener('DOMContentLoaded', gcUpdateHeaderBadge);

// Expose
window.gcOpenSettings    = gcOpenSettings;
window.gcCloseSettings   = gcCloseSettings;
window.gcToggleKeyVisibility = gcToggleKeyVisibility;
window.gcSelectModel     = gcSelectModel;
window.gcSave            = gcSave;
window.gcResetAll        = gcResetAll;
window.gcUpdateHeaderBadge = gcUpdateHeaderBadge;
