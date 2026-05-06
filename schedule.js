// ─────────────────────────────────────
// schedule.js — 選考管理（面接スケジュール）
// CRUD + localStorage
// ─────────────────────────────────────

const SC_KEY = 'interview_schedule';

const SC_ROUNDS = ['書類選考（ES）', '一次面接', '二次面接', '最終面接', 'その他'];
const SC_STATUS = {
  '予定':   { color: '#6c63ff', bg: 'rgba(108,99,255,0.12)', icon: '📅' },
  '通過':   { color: '#48cfad', bg: 'rgba(72,207,173,0.12)',  icon: '✅' },
  '不合格': { color: '#fc5c65', bg: 'rgba(252,92,101,0.12)',  icon: '❌' },
  '保留':   { color: '#f7b731', bg: 'rgba(247,183,49,0.12)',  icon: '⏳' },
  '内定':   { color: '#FFD700', bg: 'rgba(255,215,0,0.12)',   icon: '🎉' },
};

// ── Helpers ──
function scLoad() {
  return JSON.parse(localStorage.getItem(SC_KEY) || '[]');
}
function scSave(entries) {
  localStorage.setItem(SC_KEY, JSON.stringify(entries));
}
function scSortEntries(entries) {
  return entries.sort((a, b) => {
    const da = new Date(a.date + 'T' + (a.time || '00:00'));
    const db = new Date(b.date + 'T' + (b.time || '00:00'));
    return da - db;
  });
}
function scFormatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00');
  return d.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });
}

// ── Init ──
window.initSchedule = function () {
  renderSchedulePage();
};

