// ─────────────────────────────────────
// Config
// ─────────────────────────────────────

const GEMINI_API_KEY = 'AIzaSyDst9TClnMCxy70KW_rIA1H_mI0aSR0sFw';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const CACHE_VERSION = 'v6';
const GEMINI_CACHE_KEY = 'gemini_cache';

// ─────────────────────────────────────
// Data
// ─────────────────────────────────────

const CERTS = [
  {
    id: 'ai-passport',
    icon: '🤖',
    name: '生成AIパスポート',
    nameEn: 'Generative AI Passport',
    color: '#48cfad',
    level: 1,
    badge: '民間資格',
    desc: 'AIリテラシーの基礎を証明する民間資格。生成AI活用の入門として最適。',
    exam: { fee: '11,000円', format: 'CBT（随時）', duration: '90分', questions: '60問', passing: '70%以上' },
    links: { practice: [], books: [], tips: [
      { icon: '⚡', title: '学習期間の目安', text: '初学者で2〜4週間。IT系知識がある場合は1週間でも合格可能。' },
      { icon: '📌', title: '頻出テーマ', text: 'ハルシネーション・プロンプトエンジニアリング・著作権・個人情報・AIリスク。' },
      { icon: '🎯', title: '合格ライン', text: '正答率70%以上。CBT形式で随時受験可能。難易度は比較的やさしめ。' },
      { icon: '💡', title: '用語の暗記コツ', text: 'カタカナ用語が多いので、英語の略語→意味のセットで覚えること。' },
    ]}
  },
  {
    id: 'it-passport',
    icon: '💻',
    name: 'ITパスポート',
    nameEn: 'IT Passport',
    color: '#6c63ff',
    level: 2,
    badge: '国家資格',
    desc: 'ITの基礎知識を広く証明する国家資格。就活・昇進・転職に有利。',
    exam: { fee: '7,500円', format: 'CBT（随時）', duration: '120分', questions: '100問', passing: '各分野600点以上' },
    links: {
      practice: [
        { emoji: '📋', name: '過去問一覧', url: 'https://www.itpassportsiken.com/ipkakomon.php', desc: '年度別の過去問を一覧で確認できる定番サイト', tags: ['free', 'hot'] },
        { emoji: '📱', name: 'IT Pass アプリ', url: 'https://app.it-pass.jp/', desc: 'スマホで手軽に過去問演習。移動中の学習に最適', tags: ['free'] },
        { emoji: '📚', name: 'Dekidas Web', url: 'https://dekidas.com/', desc: '書籍と連動した演習アプリ（書籍購入が必要）', tags: ['paid'] },
        { emoji: '🎥', name: 'YouTube 解説動画', url: 'https://youtu.be/MhT0vP29PGk?si=PpIAj0FO1kE3sjiD', desc: 'わかりやすい解説動画でITパスポートを学ぶ', tags: ['free'] },
      ],
      books: [
        { img: 'https://m.media-amazon.com/images/I/51NoQLJVbfL.jpg', title: 'いちばんやさしい ITパスポート 絶対合格の教科書＋出る順問題集（令和8年度）', amazon: 'https://www.amazon.co.jp/dp/4815638209/' },
        { img: 'https://m.media-amazon.com/images/I/71kGDG80jmL._AC_UL480_FMwebp_QL65_.jpg', title: '令和08年 ITパスポート 合格教本', amazon: 'https://www.amazon.co.jp/dp/4297152355/' },
      ],
      tips: [
        { icon: '⏱️', title: '目標学習時間', text: '初心者：約180時間。IT経験者：約80〜100時間。1日2時間で2〜3か月が目安。' },
        { icon: '📊', title: '配点バランス', text: 'テクノロジ系(45%)・マネジメント系(20%)・ストラテジ系(35%)。テクノロジを優先。' },
        { icon: '🔢', title: '計算問題の攻略', text: '2進数変換・待ち行列・損益分岐点。公式を丸暗記+過去問5問で解法を体得。' },
        { icon: '🏅', title: '合格ライン', text: '総合・各分野ごとに60%以上が必要。1分野でも600点未満は不合格になる。' },
      ]
    }
  },
  {
    id: 'fe',
    icon: '⚙️',
    name: '基本情報技術者',
    nameEn: 'Fundamental IT Engineer',
    color: '#f7b731',
    level: 3,
    badge: '国家資格 / レベル2',
    desc: 'エンジニアとしての基礎スキルを証明する国家試験。プログラマ・SE志望者の登竜門。',
    exam: { fee: '7,500円', format: 'CBT（随時）', duration: '科目A: 90分 / 科目B: 100分', questions: '科目A: 60問 / 科目B: 20問', passing: '各科目600点以上' },
    links: {
      practice: [
        { emoji: '📋', name: '過去問一覧 (FE試験ドットコム)', url: 'https://www.fe-siken.com/fekakomon.php', desc: '年度別・分野別の過去問を網羅した定番サイト', tags: ['free', 'hot'] },
        { emoji: '📚', name: 'Dekidas Web', url: 'https://dekidas.com/', desc: '書籍と連動した演習アプリ（書籍購入が必要）', tags: ['paid'] },
        { emoji: '🎥', name: 'YouTube 解説チャンネル', url: 'https://www.youtube.com/channel/UCIBlbPP3I-C9tYLMHLUYQXQ', desc: '基本情報技術者試験をわかりやすく解説する動画', tags: ['free'] },
      ],
      books: [
        { img: 'https://m.media-amazon.com/images/I/611el-QLyJL._AC_UL480_FMwebp_QL65_.jpg', title: 'いちばんやさしい 基本情報技術者 絶対合格の教科書＋出る順問題集（令和8年度）', amazon: 'https://www.amazon.co.jp/dp/4815638217/' },
        { img: 'https://m.media-amazon.com/images/I/81xK9sqq3zL._AC_UL480_FMwebp_QL65_.jpg', title: '令和08年 基本情報技術者 合格教本 イエローテールコンピュータ', amazon: 'https://www.amazon.co.jp/dp/4297152630/' },
      ],
      tips: [
        { icon: '🔄', title: '試験形式の変化', text: '2023年よりCBT通年試験に変更。科目A(多肢選択)、科目B(疑似言語・セキュリティ)。' },
        { icon: '💻', title: '科目Bの攻略法', text: '疑似言語はPython感覚で読める。トレース（変数の値を手で追う）を練習すること。' },
        { icon: '⏱️', title: '学習時間目安', text: 'ITパスポート取得済：約200時間。未取得の場合：約400時間。' },
        { icon: '🎯', title: '合格戦略', text: '科目Aを過去問で固め、科目Bはアルゴリズム慣れに時間投資する配分が効果的。' },
      ]
    }
  },
  {
    id: 'ap',
    icon: '🚀',
    name: '応用情報技術者',
    nameEn: 'Applied IT Engineer',
    color: '#fc5c65',
    level: 4,
    badge: '国家資格 / レベル3',
    desc: '高度なIT知識と応用力を証明する国家試験。システム設計・プロジェクト管理まで広くカバー。',
    exam: { fee: '7,500円', format: '年2回（春・秋）', duration: '午前: 150分 / 午後: 150分', questions: '午前: 80問 / 午後: 11問中5問選択', passing: '各60%以上' },
    links: {
      practice: [
        { emoji: '📋', name: '応用情報技術者試験ドットコム', url: 'https://www.ap-siken.com/apkakomon.php', desc: '年度別過去問を網羅。解説が充実した定番サイト', tags: ['free', 'hot'] },
        { emoji: '🌐', name: 'IT試験.com 応用情報対策', url: 'https://it-shiken.com/exam/applied-information-technology-engineer/', desc: '試験概要・対策方法・おすすめ教材をまとめたガイド', tags: ['free'] },
        { emoji: '📚', name: 'Dekidas Web', url: 'https://dekidas.com/', desc: '書籍と連動した演習アプリ（書籍購入が必要）', tags: ['paid'] },
      ],
      books: [
        { img: 'https://m.media-amazon.com/images/I/81lostfmR7L._AC_UL480_FMwebp_QL65_.jpg', title: '令和08年 応用情報技術者 合格教本', amazon: 'https://www.amazon.co.jp/dp/4297152673/' },
        { img: 'https://m.media-amazon.com/images/I/81dv4JaQxRL._AC_UL480_FMwebp_QL65_.jpg', title: 'キタミ式イラストIT塾 応用情報技術者（令和08年）', amazon: 'https://www.amazon.co.jp/dp/4297153033/' },
      ],
      tips: [
        { icon: '📐', title: '午後の選択戦略', text: 'セキュリティは必須。残りは「経営戦略」「プロジェクト管理」「サービス管理」が取りやすい。' },
        { icon: '✍️', title: '記述答案の書き方', text: '「〜により、〜が〜となる」の構造で書く。問題文の語句を使うこと。' },
        { icon: '⏱️', title: '学習時間目安', text: '基本情報取得済：約300〜500時間。実務経験があれば短縮可能。半年〜1年計画が現実的。' },
        { icon: '🔑', title: '最重要分野', text: '情報セキュリティ（必須）＋ネットワーク or データベース を重点的に学ぶと安定する。' },
      ]
    }
  }
];

