// ─────────────────────────────────────
// note-panel.js — Floating Note Panel
// Shows vocab notes (AI) + free-form manual notes
// ─────────────────────────────────────

let npOpen        = false;
let npTab         = 'all';   // 'all' | 'vocab' | 'manual'
let npQuery       = '';
let npAddOpen     = false;
let npExpandedId  = null;    // currently expanded note id/term

// ── Open / Close ──

function npToggle() {
  npOpen ? npClose() : npOpenPanel();
}

function npOpenPanel() {
  npOpen = true;
  document.getElementById('note-panel')?.classList.add('np-open');
  document.getElementById('np-overlay')?.classList.add('np-overlay-visible');
  npRender();
}

function npClose() {
  npOpen = false;
  document.getElementById('note-panel')?.classList.remove('np-open');
  document.getElementById('np-overlay')?.classList.remove('np-overlay-visible');
}

// ── Tab / Search ──

function npSetTab(t) {
  npTab = t;
  document.querySelectorAll('.np-tab-btn').forEach(b => {
    b.classList.toggle('np-tab-active', b.dataset.tab === t);
  });
  npRenderList();
}

function npSearch(q) {
  npQuery = q;
  npRenderList();
}

// ── Expand ──

function npExpand(id) {
  npExpandedId = npExpandedId === id ? null : id;
  npRenderList();
}

// ── Add note form ──

function npToggleAdd() {
  npAddOpen = !npAddOpen;
  const form = document.getElementById('np-add-form');
  const btn  = document.getElementById('np-btn-add');
  if (!form || !btn) return;
  form.style.display = npAddOpen ? 'flex' : 'none';
  btn.innerHTML = npAddOpen ? '✕ キャンセル' : '＋ メモを追加';
  if (npAddOpen) document.getElementById('np-title-input')?.focus();
}

async function npSubmitAdd() {
  const title   = document.getElementById('np-title-input')?.value?.trim();
  const content = document.getElementById('np-content-input')?.value?.trim();
  const color   = document.getElementById('np-color-input')?.value || '#6c63ff';
  if (!title) { document.getElementById('np-title-input')?.focus(); return; }

  const btn = document.getElementById('np-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = '保存中...'; }

  try {
    if (window.saveManualNote) {
      await window.saveManualNote(title, content || '', color);
    } else {
      // fallback: localStorage only
      const pr = JSON.parse(localStorage.getItem('user_profile') || '{}');
      pr.manualNotes = [...(pr.manualNotes || []), {
        id: Date.now().toString(), title, content: content || '',
        color, savedAt: new Date().toISOString()
      }];
      localStorage.setItem('user_profile', JSON.stringify(pr));
    }
    // reset form
    document.getElementById('np-title-input').value   = '';
    document.getElementById('np-content-input').value = '';
    npAddOpen = false;
    document.getElementById('np-add-form').style.display = 'none';
    document.getElementById('np-btn-add').innerHTML = '＋ メモを追加';
    npTab = 'manual';
    document.querySelectorAll('.np-tab-btn').forEach(b => {
      b.classList.toggle('np-tab-active', b.dataset.tab === 'manual');
    });
    npRenderList();
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '保存'; }
  }
}

async function npDeleteVocab(term, certId) {
  if (!confirm(`「${term}」を削除しますか？`)) return;
  if (window.deleteVocabNote) await window.deleteVocabNote(term, certId);
  npRenderList();
}

async function npDeleteManual(id) {
  if (!confirm('このメモを削除しますか？')) return;
  if (window.deleteManualNote) await window.deleteManualNote(id);
  npRenderList();
}

// ── Render full panel ──

