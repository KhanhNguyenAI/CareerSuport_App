// ─────────────────────────────────────
// gemini-config.js
// Multi-provider AI config + Settings UI
// Supports: Google Gemini / OpenAI / DeepSeek
// ─────────────────────────────────────

// Default key per page (set window.GC_PAGE before loading this script)
const _GC_PAGE_KEYS = {
  cert:      'AIzaSyDst9TClnMCxy70KW_rIA1H_mI0aSR0sFw',   // Part 1
  interview: 'AIzaSyAiUoO44MuzT6tbeH_D98HglhBUDmAGdMg',   // Part 2
};
const _GC_DEFAULT_KEY   = _GC_PAGE_KEYS[window.GC_PAGE] || _GC_PAGE_KEYS.cert;
const _GC_DEFAULT_MODEL = 'gemini-2.5-flash';

// ── Model definitions ──
const GEMINI_MODELS = [
  {
    id:       'gpt-4o-mini',
    apiId:    'gpt-4o-mini',
    provider: 'openai',
    name:     'GPT-5.4 mini',
    tag:      '高速',
    desc:     'OpenAI 高速モデル',
    keyLink:  'https://platform.openai.com/login',
    keyLabel: 'OpenAI API Key を取得',
  },
  {
    id:       'deepseek-chat',
    apiId:    'deepseek-chat',
    provider: 'deepseek',
    name:     'DeepSeek V4 Flash',
    tag:      '低コスト',
    desc:     '高性能・低コスト',
    keyLink:  'https://platform.deepseek.com/api_keys',
    keyLabel: 'DeepSeek API Key を取得',
  },
  {
    id:       'gemini-2.5-pro',
    apiId:    'gemini-2.5-pro',
    provider: 'google',
    name:     'Gemini 3.1 Pro',
    tag:      '高精度',
    desc:     '最高精度モデル',
    keyLink:  'https://aistudio.google.com/api-keys',
    keyLabel: 'Google AI Studio でキーを取得',
  },
  {
    id:       'gemini-2.5-flash',
    apiId:    'gemini-2.5-flash',
    provider: 'google',
    name:     'Gemini 2.5 Flash',
    tag:      '推奨',
    desc:     '高速・高精度（無料枠あり）',
    keyLink:  'https://aistudio.google.com/api-keys',
    keyLabel: 'Google AI Studio でキーを取得',
  },
];

// ── Config helpers ──

window.getGeminiKey = function () {
  return localStorage.getItem('gemini_api_key') || _GC_DEFAULT_KEY;
};

window.getGeminiModel = function () {
  return localStorage.getItem('gemini_model') || _GC_DEFAULT_MODEL;
};

function _gcGetModelDef() {
  return GEMINI_MODELS.find(m => m.id === window.getGeminiModel()) || GEMINI_MODELS[3];
}

window.getGeminiURL = function () {
  const m   = _gcGetModelDef();
  const key = window.getGeminiKey();
  if (m.provider === 'google') {
    return `https://generativelanguage.googleapis.com/v1beta/models/${m.apiId}:generateContent?key=${key}`;
  }
  if (m.provider === 'openai')    return 'https://api.openai.com/v1/chat/completions';
  if (m.provider === 'deepseek')  return 'https://api.deepseek.com/v1/chat/completions';
  return `https://generativelanguage.googleapis.com/v1beta/models/${m.apiId}:generateContent?key=${key}`;
};

window.buildAIBody = function (prompt, maxTokens, temperature = 0.7) {
  const m = _gcGetModelDef();
  if (m.provider === 'google') {
    return JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens }
    });
  }
  // OpenAI / DeepSeek (compatible format)
  return JSON.stringify({
    model:       m.apiId,
    messages:    [{ role: 'user', content: prompt }],
    max_tokens:  maxTokens,
    temperature,
  });
};