// ─────────────────────────────────────
// Gemini Cache
// ─────────────────────────────────────

if (localStorage.getItem('gemini_cache_ver') !== CACHE_VERSION) {
  localStorage.removeItem(GEMINI_CACHE_KEY);
  localStorage.setItem('gemini_cache_ver', CACHE_VERSION);
}

function getCached(key) {
  try {
    const cache = JSON.parse(localStorage.getItem(GEMINI_CACHE_KEY) || '{}');
    const entry = cache[key];
    if (entry && Date.now() - entry.ts < 86400000) return entry.text;
  } catch {}
  return null;
}

function setCache(key, text) {
  try {
    const cache = JSON.parse(localStorage.getItem(GEMINI_CACHE_KEY) || '{}');
    cache[key] = { text, ts: Date.now() };
    localStorage.setItem(GEMINI_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

async function askGemini(prompt, cacheKey = null, retries = 2, delayMs = 2000, maxTokens = 1024) {
  const key = cacheKey || prompt;
  const cached = getCached(key);
  if (cached) return cached;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens }
      })
    });
    if (res.status === 429) {
      if (attempt < retries) { await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); continue; }
      throw new Error('RATE_LIMIT');
    }
    if (res.status === 503 || res.status === 502 || res.status === 500) {
      if (attempt < retries) { await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); continue; }
      throw new Error('SERVER_ERROR');
    }
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '回答を取得できませんでした。';
    setCache(key, text);
    return text;
  }
}