function npRender() {
  const panel = document.getElementById('note-panel');
  if (!panel) return;

  const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const vocabTotal  = (profile.vocabNotes  || []).length;
  const manualTotal = (profile.manualNotes || []).length;

  panel.innerHTML = `
    <!-- Header -->
    <div class="np-header">
      <div class="np-header-title">
        <span style="font-size:1.2rem">📝</span>
        <span>マイノート</span>
      </div>
      <button class="np-close-btn" onclick="npClose()">✕</button>
    </div>

    <!-- Tabs -->
    <div class="np-tabs">
      <button class="np-tab-btn ${npTab==='all'?'np-tab-active':''}" data-tab="all" onclick="npSetTab('all')">
        すべて <span class="np-count">${vocabTotal + manualTotal}</span>
      </button>
      <button class="np-tab-btn ${npTab==='vocab'?'np-tab-active':''}" data-tab="vocab" onclick="npSetTab('vocab')">
        🤖 AI用語 <span class="np-count">${vocabTotal}</span>
      </button>
      <button class="np-tab-btn ${npTab==='manual'?'np-tab-active':''}" data-tab="manual" onclick="npSetTab('manual')">
        ✏️ フリーメモ <span class="np-count">${manualTotal}</span>
      </button>
    </div>

    <!-- Search -->
    <div class="np-search-row">
      <div class="np-search-wrap">
        <span class="np-search-icon">🔍</span>
        <input id="np-search" class="np-search-input"
          type="text" placeholder="メモを検索..."
          value="${npQuery}"
          oninput="npSearch(this.value)"
        >
        ${npQuery ? `<button class="np-search-clear" onclick="document.getElementById('np-search').value='';npSearch('')">✕</button>` : ''}
      </div>
      <button id="np-btn-add" class="np-btn-add" onclick="npToggleAdd()">＋ メモを追加</button>
    </div>

    <!-- Add form -->
    <div id="np-add-form" class="np-add-form" style="display:none">
      <input id="np-title-input" class="np-input" type="text"
        placeholder="タイトル（必須）"
        onkeydown="if(event.key==='Enter')document.getElementById('np-content-input').focus()"
      >
      <textarea id="np-content-input" class="np-textarea"
        placeholder="内容（任意）..."
        rows="3"
      ></textarea>
      <div class="np-add-footer">
        <div class="np-color-row">
          <span style="font-size:0.72rem;color:var(--text-sub)">カラー:</span>
          ${['#6c63ff','#48cfad','#f7b731','#fc5c65','#4a90d9','#e879f9'].map(c => `
            <button onclick="document.getElementById('np-color-input').value='${c}';document.querySelectorAll('.np-color-dot').forEach(d=>d.classList.remove('selected'));this.classList.add('selected')"
              class="np-color-dot ${c==='#6c63ff'?'selected':''}"
              style="background:${c}"
            ></button>
          `).join('')}
          <input id="np-color-input" type="hidden" value="#6c63ff">
        </div>
        <button id="np-submit-btn" class="np-submit-btn" onclick="npSubmitAdd()">保存</button>
      </div>
    </div>

    <!-- Notes list -->
    <div id="np-list" class="np-list"></div>
  `;

  npRenderList();
}

// ── Render notes list only ──

function npRenderList() {
  const listEl = document.getElementById('np-list');
  if (!listEl) return;

  const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const vocabNotes  = profile.vocabNotes  || [];
  const manualNotes = profile.manualNotes || [];
  const q = npQuery.toLowerCase();

  // Filter
  const fVocab = vocabNotes.filter(n =>
    !q || n.term.toLowerCase().includes(q) ||
    (n.explanation || '').toLowerCase().includes(q) ||
    (n.certId || '').toLowerCase().includes(q)
  ).slice().reverse();

  const fManual = manualNotes.filter(n =>
    !q || (n.title||'').toLowerCase().includes(q) ||
    (n.content||'').toLowerCase().includes(q)
  ).slice().reverse();

  let html = '';

  // Vocab notes
  if (npTab === 'all' || npTab === 'vocab') {
    fVocab.forEach(n => {
      const key      = `vocab:${n.certId}:${n.term}`;
      const expanded = npExpandedId === key;
      const certLabel = { ai_passport:'生成AI', it_passport:'ITパス', fe:'基本情報', ap:'応用情報' }[n.certId] || n.certId;
      html += `
        <div class="np-card np-card-vocab ${expanded ? 'np-expanded' : ''}">
          <div class="np-card-header" onclick="npExpand('${key}')">
            <div class="np-card-left">
              <span class="np-badge-vocab">${certLabel}</span>
              <span class="np-card-title">${n.term}</span>
            </div>
            <div class="np-card-actions">
              <span class="np-chevron">${expanded ? '▲' : '▼'}</span>
              <button class="np-del-btn" onclick="event.stopPropagation();npDeleteVocab('${n.term}','${n.certId}')" title="削除">🗑</button>
            </div>
          </div>
          ${expanded ? `
            <div class="np-card-body">
              <div class="np-card-content">${(n.explanation||'').replace(/\n/g,'<br>')}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;flex-wrap:wrap;gap:6px">
                <div class="np-card-date">${n.savedAt ? new Date(n.savedAt).toLocaleDateString('ja-JP') : ''}</div>
                <button data-term="${n.term.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" data-cert="${n.certId}"
                  onclick="event.stopPropagation();npAddToFlashcard(this.dataset.term,this.dataset.cert)"
                  style="background:linear-gradient(135deg,#e879f9,#6c63ff);border:none;border-radius:8px;color:#fff;font-size:0.72rem;font-weight:700;padding:5px 11px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:4px;flex-shrink:0">
                  🃏 フラッシュカードに追加
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    });
  }

  // Manual notes
  if (npTab === 'all' || npTab === 'manual') {
    fManual.forEach(n => {
      const key      = `manual:${n.id}`;
      const expanded = npExpandedId === key;
      html += `
        <div class="np-card np-card-manual ${expanded ? 'np-expanded' : ''}" style="--note-color:${n.color||'#6c63ff'}">
          <div class="np-card-header" onclick="npExpand('${key}')">
            <div class="np-card-left">
              <span class="np-card-dot" style="background:${n.color||'#6c63ff'}"></span>
              <span class="np-card-title">${n.title}</span>
            </div>
            <div class="np-card-actions">
              <span class="np-chevron">${expanded ? '▲' : '▼'}</span>
              <button class="np-del-btn" onclick="event.stopPropagation();npDeleteManual('${n.id}')" title="削除">🗑</button>
            </div>
          </div>
          ${expanded ? `
            <div class="np-card-body">
              ${n.content ? `<div class="np-card-content">${n.content.replace(/\n/g,'<br>')}</div>` : '<div class="np-card-content" style="color:var(--text-sub);font-style:italic">内容なし</div>'}
              <div class="np-card-date">${n.savedAt ? new Date(n.savedAt).toLocaleDateString('ja-JP') : ''}</div>
            </div>
          ` : ''}
        </div>
      `;
    });
  }

  if (!html) {
    html = `
      <div class="np-empty">
        <div style="font-size:2.5rem;margin-bottom:10px">${npQuery ? '🔍' : '📝'}</div>
        <div>${npQuery ? '「' + npQuery + '」に一致するメモはありません' : npTab==='vocab'?'AI用語メモがありません':npTab==='manual'?'フリーメモがありません':'メモがありません'}</div>
        ${!npQuery && npTab!=='vocab' ? '<div style="font-size:0.75rem;margin-top:6px;opacity:0.7">「＋ メモを追加」からメモを作成できます</div>' : ''}
      </div>`;
  }

  listEl.innerHTML = html;

  // Update tab counts
  const profile2    = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const vTotal      = (profile2.vocabNotes  || []).length;
  const mTotal      = (profile2.manualNotes || []).length;
  document.querySelectorAll('.np-count').forEach((el, i) => {
    el.textContent = [vTotal+mTotal, vTotal, mTotal][i] ?? '';
  });
}

