// ─────────────────────────────────────
// company-search.js — 企業研究AIアシスタント
// 10項目でIT企業情報をリアルタイム調査
// ─────────────────────────────────────

const CS_SECTIONS = [
  { key: 'basic',    icon: '🏢', label: '基本情報',          color: 'var(--accent2)' },
  { key: 'business', icon: '💼', label: '事業内容',          color: 'var(--accent)' },
  { key: 'strength', icon: '⭐', label: '強み・特徴',         color: 'var(--accent3)' },
  { key: 'perf',     icon: '📈', label: '業績・安定性',       color: '#48cfad' },
  { key: 'clients',  icon: '🤝', label: '取引先・プロジェクト', color: '#4a90d9' },
  { key: 'tech',     icon: '🛠️', label: '技術スタック',       color: '#e879f9' },
  { key: 'career',   icon: '🚀', label: 'キャリアパス',       color: 'var(--accent3)' },
  { key: 'work',     icon: '⏰', label: '労働条件',           color: 'var(--accent4)' },
  { key: 'culture',  icon: '🌍', label: '社風・環境',         color: 'var(--accent)' },
  { key: 'recruit',  icon: '📋', label: '採用情報',           color: 'var(--accent2)' },
];

let csHistory = JSON.parse(localStorage.getItem('cs_history') || '[]'); // [{name, date}]
let csCurrentResult = null;

// ── Init ──

function initCompanySearch() {
  renderCSPage();
}

function renderCSPage() {
  const wrap = document.getElementById('tab-company');
  if (!wrap) return;

  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- Hero -->
      <div style="
        background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(72,207,173,0.1));
        border:1px solid rgba(108,99,255,0.25);border-radius:16px;padding:24px;
      ">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;color:var(--accent2);text-transform:uppercase;margin-bottom:8px">
          🔍 企業研究AIアシスタント
        </div>
        <p style="font-size:0.85rem;color:var(--text-sub);line-height:1.7;margin-bottom:14px">
          IT企業名を入力すると、AIが<strong style="color:var(--text)">10の観点</strong>で就活に必要な情報を
          <strong style="color:var(--accent)">本日（${today}）時点</strong>の最新情報をもとにまとめます。
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${['📋 基本情報','💼 事業内容','⭐ 強み','📈 業績','🛠️ 技術スタック'].map(t=>`
            <span style="font-size:0.72rem;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:20px;padding:3px 12px;color:var(--text-sub)">${t}</span>
          `).join('')}
          <span style="font-size:0.72rem;color:var(--text-sub);padding:3px 4px">+ 5項目</span>
        </div>
      </div>

      <!-- Search Box -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px 22px">
        <div style="font-size:0.72rem;font-weight:700;color:var(--text-sub);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">
          企業名を入力
        </div>
        <div style="display:flex;gap:10px">
          <div style="flex:1;position:relative">
            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:1rem;pointer-events:none">🔍</span>
            <input id="cs-input" type="text" class="cs-search-input"
              placeholder="例：富士通、サイバーエージェント、リクルート..."
              onkeydown="if(event.key==='Enter')csSearch()"
              oninput="csUpdateBtn()"
            >
          </div>
          <button id="cs-search-btn" onclick="csSearch()" disabled style="
            background:linear-gradient(135deg,var(--accent2),var(--accent));
            border:none;border-radius:10px;color:#fff;font-size:0.88rem;font-weight:700;
            padding:0 22px;cursor:not-allowed;opacity:0.4;font-family:inherit;
            transition:opacity 0.2s;white-space:nowrap
          ">🔍 調査する</button>
        </div>

        <!-- Quick select suggestions -->
        <div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">
          <span style="font-size:0.7rem;color:var(--text-sub);padding:3px 0">よく調べられる企業：</span>
          ${['富士通','NTTデータ','サイバーエージェント','DeNA','メルカリ','LINE','ソフトバンク','楽天'].map(n=>`
            <button onclick="csQuickSearch('${n}')" style="
              font-size:0.72rem;background:var(--surface2);border:1px solid var(--border);
              border-radius:20px;color:var(--text-sub);padding:3px 12px;cursor:pointer;
              font-family:inherit;transition:all 0.15s
            " onmouseover="this.style.borderColor='var(--accent2)';this.style.color='var(--accent2)'"
               onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-sub)'"
            >${n}</button>
          `).join('')}
        </div>
      </div>

      <!-- Result area -->
      <div id="cs-result"></div>

      <!-- History -->
      <div id="cs-history-section">${csRenderHistory()}</div>

    </div>
  `;
}

function csUpdateBtn() {
  const val = document.getElementById('cs-input')?.value.trim();
  const btn = document.getElementById('cs-search-btn');
  if (!btn) return;
  btn.disabled = !val;
  btn.style.opacity  = val ? '1' : '0.4';
  btn.style.cursor   = val ? 'pointer' : 'not-allowed';
}

function csQuickSearch(name) {
  const input = document.getElementById('cs-input');
  if (input) { input.value = name; csUpdateBtn(); }
  csSearch();
}

// ── Search ──

async function csSearch() {
  const input = document.getElementById('cs-input');
  const name  = input?.value.trim();
  if (!name) return;

  const btn = document.getElementById('cs-search-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px"></div>調査中...'; }

  const resultEl = document.getElementById('cs-result');
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

  resultEl.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:40px;text-align:center">
      <div class="spinner" style="margin:0 auto 16px;width:32px;height:32px;border-width:3px"></div>
      <div style="font-size:0.88rem;font-weight:700;margin-bottom:6px">「${name}」を調査中...</div>
      <div style="font-size:0.78rem;color:var(--text-sub)">AIが最新情報を収集・分析しています</div>
    </div>
  `;
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const prompt = buildCSPrompt(name, today);

  try {
    let text;
    // For Google models, try grounding with Google Search
    const model = window.getGeminiModel();
    if (model.startsWith('gemini')) {
      text = await csCallWithGrounding(prompt);
    } else {
      text = await window.callAI(prompt, 4000, 3, 2000);
    }

    csCurrentResult = { name, text, date: today };
    csAddHistory(name, today);
    renderCSResult(name, text, today);

  } catch (e) {
    const msg = e.message === 'RATE_LIMIT'   ? 'リクエストが集中しています。しばらく待ってから再試行してください。'
              : e.message === 'SERVER_ERROR'  ? 'AIサーバーが混雑しています。しばらく待ってから再試行してください。'
              : e.message;
    resultEl.innerHTML = `
      <div style="background:rgba(252,92,101,0.08);border:1px solid rgba(252,92,101,0.25);border-radius:14px;padding:20px 22px;display:flex;align-items:center;gap:14px">
        <span style="font-size:1.4rem">⚠️</span>
        <div>
          <div style="font-size:0.85rem;font-weight:700;color:var(--accent4);margin-bottom:4px">調査に失敗しました</div>
          <div style="font-size:0.8rem;color:var(--text-sub)">${msg}</div>
        </div>
        <button onclick="csSearch()" style="margin-left:auto;background:var(--accent4);border:none;border-radius:8px;color:#fff;padding:8px 16px;cursor:pointer;font-family:inherit;font-size:0.8rem;flex-shrink:0">再試行</button>
      </div>
    `;
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '🔍 調査する'; }
  }
}