// ─────────────────────────────────────
// Profile (localStorage)
// ─────────────────────────────────────

function getProfile() {
  return JSON.parse(localStorage.getItem('user_profile') || '{}');
}

function saveProfileData(data) {
  localStorage.setItem('user_profile', JSON.stringify(data));
}

// Vocab notes
function getVocabNotes() {
  return JSON.parse(localStorage.getItem('vocab_notes') || '[]');
}

function saveVocabNote(certId, term, explanation) {
  const notes = getVocabNotes();
  const existing = notes.findIndex(n => n.term === term && n.certId === certId);
  if (existing >= 0) return; // already saved
  notes.unshift({ certId, term, explanation, savedAt: new Date().toISOString() });
  localStorage.setItem('vocab_notes', JSON.stringify(notes));
}

function deleteVocabNote(term, certId) {
  const notes = getVocabNotes().filter(n => !(n.term === term && n.certId === certId));
  localStorage.setItem('vocab_notes', JSON.stringify(notes));
  renderVocabList();
}

function clearAllVocab() {
  if (!confirm('すべての保存済み用語を削除しますか？')) return;
  localStorage.removeItem('vocab_notes');
  renderVocabList();
}

// ─────────────────────────────────────
// Profile Modal
// ─────────────────────────────────────

function openProfile() {
  const p = getProfile();
  document.getElementById('p-name').value   = p.name   || '';
  document.getElementById('p-age').value    = p.age    || '';
  document.getElementById('p-status').value = p.status || '';
  document.getElementById('p-goal').value   = p.goal   || '';

  // Render exam date inputs
  document.getElementById('exam-dates-grid').innerHTML = CERTS.map(c => `
    <div class="exam-date-row">
      <span>${c.icon} ${c.name}</span>
      <input type="date" id="ed-${c.id}" value="${p.examDates?.[c.id] || ''}"
        style="accent-color:${c.color}">
    </div>
  `).join('');

  renderVocabList();
  document.getElementById('profile-modal').classList.add('open');
}

function closeProfile() {
  document.getElementById('profile-modal').classList.remove('open');
}

function closeProfileOutside(e) {
  if (e.target === document.getElementById('profile-modal')) closeProfile();
}

function saveProfile() {
  const name = document.getElementById('p-name').value.trim();
  if (!name) {
    document.getElementById('p-name').focus();
    document.getElementById('p-name').style.borderColor = '#fc5c65';
    return;
  }
  document.getElementById('p-name').style.borderColor = '';

  const examDates = {};
  CERTS.forEach(c => {
    const val = document.getElementById(`ed-${c.id}`)?.value;
    if (val) examDates[c.id] = val;
  });

  saveProfileData({
    name,
    age:    document.getElementById('p-age').value    || '',
    status: document.getElementById('p-status').value || '',
    goal:   document.getElementById('p-goal').value   || '',
    examDates
  });

  updateHeaderProfile();
  closeProfile();

  // Invalidate strategy cache so it regenerates with new profile
  localStorage.removeItem(GEMINI_CACHE_KEY);
  localStorage.setItem('gemini_cache_ver', CACHE_VERSION);
}

function updateHeaderProfile() {
  const p = getProfile();
  const nameEl = document.getElementById('header-name');
  const avatarEl = document.getElementById('header-avatar-emoji');
  
  if (p.name && nameEl) {
    nameEl.textContent = p.name;
  }
  if (avatarEl) {
    avatarEl.textContent = '😊';
  }
}

function renderVocabList() {
  const notes = getVocabNotes();
  const el = document.getElementById('vocab-list');
  if (!el) return;
  if (!notes.length) {
    el.innerHTML = `<p class="empty-msg" style="margin-top:8px">まだ保存した用語はありません。</p>`;
    return;
  }
  el.innerHTML = notes.map((n, i) => {
    const cert = CERTS.find(c => c.id === n.certId);
    const date = new Date(n.savedAt).toLocaleDateString('ja-JP');
    return `
      <div class="vocab-item">
        <div class="vocab-item-top" onclick="toggleVocabDetail(${i})" style="cursor:pointer">
          <span class="vocab-cert-tag" style="color:${cert?.color || '#8892b0'}">${cert?.icon || ''} ${cert?.name || ''}</span>
          <span class="vocab-date">${date}</span>
          <span class="vocab-toggle-icon" id="vocab-icon-${i}">▶</span>
          <button class="vocab-delete" onclick="event.stopPropagation();deleteVocabNote('${n.term}','${n.certId}')">✕</button>
        </div>
        <div class="vocab-term" onclick="toggleVocabDetail(${i})" style="cursor:pointer">${n.term}</div>
        <div class="vocab-detail" id="vocab-detail-${i}" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
          ${formatGeminiText(n.explanation)}
        </div>
      </div>
    `;
  }).join('');
}