window.getAIHeaders = function () {
  const m = _gcGetModelDef();
  if (m.provider === 'google') {
    return { 'Content-Type': 'application/json' };
  }
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${window.getGeminiKey()}`,
  };
};

window.parseAIResponse = function (json) {
  const m = _gcGetModelDef();
  if (m.provider === 'google') {
    return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
  // OpenAI / DeepSeek
  return json.choices?.[0]?.message?.content || '';
};

window.isUsingCustomKey = function () {
  const k = localStorage.getItem('gemini_api_key');
  return !!(k && k.trim());
};

// ── Unified AI call (used by all scripts) ──
window.callAI = async function (prompt, maxTokens = 2048, retries = 3, delayMs = 2000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(window.getGeminiURL(), {
        method:  'POST',
        headers: window.getAIHeaders(),
        body:    window.buildAIBody(prompt, maxTokens),
      });
      if ([429, 500, 502, 503].includes(res.status)) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); continue; }
        throw new Error(res.status === 429 ? 'RATE_LIMIT' : 'SERVER_ERROR');
      }
      if (!res.ok) {
        let errMsg = `API error: ${res.status}`;
        try { const j = await res.json(); errMsg = j.error?.message || errMsg; } catch {}
        throw new Error(errMsg);
      }
      return window.parseAIResponse(await res.json());
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
};

// ── Settings Modal ──

function gcOpenSettings() {
  const existing = document.getElementById('gc-modal-overlay');
  if (existing) { existing.style.display = 'flex'; _gcRefreshStatus(); return; }

  const overlay = document.createElement('div');
  overlay.id = 'gc-modal-overlay';
  overlay.className = 'gc-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) gcCloseSettings(); };

  const curModel = window.getGeminiModel();
  const curKey   = localStorage.getItem('gemini_api_key') || '';

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

        <!-- Model selector -->
        <div class="gc-section">
          <div class="gc-section-label">🤖 AIモデルを選ぶ</div>
          <div class="gc-model-list" id="gc-model-list">
            ${GEMINI_MODELS.map(m => `
              <label class="gc-model-item ${curModel === m.id ? 'gc-model-selected' : ''}"
                onclick="gcSelectModel('${m.id}', this)">
                <input type="radio" name="gc-model" value="${m.id}" ${curModel === m.id ? 'checked' : ''}>
                <div class="gc-model-info">
                  <div class="gc-model-name">
                    ${m.name}
                    <span class="gc-model-tag" style="background:${_gcProviderColor(m.provider,0.12)};color:${_gcProviderColor(m.provider,1)};border-color:${_gcProviderColor(m.provider,0.3)}">${_gcProviderLabel(m.provider)}</span>
                    ${m.tag ? `<span class="gc-model-tag">${m.tag}</span>` : ''}
                  </div>
                  <div class="gc-model-desc">${m.desc}</div>
                </div>
                <div class="gc-model-radio-dot"></div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- API Key -->
        <div class="gc-section">
          <div class="gc-section-label">🔑 APIキー</div>
          <p class="gc-section-desc" id="gc-key-desc">${_gcKeyDesc(curModel)}</p>
          <div class="gc-key-input-wrap">
            <input id="gc-key-input" class="gc-input" type="password"
              placeholder="APIキーを入力..."
              value="${curKey}"
              autocomplete="off"
            >
            <button class="gc-eye-btn" id="gc-eye-btn" onclick="gcToggleKeyVisibility()">👁</button>
          </div>
          <div id="gc-key-link-row" class="gc-key-links">
            ${_gcKeyLinkHTML(curModel)}
          </div>
          <div style="font-size:0.75rem;color:var(--accent3);margin-top:4px;padding:8px 10px;background:rgba(247,183,49,0.08);border-radius:8px" id="gc-free-key-note">
            ${_gcFreeKeyNote(curModel)}
          </div>
        </div>

        <!-- Status -->
        <div class="gc-status-card" id="gc-status-card">${_gcStatusHTML()}</div>

      </div>

      <div class="gc-modal-footer">
        <button class="gc-btn-secondary" onclick="gcResetAll()">🔄 デフォルトに戻す</button>
        <button class="gc-btn-primary" onclick="gcSave()">💾 保存する</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function _gcProviderLabel(p) {
  return { google:'Google', openai:'OpenAI', deepseek:'DeepSeek' }[p] || p;
}
function _gcProviderColor(p, a) {
  const colors = { google:'108,99,255', openai:'72,207,173', deepseek:'247,183,49' };
  return `rgba(${colors[p]||'108,99,255'},${a})`;
}

function _gcKeyDesc(modelId) {
  const m = GEMINI_MODELS.find(x => x.id === modelId);
  if (!m) return '';
  if (m.provider === 'google') return '未入力の場合は無料キーを自動で使用します。';
  return `${_gcProviderLabel(m.provider)} のAPIキーを入力してください。未入力では動作しません。`;
}

function _gcKeyLinkHTML(modelId) {
  const m = GEMINI_MODELS.find(x => x.id === modelId);
  if (!m) return '';
  return `<a href="${m.keyLink}" target="_blank" rel="noopener" class="gc-link">🔗 ${m.keyLabel} →</a>`;
}

function _gcFreeKeyNote(modelId) {
  const m = GEMINI_MODELS.find(x => x.id === modelId);
  if (m?.provider === 'google') {
    return '💡 Gemini モデルは無料APIキーが利用可能です。制限なく使うには自分のキーを推奨。';
  }
  return `⚠️ ${_gcProviderLabel(m?.provider || '')} モデルは有料のAPIキーが必要です。`;
}

function _gcStatusHTML() {
  const usingCustom = window.isUsingCustomKey();
  const m = _gcGetModelDef();
  return `
    <div style="font-size:0.7rem;font-weight:700;letter-spacing:1px;color:var(--text-sub);text-transform:uppercase;margin-bottom:10px">現在の設定</div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;justify-content:space-between;font-size:0.82rem">
        <span style="color:var(--text-sub)">モデル</span>
        <span style="font-weight:700;color:var(--accent2)">${m.name}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.82rem">
        <span style="color:var(--text-sub)">プロバイダー</span>
        <span style="font-weight:700;color:${_gcProviderColor(m.provider,1)}">${_gcProviderLabel(m.provider)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.82rem">
        <span style="color:var(--text-sub)">APIキー</span>
        <span style="font-weight:700;color:${usingCustom ? 'var(--accent)' : 'var(--accent3)'}">
          ${usingCustom ? '✅ カスタムキー使用中' : '⚠️ 無料キー使用中'}
        </span>
      </div>
    </div>
  `;
}

function gcCloseSettings() {
  const overlay = document.getElementById('gc-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function _gcRefreshStatus() {
  const card = document.getElementById('gc-status-card');
  if (card) card.innerHTML = _gcStatusHTML();
}

function gcToggleKeyVisibility() {
  const input = document.getElementById('gc-key-input');
  const btn   = document.getElementById('gc-eye-btn');
  if (!input) return;
  const hidden = input.type === 'password';
  input.type = hidden ? 'text' : 'password';
  if (btn) btn.textContent = hidden ? '🙈' : '👁';
}

function gcSelectModel(modelId, el) {
  // Update selected state
  document.querySelectorAll('.gc-model-item').forEach(item => item.classList.remove('gc-model-selected'));
  el?.classList.add('gc-model-selected');
  // Update key description
  const desc = document.getElementById('gc-key-desc');
  const linkRow = document.getElementById('gc-key-link-row');
  const note    = document.getElementById('gc-free-key-note');
  if (desc)    desc.textContent = _gcKeyDesc(modelId);
  if (linkRow) linkRow.innerHTML = _gcKeyLinkHTML(modelId);
  if (note)    note.textContent  = _gcFreeKeyNote(modelId);
}

function gcSave() {
  const keyInput   = document.getElementById('gc-key-input');
  const modelRadio = document.querySelector('input[name="gc-model"]:checked');
  const key   = keyInput?.value.trim() || '';
  const model = modelRadio?.value || _GC_DEFAULT_MODEL;

  if (key) { localStorage.setItem('gemini_api_key', key); }
  else      { localStorage.removeItem('gemini_api_key'); }
  localStorage.setItem('gemini_model', model);

  _gcRefreshStatus();
  gcUpdateHeaderBadge();

  const footer = document.querySelector('.gc-modal-footer');
  if (footer) {
    const existing = footer.querySelector('.gc-saved-msg');
    if (existing) existing.remove();
    const msg = document.createElement('span');
    msg.className = 'gc-saved-msg';
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
  gcSelectModel(_GC_DEFAULT_MODEL, document.querySelector('.gc-model-selected'));
  _gcRefreshStatus();
  gcUpdateHeaderBadge();
}

function gcUpdateHeaderBadge() {
  const badge = document.getElementById('gc-header-badge');
  if (!badge) return;
  const m      = _gcGetModelDef();
  const custom = window.isUsingCustomKey();
  badge.textContent = custom ? m.name.split(' ')[0] : '⚙️';
  badge.style.color = custom ? 'var(--accent)' : 'var(--text-sub)';
  badge.title       = `${m.name} / ${custom ? 'カスタムキー' : '無料キー'}`;
}

document.addEventListener('DOMContentLoaded', gcUpdateHeaderBadge);

// Expose
window.gcOpenSettings        = gcOpenSettings;
window.gcCloseSettings       = gcCloseSettings;
window.gcToggleKeyVisibility = gcToggleKeyVisibility;
window.gcSelectModel         = gcSelectModel;
window.gcSave                = gcSave;
window.gcResetAll            = gcResetAll;
window.gcUpdateHeaderBadge   = gcUpdateHeaderBadge;