// Gemini with Google Search grounding
async function csCallWithGrounding(prompt, retries = 3) {
  const key   = window.getGeminiKey();
  const model = window.getGeminiModel();
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4000 }
        })
      });
      if ([429, 500, 502, 503].includes(res.status)) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
        throw new Error(res.status === 429 ? 'RATE_LIMIT' : 'SERVER_ERROR');
      }
      if (!res.ok) {
        // Grounding not supported / key issue — fall back to regular callAI
        return window.callAI(prompt, 4000, retries, 2000);
      }
      const json = await res.json();
      // Join all text parts (grounding may split answer across multiple parts)
      const parts = json.candidates?.[0]?.content?.parts || [];
      const text  = parts.map(p => p.text || '').join('').trim();
      // If grounding returned empty (tool-call only, no final text), fall back
      if (!text) return window.callAI(prompt, 4000, retries, 2000);
      return text;
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
}

// ── Prompt ──

function buildCSPrompt(name, today) {
  return `あなたは就職活動支援の専門家AIです。
今日は${today}です。以下のIT企業について、就活生に必要な最新情報を詳しく調査・回答してください。

企業名：【${name}】

以下の10項目を必ず全て出力してください。各項目は「[項目番号]タグ」で囲んでください：

[基本情報]
・正式名称、設立年、代表取締役（CEO）
・本社所在地
・従業員数（概数）
・主な拠点（国内外）
・上場状況（東証プライム/スタンダード/未上場など）

[事業内容]
・何をしている会社か（主要事業）
・自社サービスか受託開発か
・主な顧客層（B2B・B2C・官公庁など）
・代表的なサービス・製品名

[強み・特徴]
・競合他社と比べた強み・差別化ポイント
・注目される技術・専門領域
・会社の独自の文化・特徴
・業界内でのポジション

[業績・安定性]
・直近の売上・営業利益（おおよその規模）
・業績トレンド（成長中・安定・要注意）
・資金調達状況（スタートアップの場合）
・財務的な安定性の評価

[取引先・プロジェクト]
・主要取引先・パートナー企業
・代表的なプロジェクト・実績
・大手企業との取引有無

[技術スタック]
・主要プログラミング言語
・フレームワーク・ライブラリ
・クラウド環境（AWS/Azure/GCP）
・開発スタイル（アジャイル/ウォーターフォール）

[キャリアパス]
・新卒入社後の最初の業務（テスト/開発/営業）
・SEやリーダーへの昇進スピード
・研修制度・教育サポートの充実度
・社内異動・キャリアチェンジの可能性

[労働条件]
・初任給・給与水準（業界平均比）
・平均残業時間
・有給取得率・休暇制度
・リモートワーク対応状況
・福利厚生の特徴

[社風・環境]
・職場の雰囲気（フラット/縦割り）
・外国人社員・留学生の採用状況
・ダイバーシティへの取り組み
・社員の平均年齢・雰囲気

[採用情報]
・現在募集中の職種（SE/AI/Web/PM など）
・求められるスキル・経験
・採用プロセス・面接回数
・面接でよく聞かれること（既知の場合）
・採用のポイント・アドバイス

---
注意：
- 情報が不明または最新データが存在しない場合は「情報なし」と記載してください
- 憶測や誤情報を避け、できる限り根拠のある情報を提供してください
- 就活生の視点で役立つ情報を重点的に記載してください`.trim();
}