// ── Flashcard integration ──

function npAddToFlashcard(term, certId) {
  const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const note = (profile.vocabNotes || []).find(n => n.term === term && n.certId === certId);
  if (!note || !note.explanation) {
    alert('用語の説明が見つかりませんでした。');
    return;
  }

  // Extract [一言で言うと] section
  const match = note.explanation.match(/\[一言で言うと\]([\s\S]*?)(?=\[|$)/);
  let oneLiner = match ? match[1].trim() : '';

  // Fallback: strip all section headers and take first 200 chars
  if (!oneLiner) {
    oneLiner = note.explanation.replace(/\[.*?\]/g, '').trim().slice(0, 200);
  }

  if (!oneLiner) {
    alert('説明が見つかりませんでした。先に用語を検索してノートを保存してください。');
    return;
  }

  if (window.fcAddCustomCard) {
    window.fcAddCustomCard(term, oneLiner);
  } else {
    // Fallback: write directly to localStorage if flashcard.js not loaded
    const cards = JSON.parse(localStorage.getItem('fc_custom_cards') || '[]');
    const idx = cards.findIndex(c => c.term === term);
    if (idx !== -1) {
      cards[idx].def = oneLiner;
    } else {
      cards.push({ term, def: oneLiner, addedAt: new Date().toISOString() });
    }
    localStorage.setItem('fc_custom_cards', JSON.stringify(cards));
  }

  npShowToast(`「${term}」をフラッシュカードに追加しました 🃏`);
}

function npShowToast(msg) {
  let toast = document.getElementById('np-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'np-toast';
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'background:#1a1a2e', 'border:1px solid #e879f9', 'border-radius:10px',
      'color:#fff', 'font-size:0.82rem', 'font-weight:600',
      'padding:10px 18px', 'z-index:99999',
      'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
      'transition:opacity 0.4s', 'white-space:nowrap', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ── Expose to window ──

window.npToggle       = npToggle;
window.npClose        = npClose;
window.npSetTab       = npSetTab;
window.npSearch       = npSearch;
window.npExpand       = npExpand;
window.npToggleAdd    = npToggleAdd;
window.npSubmitAdd    = npSubmitAdd;
window.npDeleteVocab  = npDeleteVocab;
window.npDeleteManual = npDeleteManual;
window.npRenderList      = npRenderList;   // called after vocab note saved
window.npAddToFlashcard  = npAddToFlashcard;