function toggleVocabDetail(i) {
  const detail = document.getElementById(`vocab-detail-${i}`);
  const icon   = document.getElementById(`vocab-icon-${i}`);
  if (!detail) return;
  const isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  if (icon) icon.textContent = isOpen ? '▶' : '▼';
}

// ─────────────────────────────────────
// Cert Cards
// ─────────────────────────────────────

function renderCertCards() {
  const p = getProfile();
  document.getElementById('cert-grid').innerHTML = CERTS.map(c => {
    const targetDate = p.examDates?.[c.id];
    const daysLeft = targetDate
      ? Math.ceil((new Date(targetDate) - new Date()) / 86400000)
      : null;
    return `
      <div class="cert-card" style="--card-color:${c.color}" data-id="${c.id}" onclick="selectCert('${c.id}')">
        <div class="cert-icon">${c.icon}</div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-name-en">${c.nameEn}</div>
        <div class="cert-level">
          ${[1,2,3,4].map(i => `<span class="${i <= c.level ? 'filled' : ''}"></span>`).join('')}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
          <span class="cert-badge">${c.badge}</span>
          ${daysLeft !== null
            ? `<span class="days-left" style="color:${daysLeft < 30 ? '#fc5c65' : c.color}">📅 ${daysLeft > 0 ? daysLeft + '日後' : '試験日！'}</span>`
            : ''}
        </div>
      </div>
    `;
  }).join('');
}