// ── Render result ──

function renderCSResult(name, text, today) {
  const resultEl = document.getElementById('cs-result');

  // Parse sections
  const sections = {};
  const sectionKeys = ['基本情報','事業内容','強み・特徴','業績・安定性','取引先・プロジェクト','技術スタック','キャリアパス','労働条件','社風・環境','採用情報'];
  sectionKeys.forEach((key, i) => {
    const next = sectionKeys[i + 1];
    const re = new RegExp(`\\[${key}\\]([\\s\\S]*?)(?=\\[${next || '$^'}\\]|$)`);
    const m = text.match(re);
    sections[key] = m ? m[1].trim() : '';
  });

  // Also try to use full text as fallback if parsing fails
  const hasContent = Object.values(sections).some(v => v.length > 10);
  if (!hasContent) {
    // Raw display
    sections['基本情報'] = text;
  }

  const html = `
    <!-- Header -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="font-size:2.2rem">🏢</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:1.1rem;font-weight:800;color:var(--text)">${name}</div>
        <div style="font-size:0.75rem;color:var(--text-sub);margin-top:2px">
          📅 調査日：${today} ／ AI情報（参考用）
        </div>
      </div>
      <button onclick="csCopyAll()" style="
        background:var(--surface2);border:1px solid var(--border);border-radius:8px;
        color:var(--text-sub);font-size:0.78rem;padding:7px 14px;cursor:pointer;font-family:inherit;
        transition:all 0.15s;flex-shrink:0
      " onmouseover="this.style.borderColor='var(--accent2)';this.style.color='var(--accent2)'"
         onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-sub)'">
        📋 全てコピー
      </button>
      <button onclick="csSearchNew()" style="
        background:linear-gradient(135deg,var(--accent2),var(--accent));
        border:none;border-radius:8px;color:#fff;font-size:0.78rem;font-weight:700;
        padding:7px 14px;cursor:pointer;font-family:inherit;flex-shrink:0
      ">🔍 別の企業を調べる</button>
    </div>

    <!-- Disclaimer -->
    <div style="background:rgba(247,183,49,0.07);border:1px solid rgba(247,183,49,0.25);border-radius:10px;padding:10px 14px;font-size:0.75rem;color:var(--accent3);line-height:1.6">
      ⚠️ AIの回答は参考情報です。重要な情報（給与・残業など）は必ず公式サイト・説明会で確認してください。
    </div>

    <!-- Section cards -->
    <div style="display:grid;grid-template-columns:1fr;gap:12px">
      ${CS_SECTIONS.map(s => {
        const sectionLabels = {
          basic:'基本情報', business:'事業内容', strength:'強み・特徴',
          perf:'業績・安定性', clients:'取引先・プロジェクト', tech:'技術スタック',
          career:'キャリアパス', work:'労働条件', culture:'社風・環境', recruit:'採用情報'
        };
        const content = sections[sectionLabels[s.key]] || '';
        return `
          <div class="cs-section-card" id="cs-card-${s.key}">
            <div class="cs-card-header" onclick="csToggleSection('${s.key}')">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:1.3rem">${s.icon}</span>
                <span style="font-weight:700;font-size:0.9rem">${s.label}</span>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="event.stopPropagation();csкопировать('${s.key}')"
                  style="background:transparent;border:1px solid var(--border);border-radius:6px;color:var(--text-sub);font-size:0.7rem;padding:3px 9px;cursor:pointer;font-family:inherit"
                  onmouseover="this.style.borderColor='${s.color}';this.style.color='${s.color}'"
                  onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-sub)'"
                >📋</button>
                <span class="cs-chevron" id="cs-chevron-${s.key}" style="color:var(--text-sub);font-size:0.7rem;transition:transform 0.2s;transform:rotate(180deg)">▼</span>
              </div>
            </div>
            <div class="cs-card-body cs-body-open" id="cs-body-${s.key}">
              <div class="cs-card-content" id="cs-content-${s.key}">
                ${content
                  ? content.split('\n').filter(l => l.trim())
                      .map(l => `<div style="display:flex;gap:8px;margin-bottom:6px;line-height:1.6">
                        <span style="flex-shrink:0;color:${s.color}">${l.startsWith('・') || l.startsWith('•') || l.startsWith('-') ? '' : '▸'}</span>
                        <span>${l.replace(/^[・•\-]\s*/,'')}</span>
                      </div>`).join('')
                  : `<div style="color:var(--text-sub);font-style:italic">情報なし</div>`}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  resultEl.innerHTML = html;

  // Store raw text for copy
  window._csRawText = text;
  window._csCompanyName = name;

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function csToggleSection(key) {
  const body    = document.getElementById(`cs-body-${key}`);
  const chevron = document.getElementById(`cs-chevron-${key}`);
  if (!body) return;
  const isOpen = body.classList.contains('cs-body-open');
  body.classList.toggle('cs-body-open', !isOpen);
  if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function csExpandAll() {
  CS_SECTIONS.forEach(s => {
    document.getElementById(`cs-body-${s.key}`)?.classList.add('cs-body-open');
    const c = document.getElementById(`cs-chevron-${s.key}`);
    if (c) c.style.transform = 'rotate(180deg)';
  });
}

// csExpandAll is called inside renderCSResult after innerHTML is set

function csКопировать(key) { // alias for copy (avoid unicode issue)
  const el = document.getElementById(`cs-content-${key}`);
  if (!el) return;
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => showCopied(key));
}
// expose with ascii-safe name
window.csкопировать = csКопировать;