function renderSchedulePage() {
  const wrap = document.getElementById('tab-schedule');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:18px">

      <!-- Header row -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;color:var(--accent2);text-transform:uppercase;margin-bottom:4px">
            📅 選考管理
          </div>
          <p style="font-size:0.82rem;color:var(--text-sub)">応募企業ごとの選考状況をまとめて管理できます</p>
        </div>
        <button onclick="scOpenForm()" class="sc-add-btn">＋ 選考を追加</button>
      </div>

      <!-- Status filter -->
      <div style="display:flex;gap:6px;flex-wrap:wrap" id="sc-filter-row">
        <button onclick="scSetFilter('all')" class="sc-filter-btn sc-filter-active" data-filter="all">すべて</button>
        ${Object.entries(SC_STATUS).map(([s, v]) =>
          `<button onclick="scSetFilter('${s}')" class="sc-filter-btn" data-filter="${s}" style="--sc:${v.color}">${v.icon} ${s}</button>`
        ).join('')}
      </div>

      <!-- Entry list -->
      <div id="sc-list"></div>

      <!-- Form modal -->
      <div id="sc-modal-overlay" class="sc-overlay" style="display:none" onclick="scCloseForm(event)">
        <div class="sc-modal" onclick="event.stopPropagation()">
          <div class="sc-modal-header">
            <span id="sc-modal-title" style="font-size:1rem;font-weight:800">選考を追加</span>
            <button onclick="scCloseForm()" style="background:transparent;border:none;color:var(--text-sub);font-size:1.1rem;cursor:pointer;padding:4px">✕</button>
          </div>
          <div class="sc-modal-body">
            <input type="hidden" id="sc-edit-id">

            <div class="sc-form-row">
              <label class="sc-label">企業名 <span style="color:#fc5c65">*</span></label>
              <input id="sc-f-company" class="sc-input" type="text" placeholder="例：富士通、サイバーエージェント..." maxlength="40">
            </div>

            <div class="sc-form-row">
              <label class="sc-label">選考ステップ</label>
              <select id="sc-f-round" class="sc-input">
                ${SC_ROUNDS.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div class="sc-form-row">
                <label class="sc-label">日付</label>
                <input id="sc-f-date" class="sc-input" type="date">
              </div>
              <div class="sc-form-row">
                <label class="sc-label">時間</label>
                <input id="sc-f-time" class="sc-input" type="time">
              </div>
            </div>

            <div class="sc-form-row">
              <label class="sc-label">場所・形式</label>
              <input id="sc-f-location" class="sc-input" type="text" placeholder="例：オンライン（Zoom）、東京本社..." maxlength="60">
            </div>

            <div class="sc-form-row">
              <label class="sc-label">ステータス</label>
              <div style="display:flex;gap:6px;flex-wrap:wrap" id="sc-status-btns">
                ${Object.entries(SC_STATUS).map(([s, v]) =>
                  `<button type="button" onclick="scPickStatus('${s}')" class="sc-status-pick" data-status="${s}"
                    style="--sc:${v.color};--scbg:${v.bg}">${v.icon} ${s}</button>`
                ).join('')}
              </div>
              <input type="hidden" id="sc-f-status" value="予定">
            </div>

            <div class="sc-form-row">
              <label class="sc-label">メモ</label>
              <textarea id="sc-f-memo" class="sc-input" rows="3" placeholder="面接官の名前、持参物、準備すること..." style="resize:vertical"></textarea>
            </div>
          </div>
          <div class="sc-modal-footer">
            <button onclick="scCloseForm()" class="sc-btn-cancel">キャンセル</button>
            <button onclick="scSaveEntry()" class="sc-btn-save">💾 保存する</button>
          </div>
        </div>
      </div>

    </div>
  `;

  scSetFilter('all');
  scPickStatus('予定');
}

// ── Filter ──
let scCurrentFilter = 'all';

window.scSetFilter = function (filter) {
  scCurrentFilter = filter;
  document.querySelectorAll('.sc-filter-btn').forEach(b => {
    b.classList.toggle('sc-filter-active', b.dataset.filter === filter);
  });
  scRenderList();
};

// ── List render ──
function scRenderList() {
  const listEl = document.getElementById('sc-list');
  if (!listEl) return;

  let entries = scSortEntries(scLoad());
  if (scCurrentFilter !== 'all') {
    entries = entries.filter(e => e.status === scCurrentFilter);
  }

  if (entries.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:48px 20px;color:var(--text-sub)">
        <div style="font-size:2.5rem;margin-bottom:12px">📋</div>
        <div style="font-size:0.88rem">
          ${scCurrentFilter === 'all' ? '選考情報がまだありません。「＋ 選考を追加」から登録しましょう。' : 'このステータスの選考はありません。'}
        </div>
      </div>`;
    return;
  }

  // Group by month
  const grouped = {};
  entries.forEach(e => {
    const key = e.date ? e.date.slice(0, 7) : 'no-date';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  listEl.innerHTML = Object.entries(grouped).map(([month, items]) => {
    const label = month === 'no-date' ? '日付未設定'
      : new Date(month + '-01').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

    return `
      <div style="margin-bottom:20px">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;color:var(--text-sub);text-transform:uppercase;margin-bottom:10px;padding-left:4px">
          ${label}
        </div>
        ${items.map(e => scCardHTML(e)).join('')}
      </div>`;
  }).join('');
}

function scCardHTML(e) {
  const st = SC_STATUS[e.status] || SC_STATUS['予定'];
  return `
    <div class="sc-entry-card">
      <div class="sc-entry-left" style="border-left-color:${st.color}">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-size:1rem;font-weight:800">${e.company}</span>
          <span class="sc-round-badge">${e.round || '—'}</span>
        </div>
        <div style="display:flex;gap:12px;margin-top:5px;flex-wrap:wrap">
          ${e.date ? `<span style="font-size:0.77rem;color:var(--text-sub)">📅 ${scFormatDate(e.date)}${e.time ? ' ' + e.time : ''}</span>` : ''}
          ${e.location ? `<span style="font-size:0.77rem;color:var(--text-sub)">📍 ${e.location}</span>` : ''}
        </div>
        ${e.memo ? `<div style="font-size:0.75rem;color:var(--text-sub);margin-top:5px;line-height:1.5;opacity:0.8">${e.memo}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
        <span class="sc-status-badge" style="background:${st.bg};color:${st.color};border-color:${st.color}">${st.icon} ${e.status}</span>
        <div style="display:flex;gap:6px">
          <button onclick="scOpenEdit('${e.id}')" class="sc-icon-btn" title="編集">✏️</button>
          <button onclick="scDeleteEntry('${e.id}')" class="sc-icon-btn sc-icon-del" title="削除">🗑️</button>
        </div>
      </div>
    </div>`;
}

// ── Form ──
window.scOpenForm = function () {
  document.getElementById('sc-modal-title').textContent = '選考を追加';
  document.getElementById('sc-edit-id').value   = '';
  document.getElementById('sc-f-company').value  = '';
  document.getElementById('sc-f-round').value    = SC_ROUNDS[0];
  document.getElementById('sc-f-date').value     = '';
  document.getElementById('sc-f-time').value     = '';
  document.getElementById('sc-f-location').value = '';
  document.getElementById('sc-f-memo').value     = '';
  document.getElementById('sc-f-status').value   = '予定';
  scPickStatus('予定');
  document.getElementById('sc-modal-overlay').style.display = 'flex';
  setTimeout(() => document.getElementById('sc-f-company')?.focus(), 100);
};

window.scOpenEdit = function (id) {
  const entries = scLoad();
  const e = entries.find(x => x.id === id);
  if (!e) return;
  document.getElementById('sc-modal-title').textContent = '選考を編集';
  document.getElementById('sc-edit-id').value   = e.id;
  document.getElementById('sc-f-company').value  = e.company;
  document.getElementById('sc-f-round').value    = e.round;
  document.getElementById('sc-f-date').value     = e.date || '';
  document.getElementById('sc-f-time').value     = e.time || '';
  document.getElementById('sc-f-location').value = e.location || '';
  document.getElementById('sc-f-memo').value     = e.memo || '';
  document.getElementById('sc-f-status').value   = e.status;
  scPickStatus(e.status);
  document.getElementById('sc-modal-overlay').style.display = 'flex';
};

window.scCloseForm = function (e) {
  if (e && e.target !== document.getElementById('sc-modal-overlay')) return;
  document.getElementById('sc-modal-overlay').style.display = 'none';
};

window.scPickStatus = function (status) {
  document.getElementById('sc-f-status').value = status;
  document.querySelectorAll('.sc-status-pick').forEach(b => {
    b.classList.toggle('sc-status-pick-active', b.dataset.status === status);
  });
};

window.scSaveEntry = function () {
  const company = document.getElementById('sc-f-company').value.trim();
  if (!company) { document.getElementById('sc-f-company').focus(); return; }

  const editId = document.getElementById('sc-edit-id').value;
  const entry  = {
    id:       editId || ('sc_' + Date.now()),
    company,
    round:    document.getElementById('sc-f-round').value,
    date:     document.getElementById('sc-f-date').value,
    time:     document.getElementById('sc-f-time').value,
    location: document.getElementById('sc-f-location').value.trim(),
    status:   document.getElementById('sc-f-status').value || '予定',
    memo:     document.getElementById('sc-f-memo').value.trim(),
  };

  let entries = scLoad();
  if (editId) {
    const idx = entries.findIndex(x => x.id === editId);
    if (idx !== -1) entries[idx] = entry; else entries.push(entry);
  } else {
    entries.push(entry);
  }
  scSave(entries);
  document.getElementById('sc-modal-overlay').style.display = 'none';
  scRenderList();
};

window.scDeleteEntry = function (id) {
  if (!confirm('この選考を削除しますか？')) return;
  const entries = scLoad().filter(e => e.id !== id);
  scSave(entries);
  scRenderList();
};