function selectCert(id) {
  document.querySelectorAll('.cert-card').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-id="${id}"]`).classList.add('active');
  renderDetail(CERTS.find(c => c.id === id));
}

// ─────────────────────────────────────
// Detail Panel
// ─────────────────────────────────────

function renderDetail(cert) {
  const panel = document.getElementById('detail-panel');
  panel.className = 'visible';
  panel.innerHTML = `
    <div class="panel-header">
      <div class="panel-icon">${cert.icon}</div>
      <div style="flex:1">
        <h2>${cert.name}</h2>
        <p>${cert.desc}</p>
      </div>
    </div>
    ${renderExamInfo(cert)}
    <div class="tabs">
      <button class="tab-btn active" style="--active-color:${cert.color}" onclick="switchTab(this,'tab-links')">🔗 学習リンク</button>
      <button class="tab-btn" style="--active-color:${cert.color}" onclick="switchTab(this,'tab-books')">📚 書籍</button>
      <button class="tab-btn" style="--active-color:${cert.color}" onclick="switchTab(this,'tab-strategy')">🗺️ 学習戦略 AI</button>
      <button class="tab-btn" style="--active-color:${cert.color}" onclick="switchTab(this,'tab-glossary')">💡 用語解説 AI</button>
    </div>
    <div id="tab-links"    class="tab-content active">${renderLinks(cert)}</div>
    <div id="tab-books"    class="tab-content">${renderBooks(cert)}</div>
    <div id="tab-strategy" class="tab-content">${renderStrategyTab(cert)}</div>
    <div id="tab-glossary" class="tab-content">${renderGlossary(cert)}</div>
  `;
  // Init saved vocab history after DOM is ready
  initGlossaryHistory(cert.id, cert.name);
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

// ─────────────────────────────────────
// Exam Info Bar
// ─────────────────────────────────────

function renderExamInfo(cert) {
  const e = cert.exam;
  return `
    <div class="exam-info-bar">
      <div class="exam-item"><span class="exam-label">受験料</span><strong>${e.fee}</strong></div>
      <div class="exam-item"><span class="exam-label">形式</span><strong>${e.format}</strong></div>
      <div class="exam-item"><span class="exam-label">試験時間</span><strong>${e.duration}</strong></div>
      <div class="exam-item"><span class="exam-label">問題数</span><strong>${e.questions}</strong></div>
      <div class="exam-item"><span class="exam-label">合格基準</span><strong>${e.passing}</strong></div>
    </div>
  `;
}

// ─────────────────────────────────────
// Tab: Links
// ─────────────────────────────────────

function renderLinks(cert) {
  if (!cert.links.practice.length) return `<p class="empty-msg">リンク情報は準備中です。</p>`;
  const tagLabel = { free: '無料', paid: '有料', hot: '人気' };
  return `
    <div class="link-group">
      <div class="link-group-title">📌 学習・過去問サイト</div>
      <div class="link-list">
        ${cert.links.practice.map(l => `
          <a class="link-item" style="--hover-color:${cert.color}" href="${l.url}" target="_blank" rel="noopener">
            <span class="link-emoji">${l.emoji}</span>
            <div class="link-info">
              <strong>${l.name}</strong>
              <span>${l.desc}</span>
            </div>
            <div class="link-meta">
              ${l.tags.map(t => `<span class="tag ${t}">${tagLabel[t] || t}</span>`).join('')}
            </div>
            <span class="arrow-icon">→</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────
// Tab: Books
// ─────────────────────────────────────

function renderBooks(cert) {
  if (!cert.links.books?.length) return `<p class="empty-msg">書籍情報は準備中です。</p>`;
  return `
    <div class="link-group-title" style="margin-bottom:16px">📚 おすすめ参考書・問題集</div>
    <div class="book-grid">
      ${cert.links.books.map(b => `
        <a class="book-card" style="--hover-color:${cert.color}" href="${b.amazon}" target="_blank" rel="noopener">
          <div class="book-cover"><img src="${b.img}" alt="${b.title}" onerror="this.style.display='none'"></div>
          <div class="book-info">
            <strong>${b.title}</strong>
            <span class="book-link">Amazon で見る →</span>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

// ─────────────────────────────────────
// Tab: Strategy (AI generated)
// ─────────────────────────────────────

function renderStrategyTab(cert) {
  const p = getProfile();
  const hasProfile = !!p.name;
  return `
    <div class="strategy-box">
      ${hasProfile ? `
        <div class="strategy-profile-bar">
          <span>😊 ${p.name}さん向けにAIがカスタマイズされた学習戦略を作成します</span>
          <button class="btn-gen-strategy" onclick="generateStrategy('${cert.id}')" style="--btn-color:${cert.color}">
            ✨ 戦略を生成する
          </button>
        </div>
      ` : `
        <div class="strategy-no-profile">
          <span>👤</span>
          <div>
            <strong>プロフィールを設定するとAIがあなた専用の学習戦略を作成します</strong>
            <p>名前・現在の状況・目標・受験予定日を入力してください。</p>
          </div>
          <button onclick="openProfile()" style="--btn-color:${cert.color}" class="btn-gen-strategy">プロフィールを設定</button>
        </div>
      `}
      <div id="strategy-result-${cert.id}"></div>

      <div class="link-group-title" style="margin-top:28px;margin-bottom:12px">💡 一般的な合格のポイント</div>
      <div class="tips-grid">
        ${cert.links.tips.map(t => `
          <div class="tip-card">
            <div class="tip-icon">${t.icon}</div>
            <strong>${t.title}</strong>
            <p>${t.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function generateStrategy(certId) {
  const cert = CERTS.find(c => c.id === certId);
  const p = getProfile();
  const result = document.getElementById(`strategy-result-${certId}`);

  result.innerHTML = `<div class="glossary-loading"><span class="spinner"></span> AIがあなた専用の学習戦略を作成中...</div>`;

  const targetDate = p.examDates?.[certId];
  const daysLeft = targetDate
    ? Math.ceil((new Date(targetDate) - new Date()) / 86400000)
    : null;

  const cacheKey = `strategy:${certId}:${p.name}:${targetDate || 'nodate'}:${p.status}`;

  const prompt = `あなたはIT資格試験の学習コーチです。${cert.name}の合格に向けた学習戦略を作成してください。

ユーザー：${p.name}／${p.age || '年齢不明'}／${p.status || '状況不明'}
目標：${p.goal || '未設定'}
受験まで：${daysLeft !== null ? daysLeft + '日' : '未設定'}
試験形式：${cert.exam.format}／合格基準：${cert.exam.passing}

以下の4ブロックのみ出力（各ブロックは必ず書くこと）：

[現状分析]
ユーザーの状況を踏まえた分析（2〜3文）

[推奨学習スケジュール]
残り日数に合わせた週単位スケジュール（4〜5ステップ、各ステップ1文）

[重点学習分野]
優先すべき分野と理由（3つ、各1〜2文）

[モチベーション維持のコツ]
この人向けの具体的アドバイス（2〜3文）`.trim();

  try {
    const text = await askGemini(prompt, cacheKey, 2, 2000, 2048);
    result.innerHTML = `
      <div class="strategy-result-wrap">
        <div class="strategy-ai-label">✨ Gemini AI による個人最適化戦略</div>
        ${formatStrategyText(text)}
        <button class="btn-regen" onclick="regenStrategy('${certId}')" style="color:${cert.color}">
          🔄 再生成する
        </button>
      </div>
    `;
  } catch (e) {
    const msg = e.message === 'RATE_LIMIT'
      ? '⏳ <strong>リクエスト制限です。</strong><br><span style="font-size:0.78rem">1分ほど待ってから再試行してください。</span>'
      : e.message === 'SERVER_ERROR'
      ? '🔄 <strong>AIサーバーが混雑しています。</strong><br><span style="font-size:0.78rem">しばらく待ってから「再生成する」を押してください。</span>'
      : `⚠️ エラー: ${e.message}`;
    result.innerHTML = `<div class="glossary-error">${msg}<br><br>
      <button class="btn-regen" onclick="regenStrategy('${certId}')" style="color:${cert.color}">🔄 再試行する</button>
    </div>`;
  }
}

function regenStrategy(certId) {
  // Clear cache for this cert's strategy so it regenerates
  try {
    const p = getProfile();
    const targetDate = p.examDates?.[certId];
    const cacheKey = `strategy:${certId}:${p.name}:${targetDate || 'nodate'}:${p.status}`;
    const cache = JSON.parse(localStorage.getItem(GEMINI_CACHE_KEY) || '{}');
    delete cache[cacheKey];
    localStorage.setItem(GEMINI_CACHE_KEY, JSON.stringify(cache));
  } catch {}
  generateStrategy(certId);
}

const STRATEGY_BLOCK_META = {
  '現状分析':           { icon: '🔍', color: '#6c63ff' },
  '推奨学習スケジュール': { icon: '📅', color: '#48cfad' },
  '重点学習分野':        { icon: '🎯', color: '#f7b731' },
  'モチベーション維持のコツ': { icon: '💪', color: '#fc5c65' },
};

function formatStrategyText(text) {
  const blockRegex = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
  let html = '';
  let match;
  while ((match = blockRegex.exec(text)) !== null) {
    const label = match[1].trim();
    const content = match[2].trim()
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^[-・]\s*/gm, '')
      .split('\n').filter(l => l.trim()).map(l => `<div class="strategy-line">▸ ${l.trim()}</div>`).join('');
    const meta = STRATEGY_BLOCK_META[label] || { icon: '📌', color: 'var(--accent2)' };
    html += `
      <div class="gloss-block">
        <div class="gloss-block-header" style="color:${meta.color}">
          <span>${meta.icon}</span><span>${label}</span>
        </div>
        <div class="gloss-block-body">${content}</div>
      </div>
    `;
  }
  return html || `<div class="gloss-block-body">${text.replace(/\n/g, '<br>')}</div>`;
}

// ─────────────────────────────────────
// Tab: Glossary (AI + Saved Notes)
// ─────────────────────────────────────

// Temp store: full Gemini raw text keyed by "certId:term"
// Used so handleSaveVocab can save the full explanation, not just a snippet
const _pendingGlossary = {};

function renderGlossary(cert) {
  return `
    <div class="glossary-wrap">
      <!-- Search box -->
      <div class="glossary-box">
        <div class="glossary-header">
          <span class="glossary-ai-badge">✨ Gemini AI</span>
          <p>わからない用語を入力すると、AIが${cert.name}の試験に合わせてわかりやすく解説します。保存済みの用語はDBから即座に表示します。</p>
        </div>
        <div class="glossary-input-row">
          <input type="text" id="glossary-input"
            placeholder="例：ハルシネーション、API、TCP/IP..."
            onkeydown="if(event.key==='Enter') askGlossary('${cert.id}','${cert.name}')">
          <button onclick="askGlossary('${cert.id}','${cert.name}')" style="--btn-color:${cert.color}">解説する</button>
        </div>
        <div class="glossary-suggestions">
          ${getQuickTerms(cert.id).map(term => `
            <button class="term-chip" onclick="fillAndAsk('${cert.id}','${cert.name}','${term}')">${term}</button>
          `).join('')}
        </div>
        <div id="glossary-result" class="glossary-result" style="display:none"></div>
      </div>

      <!-- Saved vocab as history -->
      <div class="glossary-history-box">
        <div class="glossary-history-title">💾 保存済み用語</div>
        <div id="glossary-history-list"></div>
      </div>
    </div>
  `;
}

// Called after renderGlossary is injected into DOM
function initGlossaryHistory(certId, certName) {
  renderSavedVocabHistory(certId, certName);
}

function renderSavedVocabHistory(certId, certName) {
  const el = document.getElementById('glossary-history-list');
  if (!el) return;
  const notes = getVocabNotes().filter(n => n.certId === certId);
  if (!notes.length) {
    el.innerHTML = `<p class="empty-msg">まだ保存した用語はありません。</p>`;
    return;
  }
  const cert = CERTS.find(c => c.id === certId);
  el.innerHTML = notes.map(n => `
    <div class="history-item">
      <button class="history-term" onclick="showSavedVocab('${n.certId}','${encodeURIComponent(n.term)}','${certName}')">${n.term}</button>
      <span class="history-cert" style="color:${cert?.color}">${cert?.icon} ${cert?.name}</span>
      <span class="history-saved">💾 保存済み</span>
    </div>
  `).join('');
}

function showSavedVocab(certId, encodedTerm, certName) {
  const term = decodeURIComponent(encodedTerm);
  const note = getVocabNotes().find(n => n.certId === certId && n.term === term);
  if (!note) return;

  // Fill input
  const input = document.getElementById('glossary-input');
  if (input) input.value = term;

  // Display saved explanation
  const result = document.getElementById('glossary-result');
  if (!result) return;
  result.style.display = 'block';
  result.innerHTML = `
    <div class="glossary-term-title">
      📖 「${term}」の解説
      <span class="cache-badge">💾 保存済み</span>
    </div>
    <div class="glossary-content">${formatGeminiText(note.explanation)}</div>
    <div class="save-prompt" style="justify-content:flex-end">
      <button class="btn-save-vocab btn-delete-vocab"
        onclick="handleDeleteFromGlossary('${certId}','${encodeURIComponent(term)}','${certName}',this)">
        🗑️ ノートから削除
      </button>
    </div>
  `;
}

function handleDeleteFromGlossary(certId, encodedTerm, certName, btn) {
  const term = decodeURIComponent(encodedTerm);
  window.deleteVocabNote(term, certId);
  btn.closest('.save-prompt').innerHTML = '<span style="color:var(--text-sub);font-size:0.8rem">🗑️ 削除しました</span>';
  renderSavedVocabHistory(certId, certName);
}

function getQuickTerms(certId) {
  const terms = {
    'ai-passport': ['ハルシネーション', 'プロンプト', 'LLM', 'ファインチューニング', 'RAG', 'AI倫理'],
    'it-passport': ['API', 'クラウド', 'IoT', 'セキュリティ', 'アジャイル', 'データベース'],
    'fe':          ['スタック', '二分探索', 'SQL', 'OSI参照モデル', 'キャッシュ', '疑似言語'],
    'ap':          ['RASIS', 'デッドロック', 'ディジタル署名', 'SLA', 'バッファオーバーフロー', 'E-R図'],
  };
  return terms[certId] || [];
}

function fillAndAsk(certId, certName, term) {
  document.getElementById('glossary-input').value = term;
  askGlossary(certId, certName);
}

async function askGlossary(certId, certName) {
  const input = document.getElementById('glossary-input');
  const term  = input.value.trim();
  if (!term) return;

  const result = document.getElementById('glossary-result');
  result.style.display = 'block';

  // ── 1. Kiểm tra vocabNotes cá nhân — hiển thị ngay, không gọi AI ──
  const savedNote = getVocabNotes().find(n => n.certId === certId && n.term === term);
  if (savedNote && savedNote.explanation) {
    result.innerHTML = `
      <div class="glossary-term-title">
        📖 「${term}」の解説
        <span class="cache-badge">💾 保存済み</span>
      </div>
      <div class="glossary-content">${formatGeminiText(savedNote.explanation)}</div>
      <div class="save-prompt" style="justify-content:flex-end">
        <button class="btn-save-vocab btn-delete-vocab"
          onclick="handleDeleteFromGlossary('${certId}','${encodeURIComponent(term)}','${certName}',this)">
          🗑️ ノートから削除
        </button>
      </div>
    `;
    return;
  }

  // ── 2. Kiểm tra global vocab cache trên Firestore ──
  result.innerHTML = `<div class="glossary-loading"><span class="spinner"></span> DBを確認中...</div>`;
  const globalEntry = window.getGlobalVocab ? await window.getGlobalVocab(certId, term) : null;
  if (globalEntry && globalEntry.explanation) {
    _pendingGlossary[`${certId}:${term}`] = globalEntry.explanation;
    const alreadySaved = getVocabNotes().some(n => n.certId === certId && n.term === term);
    result.innerHTML = `
      <div class="glossary-term-title">
        📖 「${term}」の解説
        <span class="cache-badge" style="background:rgba(72,207,173,0.15);color:var(--accent2)">🌐 共有キャッシュ</span>
      </div>
      <div class="glossary-content">${formatGeminiText(globalEntry.explanation)}</div>
      <div class="save-prompt">
        <span>📌 この用語をノートに保存しますか？</span>
        <button class="btn-save-vocab"
          onclick="handleSaveVocab('${certId}','${encodeURIComponent(term)}','${certName}',this)"
          ${alreadySaved ? 'disabled' : ''}>
          ${alreadySaved ? '✅ 保存済み' : '保存する'}
        </button>
      </div>
    `;
    return;
  }

  // ── 3. Chưa có trong DB → gọi Gemini AI ──
  const isCached = !!getCached(`${certId}:${term}`);
  result.innerHTML = `<div class="glossary-loading"><span class="spinner"></span> ${isCached ? 'キャッシュから読み込み中...' : 'AIが解説を生成中...'}</div>`;

  const prompt = `あなたは${certName}の試験対策の専門コーチです。

まず、入力された「${term}」がIT・情報技術・コンピュータサイエンス・ビジネスIT・${certName}試験に関連する用語かどうかを判断してください。
関係のない日常会話・料理・スポーツ・その他の全く無関係な内容の場合は、[NOT_IT_TERM] とだけ出力して終了してください。

IT用語の場合のみ、以下の4ブロックを全て出力してください：

[一言で言うと]
専門用語を使わず、日常の言葉だけで1〜2文。

[具体例で理解する]
理解を深めるために、現実の具体的な例・場面・ストーリーを使って説明してください。
似た概念・対比概念がある場合は「〇〇との違い」も必ず書くこと。
説明が長くなっても構いません。意味が伝わることを最優先にしてください（目安500字以内）。

[試験ではこう出る]
${certName}の試験でどのように出題されるか（選択肢の引っかけパターン・頻出の問われ方）を具体的に説明してください。

[覚え方のコツ]
語呂合わせ・比喩・図解イメージ・ストーリーなど、記憶に残る覚え方を書いてください。`.trim();

  try {
    const cacheKey = `${certId}:${term}`;
    const text = await askGemini(prompt, cacheKey, 2, 2000, 3000);

    // IT用語でない場合
    if (text.trim().startsWith('[NOT_IT_TERM]')) {
      result.innerHTML = `
        <div class="glossary-error" style="text-align:center;padding:20px 0">
          <div style="font-size:2rem;margin-bottom:8px">🚫</div>
          <strong>「${term}」はIT用語ではありません</strong><br>
          <span style="font-size:0.78rem;color:var(--text-sub)">
            ${certName}の試験に関連するIT・コンピュータ用語を入力してください。
          </span>
        </div>`;
      // NOT_IT_TERMはキャッシュしない
      try {
        const cache = JSON.parse(localStorage.getItem(GEMINI_CACHE_KEY) || '{}');
        delete cache[cacheKey];
        localStorage.setItem(GEMINI_CACHE_KEY, JSON.stringify(cache));
      } catch {}
      return;
    }

    // IT用語 → globalVocab に保存（全ユーザー共有）
    _pendingGlossary[cacheKey] = text;
    if (window.saveGlobalVocab) window.saveGlobalVocab(certId, term, text);

    const alreadySaved = getVocabNotes().some(n => n.certId === certId && n.term === term);
    result.innerHTML = `
      <div class="glossary-term-title">
        📖 「${term}」の解説
        ${isCached ? '<span class="cache-badge">💾 キャッシュ済み</span>' : ''}
      </div>
      <div class="glossary-content">${formatGeminiText(text)}</div>
      <div class="save-prompt">
        <span>📌 この用語をノートに保存しますか？</span>
        <button class="btn-save-vocab"
          onclick="handleSaveVocab('${certId}','${encodeURIComponent(term)}','${certName}',this)"
          ${alreadySaved ? 'disabled' : ''}>
          ${alreadySaved ? '✅ 保存済み' : '保存する'}
        </button>
      </div>
    `;

  } catch (e) {
    const msg = e.message === 'RATE_LIMIT'
      ? '⏳ <strong>リクエスト制限です。</strong><br><span style="font-size:0.78rem">1分ほど待ってから再度お試しください。</span>'
      : e.message === 'SERVER_ERROR'
      ? '🔄 <strong>AIサーバーが混雑しています。</strong><br><span style="font-size:0.78rem">しばらく待ってからもう一度お試しください。</span>'
      : `⚠️ エラー: ${e.message}`;
    result.innerHTML = `<div class="glossary-error">${msg}</div>`;
  }
}

function handleSaveVocab(certId, encodedTerm, certName, btn) {
  const term      = decodeURIComponent(encodedTerm);
  const cacheKey  = `${certId}:${term}`;
  // Lấy full explanation từ _pendingGlossary (Gemini raw text)
  const fullText  = _pendingGlossary[cacheKey] || getCached(cacheKey) || term;

  window.saveVocabNote(certId, term, fullText);
  btn.textContent = '✅ 保存しました';
  btn.disabled    = true;

  // Refresh saved vocab panel
  renderSavedVocabHistory(certId, certName);
}

// ─────────────────────────────────────
// Glossary text formatter
// ─────────────────────────────────────

const BLOCK_META = {
  '一言で言うと':     { icon: '💡', color: '#48cfad' },
  'もう少し詳しく':   { icon: '📖', color: '#6c63ff' },
  '具体例で理解する': { icon: '🔍', color: '#6c63ff' },
  '試験ではこう出る': { icon: '📝', color: '#f7b731' },
  '覚え方のコツ':     { icon: '🧠', color: '#fc5c65' },
};

function formatGeminiText(text) {
  const blockRegex = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
  let html = '';
  let match;
  let matched = false;
  while ((match = blockRegex.exec(text)) !== null) {
    const label = match[1].trim();
    const content = match[2].trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const meta = BLOCK_META[label] || { icon: '•', color: 'var(--accent2)' };
    matched = true;
    html += `
      <div class="gloss-block">
        <div class="gloss-block-header" style="color:${meta.color}">
          <span>${meta.icon}</span><span>${label}</span>
        </div>
        <div class="gloss-block-body">${content}</div>
      </div>
    `;
  }
  if (!matched) {
    html = `<div class="gloss-block-body">${text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>`;
  }
  return html;
}

// ─────────────────────────────────────
// Tab switcher
// ─────────────────────────────────────

function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// ─────────────────────────────────────
// Init
// ─────────────────────────────────────

// Expose functions so app.js (ES module) can access and wrap them
window.renderCertCards     = renderCertCards;
window.updateHeaderProfile = updateHeaderProfile;
window.saveProfile         = saveProfile;
window.saveVocabNote       = saveVocabNote;
window.deleteVocabNote     = deleteVocabNote;
window.clearAllVocab       = clearAllVocab;
window.renderVocabList     = renderVocabList;
window.openProfile         = openProfile;

// Do NOT auto-init here — app.js calls these after Firebase auth resolves