function showCopied(key) {
  const btn = document.querySelector(`#cs-card-${key} button`);
  if (btn) { const orig = btn.textContent; btn.textContent = '✅'; setTimeout(() => btn.textContent = orig, 1200); }
}

function csCopyAll() {
  if (!window._csRawText) return;
  const header = `【${window._csCompanyName || '企業'}】 企業研究レポート\n調査日：${new Date().toLocaleDateString('ja-JP')}\n\n`;
  navigator.clipboard.writeText(header + window._csRawText).then(() => {
    const btn = document.querySelector('[onclick="csCopyAll()"]');
    if (btn) { const orig = btn.innerHTML; btn.innerHTML = '✅ コピー完了'; setTimeout(() => btn.innerHTML = orig, 1500); }
  });
}

function csSearchNew() {
  document.getElementById('cs-result').innerHTML = '';
  document.getElementById('cs-input')?.focus();
  document.getElementById('cs-input').value = '';
  csUpdateBtn();
  document.getElementById('cs-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── History ──

function csAddHistory(name, date) {
  csHistory = csHistory.filter(h => h.name !== name);
  csHistory.unshift({ name, date });
  if (csHistory.length > 8) csHistory = csHistory.slice(0, 8);
  localStorage.setItem('cs_history', JSON.stringify(csHistory));
  const histEl = document.getElementById('cs-history-section');
  if (histEl) histEl.innerHTML = csRenderHistory();
}

function csRenderHistory() {
  if (csHistory.length === 0) return '';
  return `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 20px">
      <div style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;color:var(--text-sub);text-transform:uppercase;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
        <span>🕑 最近調べた企業</span>
        <button onclick="csClearHistory()" style="background:transparent;border:none;color:var(--text-sub);font-size:0.7rem;cursor:pointer;font-family:inherit;opacity:0.7">クリア</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${csHistory.map(h => `
          <button onclick="csQuickSearch('${h.name}')" style="
            background:var(--surface2);border:1px solid var(--border);border-radius:20px;
            color:var(--text-sub);font-size:0.75rem;padding:5px 14px;cursor:pointer;
            font-family:inherit;transition:all 0.15s;display:flex;align-items:center;gap:6px
          " onmouseover="this.style.borderColor='var(--accent2)';this.style.color='var(--accent2)'"
             onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-sub)'">
            🏢 ${h.name}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function csClearHistory() {
  csHistory = [];
  localStorage.removeItem('cs_history');
  const histEl = document.getElementById('cs-history-section');
  if (histEl) histEl.innerHTML = '';
}

// Expose
window.initCompanySearch = initCompanySearch;
window.csSearch          = csSearch;
window.csQuickSearch     = csQuickSearch;
window.csUpdateBtn       = csUpdateBtn;
window.csToggleSection   = csToggleSection;
window.csCopyAll         = csCopyAll;
window.csSearchNew       = csSearchNew;
window.csClearHistory    = csClearHistory;
window.csкопировать      = csКопировать;  // html uses this
