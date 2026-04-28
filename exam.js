// ─────────────────────────────────────
// exam.js  —  SPI / WebCAB / 筆記試験対策
// ─────────────────────────────────────

// API key + model resolved dynamically from gemini-config.js (supports user override)

async function geminiExam(prompt, maxTokens = 2048, retries = 3, delayMs = 2000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(window.getGeminiURL(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.75, maxOutputTokens: maxTokens }
        })
      });
      if ([429, 500, 502, 503].includes(res.status)) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); continue; }
        throw new Error(res.status === 429 ? 'RATE_LIMIT' : 'SERVER_ERROR');
      }
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
}

// ─────────────────────────────────────
// SPI 対策
// ─────────────────────────────────────

function renderSPI() {
  const wrap = document.getElementById('tab-spi');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- 概要 -->
      <div class="exam-intro-card">
        <div class="exam-section-label" style="color:var(--accent2)">📊 SPI とは</div>
        <p style="font-size:0.85rem;color:var(--text-sub);line-height:1.7;margin-top:8px">
          SPI（Scholastic Personal Inventory）は、リクルート社が開発した適性検査で、
          日本の就職活動で最も広く使われる筆記試験です。<br>
          <strong style="color:var(--text)">能力検査</strong>（言語・非言語）と
          <strong style="color:var(--text)">性格検査</strong>の2部構成です。
        </p>
        <div class="exam-tag-row" style="margin-top:12px">
          <span class="exam-tag" style="--tc:var(--accent2)">🏢 受験形式: テストセンター / Web / ペーパー</span>
          <span class="exam-tag" style="--tc:var(--accent3)">⏱️ 所要時間: 約35〜70分</span>
          <span class="exam-tag" style="--tc:var(--accent)">📅 有効期限: テストセンターは1年間</span>
        </div>
      </div>

      <!-- 言語分野 -->
      <div class="exam-section-card">
        <div class="exam-section-header">
          <span class="exam-badge" style="background:rgba(108,99,255,0.15);color:var(--accent2);border-color:rgba(108,99,255,0.3)">言語分野</span>
          <span style="font-size:0.78rem;color:var(--text-sub)">語彙力・読解力・論理的思考</span>
        </div>
        <div class="exam-topic-grid">
          ${[
            ['語句の意味', '慣用句・ことわざ・四字熟語の意味を問う。語彙力が直結する。', '📖'],
            ['語句の用法', '同じ意味・用法の語句を選ぶ。文脈理解が重要。', '🔤'],
            ['文の並び替え', '文章の順序を並び替えて文意を成立させる。', '📝'],
            ['長文読解', '長い文章を読んで設問に答える。速読と要点把握が鍵。', '📚'],
            ['空欄補充', '文章の空欄に適切な語句を入れる。前後の流れを読む。', '✏️'],
            ['二語の関係', '2つの語の関係性を別の語の組み合わせに当てはめる。', '🔗'],
          ].map(([t, d, i]) => `
            <div class="exam-topic-item">
              <div style="font-size:1.4rem;margin-bottom:6px">${i}</div>
              <div style="font-size:0.82rem;font-weight:700;margin-bottom:4px">${t}</div>
              <div style="font-size:0.75rem;color:var(--text-sub);line-height:1.5">${d}</div>
            </div>
          `).join('')}
        </div>
        <div class="exam-tips-box" style="--tip-color:var(--accent2)">
          <div class="exam-tips-title">💡 言語対策のポイント</div>
          <ul class="exam-tips-list">
            <li>語彙問題は単語帳で毎日10語ずつ覚える習慣をつける</li>
            <li>慣用句・ことわざは頻出200語を優先的に覚える</li>
            <li>長文読解は「主張・根拠・結論」を意識しながら速読練習</li>
            <li>制限時間を意識した時間配分（1問30〜40秒が目安）</li>
          </ul>
        </div>
      </div>

      <!-- 非言語分野 -->
      <div class="exam-section-card">
        <div class="exam-section-header">
          <span class="exam-badge" style="background:rgba(72,207,173,0.15);color:var(--accent);border-color:rgba(72,207,173,0.3)">非言語分野</span>
          <span style="font-size:0.78rem;color:var(--text-sub)">数的処理・論理的推論</span>
        </div>
        <div class="exam-topic-grid">
          ${[
            ['推論', '与えられた条件から正しい結論を導く。じっくり条件を整理。', '🧠'],
            ['確率・場合の数', '樹形図・組み合わせCの計算。公式を確実に使えるように。', '🎲'],
            ['損益算', '原価・定価・売価・利益の関係。%の計算が速いと有利。', '💴'],
            ['速度算', '距離＝速度×時間。追いかけ・対向の問題パターンを把握。', '🚗'],
            ['集合', 'ベン図を使った集合の問題。図に書き起こすと解きやすい。', '⭕'],
            ['資料解釈', '表やグラフを読み取る。正確さよりも速さが重要。', '📊'],
          ].map(([t, d, i]) => `
            <div class="exam-topic-item">
              <div style="font-size:1.4rem;margin-bottom:6px">${i}</div>
              <div style="font-size:0.82rem;font-weight:700;margin-bottom:4px">${t}</div>
              <div style="font-size:0.75rem;color:var(--text-sub);line-height:1.5">${d}</div>
            </div>
          `).join('')}
        </div>
        <div class="exam-tips-box" style="--tip-color:var(--accent)">
          <div class="exam-tips-title">💡 非言語対策のポイント</div>
          <ul class="exam-tips-list">
            <li>計算は暗算・概算で素早く。選択肢から逆算するテクニックも有効</li>
            <li>苦手分野を特定してから集中的に練習（問題集1冊を繰り返す）</li>
            <li>頻出パターンを覚えると解答スピードが格段に上がる</li>
            <li>難しい問題は飛ばして確実に取れる問題を先に解く</li>
          </ul>
        </div>
      </div>

      <!-- 性格検査 -->
      <div class="exam-section-card">
        <div class="exam-section-header">
          <span class="exam-badge" style="background:rgba(247,183,49,0.15);color:var(--accent3);border-color:rgba(247,183,49,0.3)">性格検査</span>
          <span style="font-size:0.78rem;color:var(--text-sub)">職務適合性・組織適合性</span>
        </div>
        <p style="font-size:0.83rem;color:var(--text-sub);line-height:1.7;padding:0 4px">
          正解・不正解はなく、企業の求める人物像との適合度を測ります。
          「良く見せよう」とすると矛盾が出やすくなるため、自然体で回答するのが鉄則です。
        </p>
        <div class="exam-tips-box" style="--tip-color:var(--accent3);margin-top:14px">
          <div class="exam-tips-title">💡 性格検査のポイント</div>
          <ul class="exam-tips-list">
            <li>時間をかけすぎず直感で回答する（考えすぎると矛盾しやすい）</li>
            <li>同じような質問が繰り返されるが一貫した回答を心がける</li>
            <li>志望企業の社風・求める人物像を事前に調べておく</li>
            <li>「体調が悪い・集中できない日」は避け、万全の状態で受ける</li>
          </ul>
        </div>
      </div>

      <!-- 学習リソース -->
      <div class="exam-section-card">
        <div class="exam-section-header">
          <span class="exam-badge" style="background:rgba(252,92,101,0.12);color:var(--accent4);border-color:rgba(252,92,101,0.3)">📚 おすすめ学習リソース</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          ${[
            ['SPI3問題集（リクルート公式）', '公式問題集で本番形式に慣れる', 'https://www.recruit.co.jp/employment/aboutspi/', 'var(--accent2)'],
            ['SPIノートの会 - 問題集', '言語・非言語の頻出問題を網羅', 'https://www.spinote.jp/', 'var(--accent)'],
            ['就活の教科書 - SPI対策', 'テーマ別に分かりやすく解説', 'https://reashu.com/spi/', 'var(--accent3)'],
          ].map(([name, desc, url, c]) => `
            <a href="${url}" target="_blank" rel="noopener" class="exam-link-card" style="--lc:${c}">
              <div>
                <div style="font-size:0.83rem;font-weight:700;color:var(--text);margin-bottom:2px">${name}</div>
                <div style="font-size:0.75rem;color:var(--text-sub)">${desc}</div>
              </div>
              <span style="color:var(--text-sub);font-size:0.8rem">→</span>
            </a>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// ─────────────────────────────────────
// WebCAB 対策
// ─────────────────────────────────────

function renderWebCAB() {
  const wrap = document.getElementById('tab-webcab');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- 概要 -->
      <div class="exam-intro-card">
        <div class="exam-section-label" style="color:var(--accent3)">🌐 WebCAB とは</div>
        <p style="font-size:0.85rem;color:var(--text-sub);line-height:1.7;margin-top:8px">
          WebCAB（Web版キャビン）は、日本エス・エイチ・エル（SHL）が提供するWebテストです。
          IT系・コンサル系企業で多く採用されており、
          <strong style="color:var(--text)">スピードと正確さ</strong>が同時に問われる特徴的なテストです。
        </p>
        <div class="exam-tag-row" style="margin-top:12px">
          <span class="exam-tag" style="--tc:var(--accent3)">💻 受験形式: Web（自宅）</span>
          <span class="exam-tag" style="--tc:var(--accent2)">⏱️ 所要時間: 約50分</span>
          <span class="exam-tag" style="--tc:var(--accent4)">🏢 対象企業: IT・金融・コンサル系</span>
        </div>
      </div>

      <!-- 4分野 -->
      ${[
        {
          id: 'shisoku', icon: '🔢', label: '四則演算',
          color: 'var(--accent2)', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.25)',
          desc: '加減乗除の計算を制限時間内にできるだけ多く解く。正確さより<strong style="color:var(--text)">スピード</strong>が重要。',
          example: '例：152 ÷ 8 + 37 × 2 = ?',
          tips: ['暗算力を毎日鍛える（計算アプリを活用）', '9の段・12の段など九九の拡張を覚える', '解けない問題は即スキップして次へ進む', '制限時間ギリギリまで解き続ける'],
        },
        {
          id: 'housoku', icon: '🔄', label: '法則性',
          color: 'var(--accent)', bg: 'rgba(72,207,173,0.1)', border: 'rgba(72,207,173,0.25)',
          desc: '数列やパターンから法則を見つけ、次に来る値を答える問題。<strong style="color:var(--text)">差・比・交互</strong>のパターンを覚える。',
          example: '例：2, 6, 18, 54, [ ? ] → 162（×3の等比数列）',
          tips: ['等差数列・等比数列・フィボナッチ数列を把握', '差を取る・比を取る・奇偶で分けるの3手順を試す', '2段階の変化（差の差が一定）に注意', '練習で代表的パターン10種を体で覚える'],
        },
        {
          id: 'meirei', icon: '📋', label: '命令表',
          color: 'var(--accent3)', bg: 'rgba(247,183,49,0.1)', border: 'rgba(247,183,49,0.25)',
          desc: '記号や命令の変換表を使って、入力値から出力値を求める問題。<strong style="color:var(--text)">手順通りに正確に</strong>処理する力が問われる。',
          example: '例：命令 A→+2, B→×3 を順に適用すると 5 → A → B = ?',
          tips: ['表を素早く読み取る練習をする', '処理を紙にメモしながら解く（頭だけで解こうとしない）', '順序を間違えないよう矢印を意識する', 'プログラムの処理フローをイメージすると解きやすい'],
        },
        {
          id: 'ango', icon: '🔐', label: '暗号',
          color: 'var(--accent4)', bg: 'rgba(252,92,101,0.1)', border: 'rgba(252,92,101,0.25)',
          desc: '記号・図形と文字や数字の対応ルールを素早く見つける問題。<strong style="color:var(--text)">視覚的パターン認識</strong>が鍵。',
          example: '例：★=3, ▲=7, ●=1 のとき「★▲●」= ?',
          tips: ['対応表を素早く記憶・参照する練習', '解読に使う記号セットを素早くスキャンする', '規則性を1問目で把握してから一気に解く', '時間切れに備えて確実に取れる問題を先に処理する'],
        },
      ].map(s => `
        <div class="exam-section-card">
          <div class="exam-section-header">
            <span class="exam-badge" style="background:${s.bg};color:${s.color};border-color:${s.border}">
              ${s.icon} ${s.label}
            </span>
          </div>
          <p style="font-size:0.83rem;color:var(--text-sub);line-height:1.7;padding:2px 4px">${s.desc}</p>
          <div style="
            background:${s.bg};border:1px solid ${s.border};
            border-radius:10px;padding:12px 16px;margin:12px 0;
            font-size:0.82rem;font-family:monospace;color:${s.color};letter-spacing:0.5px
          ">${s.example}</div>
          <div class="exam-tips-box" style="--tip-color:${s.color}">
            <div class="exam-tips-title">💡 対策のポイント</div>
            <ul class="exam-tips-list">
              ${s.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('')}

      <!-- 共通戦略 -->
      <div class="exam-section-card" style="border-color:rgba(247,183,49,0.3)">
        <div class="exam-section-header">
          <span class="exam-badge" style="background:rgba(247,183,49,0.12);color:var(--accent3);border-color:rgba(247,183,49,0.3)">🎯 WebCAB 共通戦略</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
          ${[
            ['⏭️ スキップ戦略', '分からない問題に時間をかけず、即スキップして次へ。解ける問題を確実に稼ぐ。'],
            ['🔋 体調管理', '時間プレッシャーが強いため、体調万全の日に受験。集中力が直接スコアに影響。'],
            ['🏃 速度練習', '毎日5分の計算ドリルで処理スピードを鍛える。本番は「速さ優先」と割り切る。'],
            ['📸 パターン記憶', '法則性・暗号は見た瞬間に判断できるよう、典型パターンを反復練習で体に染み込ませる。'],
          ].map(([t, d]) => `
            <div style="display:flex;gap:12px;background:var(--surface2);border-radius:10px;padding:14px 16px">
              <span style="font-size:0.82rem;font-weight:700;color:var(--accent3);flex-shrink:0;min-width:100px">${t}</span>
              <span style="font-size:0.8rem;color:var(--text-sub);line-height:1.6">${d}</span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

// ─────────────────────────────────────
// 筆記試験 対策
// ─────────────────────────────────────

const ESSAY_TOPICS = [
  { cat: '自己分析', label: '自己PR', icon: '🌟', q: 'あなた自身の強みと、それを仕事でどう活かすか400字で述べなさい。' },
  { cat: '学生時代', label: 'ガクチカ', icon: '🎓', q: '学生時代に最も力を入れたことと、そこから得た学びを400字で述べなさい。' },
  { cat: '志望動機', label: '志望動機', icon: '🏢', q: 'IT業界を志望する理由と、入社後に実現したいことを400字で述べなさい。' },
  { cat: 'IT・テクノロジー', label: 'AIの社会的影響', icon: '🤖', q: 'AI技術が社会に与える影響について、メリット・デメリットを踏まえて400字で論じなさい。' },
  { cat: 'IT・テクノロジー', label: 'DXと日本企業', icon: '🔄', q: '日本企業のDX推進における課題と、その解決策について400字で述べなさい。' },
  { cat: 'IT・テクノロジー', label: 'IT人材不足', icon: '👨‍💻', q: '日本のIT人材不足の現状と、あなたが考える解決策を400字で論じなさい。' },
  { cat: 'ビジネス', label: '5年後のビジョン', icon: '🔭', q: '入社から5年後にどのようなエンジニア・ビジネスパーソンになっていたいか、400字で述べなさい。' },
  { cat: 'ビジネス', label: 'チームワーク', icon: '🤝', q: 'チームで困難な課題を乗り越えた経験と、そこで発揮したあなたの役割を400字で述べなさい。' },
  { cat: '社会問題', label: 'リモートワーク', icon: '🏠', q: 'リモートワークの普及が働き方・社会に与える影響について400字で論じなさい。' },
  { cat: '社会問題', label: 'サイバーセキュリティ', icon: '🔒', q: '企業がサイバーセキュリティに取り組む重要性と具体的対策について400字で論じなさい。' },
];

let currentTopic = null;
let essayExpertShown = false;

function renderKakiShiken() {
  const wrap = document.getElementById('tab-kakishiken');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- 概要 -->
      <div class="exam-intro-card">
        <div class="exam-section-label" style="color:var(--accent4)">✍️ 筆記試験対策とは</div>
        <p style="font-size:0.85rem;color:var(--text-sub);line-height:1.7;margin-top:8px">
          IT企業の選考では、論理的思考力・文章力・IT知識を問う筆記試験が出題されます。
          このシミュレーターでは<strong style="color:var(--text)">AIコーチが専門家として</strong>
          テーマを解説し、あなたの文章を採点・改善します。
        </p>
        <div class="exam-tag-row" style="margin-top:12px">
          <span class="exam-tag" style="--tc:var(--accent4)">📝 形式: 小論文 / 作文</span>
          <span class="exam-tag" style="--tc:var(--accent2)">⏱️ 目安: 400字 × 40〜60分</span>
          <span class="exam-tag" style="--tc:var(--accent)">🤖 AI専門家が採点・改善</span>
        </div>
      </div>

      <!-- トピック選択 -->
      <div class="exam-section-card">
        <div class="exam-section-header">
          <span class="exam-badge" style="background:rgba(252,92,101,0.12);color:var(--accent4);border-color:rgba(252,92,101,0.3)">
            🎯 テーマを選ぶ
          </span>
          <button onclick="pickRandomTopic()" style="
            margin-left:auto;background:linear-gradient(135deg,var(--accent4),#e04060);
            border:none;border-radius:8px;color:#fff;font-size:0.78rem;font-weight:700;
            padding:6px 14px;cursor:pointer;font-family:inherit;transition:opacity 0.2s
          " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            🎲 ランダム
          </button>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px" id="topic-list">
          ${ESSAY_TOPICS.map((t, i) => `
            <button onclick="selectTopic(${i})" class="topic-select-btn" id="topic-btn-${i}">
              <span style="font-size:1.1rem">${t.icon}</span>
              <div style="text-align:left">
                <div style="font-size:0.82rem;font-weight:700;color:var(--text)">${t.label}</div>
                <div style="font-size:0.72rem;color:var(--text-sub)">カテゴリー: ${t.cat}</div>
              </div>
              <span style="margin-left:auto;font-size:0.75rem;color:var(--text-sub)">選ぶ →</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 出題エリア（selectTopic後に表示） -->
      <div id="essay-area" style="display:none;flex-direction:column;gap:16px"></div>

    </div>
  `;
}

function selectTopic(index) {
  currentTopic = ESSAY_TOPICS[index];
  essayExpertShown = false;

  // Highlight selected button
  document.querySelectorAll('.topic-select-btn').forEach((btn, i) => {
    btn.style.borderColor = i === index ? 'var(--accent4)' : 'var(--border)';
    btn.style.background  = i === index ? 'rgba(252,92,101,0.08)' : 'var(--surface2)';
  });

  showEssayArea();
}

function pickRandomTopic() {
  const idx = Math.floor(Math.random() * ESSAY_TOPICS.length);
  selectTopic(idx);
  // Scroll to essay area
  setTimeout(() => {
    document.getElementById('essay-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function showEssayArea() {
  const area = document.getElementById('essay-area');
  if (!area || !currentTopic) return;

  area.style.display = 'flex';
  area.innerHTML = `

    <!-- Question card -->
    <div class="exam-section-card" style="border-color:rgba(252,92,101,0.3)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="font-size:1.6rem">${currentTopic.icon}</span>
        <div>
          <div style="font-size:0.65rem;font-weight:700;letter-spacing:1.5px;color:var(--accent4);text-transform:uppercase">テーマ</div>
          <div style="font-size:1rem;font-weight:800;margin-top:2px">${currentTopic.label}</div>
        </div>
        <button onclick="showExpertIntro()" id="btn-expert-intro" style="
          margin-left:auto;display:flex;align-items:center;gap:6px;
          background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.3);
          border-radius:8px;color:var(--accent2);font-size:0.78rem;font-weight:700;
          padding:7px 14px;cursor:pointer;font-family:inherit;transition:all 0.2s
        " onmouseover="this.style.background='rgba(108,99,255,0.2)'" onmouseout="this.style.background='rgba(108,99,255,0.1)'">
          🎓 専門家に解説を聞く
        </button>
      </div>
      <div style="
        font-size:0.88rem;font-weight:600;line-height:1.8;
        background:var(--surface2);border-radius:10px;padding:14px 16px;
        border-left:3px solid var(--accent4);color:var(--text)
      ">${currentTopic.q}</div>
    </div>

    <!-- Expert intro area -->
    <div id="expert-intro-area"></div>

    <!-- Write area -->
    <div class="exam-section-card">
      <div class="exam-section-header">
        <span class="exam-badge" style="background:rgba(72,207,173,0.12);color:var(--accent);border-color:rgba(72,207,173,0.3)">
          ✍️ 回答を書く
        </span>
        <span id="essay-char-count" style="margin-left:auto;font-size:0.75rem;color:var(--text-sub)">0文字</span>
      </div>
      <textarea id="essay-input" style="
        width:100%;min-height:220px;
        background:var(--surface2);border:1px solid var(--border);border-radius:10px;
        color:var(--text);font-size:0.85rem;font-family:inherit;
        padding:14px 16px;line-height:1.8;resize:vertical;outline:none;
        transition:border-color 0.2s;margin-top:12px
      "
        placeholder="ここに回答を書いてください（目安：400字前後）"
        oninput="updateEssayCount()"
        onfocus="this.style.borderColor='var(--accent)'"
        onblur="this.style.borderColor='var(--border)'"
      ></textarea>
      <div style="display:flex;justify-content:flex-end;margin-top:12px">
        <button onclick="evaluateEssay()" id="btn-eval-essay" style="
          display:flex;align-items:center;gap:8px;
          background:linear-gradient(135deg,var(--accent2),var(--accent));
          border:none;border-radius:10px;color:#fff;
          font-size:0.88rem;font-weight:700;padding:11px 24px;
          cursor:pointer;font-family:inherit;transition:opacity 0.2s
        " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
          🎓 AIコーチに採点してもらう
        </button>
      </div>
    </div>

    <!-- Feedback area -->
    <div id="essay-feedback-area"></div>

  `;
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateEssayCount() {
  const val = document.getElementById('essay-input')?.value || '';
  const el  = document.getElementById('essay-char-count');
  if (el) {
    el.textContent = `${val.length}文字`;
    el.style.color = val.length >= 350 ? 'var(--accent)' : 'var(--text-sub)';
  }
}

async function showExpertIntro() {
  if (essayExpertShown) {
    document.getElementById('expert-intro-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const introArea = document.getElementById('expert-intro-area');
  const btn = document.getElementById('btn-expert-intro');
  if (!introArea || !currentTopic) return;

  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px"></div> 解説中...';

  introArea.innerHTML = `
    <div class="expert-bubble">
      <div class="expert-avatar">🎓</div>
      <div class="expert-body">
        <div class="expert-name">AIコーチ（専門家）</div>
        <div class="fb-loading"><div class="spinner"></div><span>テーマを解説中...</span></div>
      </div>
    </div>`;

  const prompt = `あなたは就職活動の作文・小論文指導の専門家コーチです。
IT系企業の就活生に向けて、以下のテーマについて解説してください。

テーマ：「${currentTopic.label}」
出題文：${currentTopic.q}

以下の3ブロックを必ず出力してください：

[テーマ解説]
このテーマで企業が見たいポイントと、背景にある意図を2〜3文で分かりやすく説明してください。

[評価されるポイント]
採点官が高く評価する回答の特徴を3〜4点、箇条書きで具体的に挙げてください。

[構成のコツ]
400字の小論文・作文を書く際の構成テンプレート（序論・本論・結論の内容）を具体的に示してください。`.trim();

  try {
    const text = await geminiExam(prompt, 1500);
    essayExpertShown = true;

    const blocks = {};
    const regex  = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
    let m;
    while ((m = regex.exec(text)) !== null) blocks[m[1].trim()] = m[2].trim();

    function toList(t) {
      return (t || '').split('\n').filter(l => l.trim())
        .map(l => l.replace(/^[-・\d.]\s*/, ''))
        .filter(l => l)
        .map(l => `<div style="display:flex;gap:8px;margin-bottom:5px"><span style="flex-shrink:0;color:var(--accent2)">▸</span><span>${l}</span></div>`)
        .join('');
    }

    introArea.innerHTML = `
      <div class="expert-bubble">
        <div class="expert-avatar">🎓</div>
        <div class="expert-body">
          <div class="expert-name">AIコーチ（専門家）</div>
          <div style="font-size:0.83rem;line-height:1.7;display:flex;flex-direction:column;gap:14px">
            ${blocks['テーマ解説'] ? `
              <div>
                <div style="font-size:0.7rem;font-weight:700;color:var(--accent2);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">📌 テーマ解説</div>
                <p style="color:var(--text-sub)">${blocks['テーマ解説']}</p>
              </div>` : ''}
            ${blocks['評価されるポイント'] ? `
              <div>
                <div style="font-size:0.7rem;font-weight:700;color:var(--accent);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">✅ 評価されるポイント</div>
                <div style="color:var(--text-sub)">${toList(blocks['評価されるポイント'])}</div>
              </div>` : ''}
            ${blocks['構成のコツ'] ? `
              <div>
                <div style="font-size:0.7rem;font-weight:700;color:var(--accent3);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">📐 構成のコツ</div>
                <div style="background:var(--surface2);border-radius:8px;padding:12px 14px;color:var(--text-sub);white-space:pre-line;font-size:0.8rem">${blocks['構成のコツ']}</div>
              </div>` : ''}
          </div>
        </div>
      </div>`;

    btn.disabled = false;
    btn.innerHTML = '🎓 専門家の解説を見る';

  } catch (e) {
    introArea.innerHTML = `
      <div style="color:var(--accent4);padding:14px;background:rgba(252,92,101,0.08);border-radius:10px;font-size:0.83rem">
        ⚠️ 解説の取得に失敗しました。
        <button onclick="showExpertIntro()" style="margin-left:10px;background:var(--accent4);border:none;border-radius:6px;color:#fff;padding:4px 12px;cursor:pointer;font-family:inherit;font-size:0.78rem">再試行</button>
      </div>`;
    btn.disabled = false;
    btn.innerHTML = '🎓 専門家に解説を聞く';
  }
}

async function evaluateEssay() {
  const essay = document.getElementById('essay-input')?.value.trim();
  if (!essay || essay.length < 50) {
    alert('50文字以上の回答を入力してください。');
    return;
  }
  if (!currentTopic) return;

  const btn = document.getElementById('btn-eval-essay');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div> 採点中...';

  const fbArea = document.getElementById('essay-feedback-area');
  fbArea.innerHTML = `
    <div class="feedback-card">
      <div class="fb-loading"><div class="spinner"></div><span>AIコーチが回答を採点中...</span></div>
    </div>`;

  const prompt = `あなたは就職活動の作文・小論文指導の専門家コーチです。
以下の就活生の回答を、厳しくも丁寧に採点・指導してください。

テーマ：「${currentTopic.label}」
出題：${currentTopic.q}

【就活生の回答（${essay.length}字）】
${essay}

以下の4ブロックを必ず全て出力してください：

[総合評価]
10点満点で次の3軸を採点：
- 構成・論理性：X/10
- 内容・具体性：X/10
- 表現・日本語力：X/10
全体への一言コメント（2〜3文）。

[良かった点]
具体的に評価できる箇所を2〜3点、引用しながら指摘してください。

[改善ポイント]
より良い文章にするための具体的な改善点を3〜4点、詳しく説明してください。

[改善版サンプル]
同じテーマで、評価ポイントを全て満たした模範的な回答例を400字前後で書いてください。構成・表現・内容全て改善した完成版を出力してください。`.trim();

  try {
    const text = await geminiExam(prompt, 2500);

    const blocks = {};
    const regex  = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
    let m;
    while ((m = regex.exec(text)) !== null) blocks[m[1].trim()] = m[2].trim();

    const totalText = blocks['総合評価'] || '';
    function extractS(label) {
      const match = totalText.match(new RegExp(label + '[：:]*\\s*(\\d+)/10'));
      return match ? parseInt(match[1]) : null;
    }
    const s1 = extractS('構成・論理性');
    const s2 = extractS('内容・具体性');
    const s3 = extractS('表現・日本語力');

    function sc(s) {
      if (s === null) return 'var(--text-sub)';
      return s >= 8 ? '#48cfad' : s >= 6 ? '#f7b731' : '#fc5c65';
    }
    function bar(s) {
      return s !== null
        ? `<div class="score-bar"><div class="score-bar-fill" style="width:${s*10}%;background:${sc(s)}"></div></div>`
        : '';
    }

    const comment = totalText
      .replace(/[-・]?\s*構成・論理性[：:][^\n]*/g, '')
      .replace(/[-・]?\s*内容・具体性[：:][^\n]*/g, '')
      .replace(/[-・]?\s*表現・日本語力[：:][^\n]*/g, '')
      .trim();

    function toList(t) {
      if (!t) return '<p style="color:var(--text-sub)">—</p>';
      return t.split('\n').filter(l => l.trim())
        .map(l => l.replace(/^[-・\d.]\s*/, ''))
        .filter(l => l)
        .map(l => `<div style="display:flex;gap:8px;margin-bottom:6px"><span style="flex-shrink:0">▸</span><span>${l}</span></div>`)
        .join('');
    }

    fbArea.innerHTML = `
      <div class="feedback-card">
        <div class="feedback-header">
          <span>🎓 AIコーチの採点</span>
          <span class="ai-badge">Gemini AI</span>
        </div>

        <!-- Scores -->
        <div class="feedback-score-row">
          <div class="score-item">
            <div class="score-label">構成・論理性</div>
            <div class="score-value" style="color:${sc(s1)}">${s1 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
            ${bar(s1)}
          </div>
          <div class="score-item">
            <div class="score-label">内容・具体性</div>
            <div class="score-value" style="color:${sc(s2)}">${s2 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
            ${bar(s2)}
          </div>
          <div class="score-item">
            <div class="score-label">表現・日本語</div>
            <div class="score-value" style="color:${sc(s3)}">${s3 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
            ${bar(s3)}
          </div>
        </div>

        <div class="feedback-body">
          ${comment ? `
            <div class="expert-bubble" style="margin-bottom:4px">
              <div class="expert-avatar">🎓</div>
              <div class="expert-body">
                <div class="expert-name">AIコーチのコメント</div>
                <p style="font-size:0.83rem;color:var(--text-sub);line-height:1.7">${comment}</p>
              </div>
            </div>` : ''}
          <div class="fb-block">
            <div class="fb-block-header" style="color:#48cfad">✅ <span>良かった点</span></div>
            <div class="fb-block-body">${toList(blocks['良かった点'])}</div>
          </div>
          <div class="fb-block">
            <div class="fb-block-header" style="color:#fc5c65">🔧 <span>改善ポイント</span></div>
            <div class="fb-block-body">${toList(blocks['改善ポイント'])}</div>
          </div>
          ${blocks['改善版サンプル'] ? `
            <div class="fb-block">
              <div class="fb-block-header" style="color:#6c63ff">✨ <span>改善版サンプル（模範回答）</span></div>
              <div class="fb-block-body">
                <div class="improved-text" style="white-space:pre-line">${blocks['改善版サンプル']}</div>
              </div>
            </div>` : ''}
        </div>

        <!-- Try again -->
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
          <button onclick="document.getElementById('essay-input').value='';document.getElementById('essay-feedback-area').innerHTML='';document.getElementById('essay-char-count').textContent='0文字'" style="
            background:var(--surface2);border:1px solid var(--border);border-radius:8px;
            color:var(--text-sub);font-size:0.8rem;padding:8px 16px;cursor:pointer;font-family:inherit
          ">🔄 書き直す</button>
          <button onclick="pickRandomTopic()" style="
            background:linear-gradient(135deg,var(--accent4),#e04060);border:none;border-radius:8px;
            color:#fff;font-size:0.8rem;font-weight:700;padding:8px 16px;cursor:pointer;font-family:inherit
          ">🎲 別のテーマに挑戦</button>
        </div>
      </div>`;

    fbArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (e) {
    const msg = e.message === 'RATE_LIMIT'
      ? 'リクエストが集中しています。少し待ってから再試行してください。'
      : e.message === 'SERVER_ERROR'
      ? 'AIサーバーが混雑しています。しばらく待ってから再試行してください。'
      : e.message;
    fbArea.innerHTML = `
      <div style="color:var(--accent4);padding:16px;background:rgba(252,92,101,0.08);border-radius:12px;display:flex;align-items:center;gap:12px;font-size:0.83rem">
        <span>⚠️ ${msg}</span>
        <button onclick="evaluateEssay()" style="background:var(--accent4);border:none;border-radius:8px;color:#fff;font-size:0.78rem;padding:6px 14px;cursor:pointer;font-family:inherit;flex-shrink:0">再試行</button>
      </div>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🎓 AIコーチに採点してもらう';
  }
}

// ─────────────────────────────────────
// Expose to window
// ─────────────────────────────────────

window.renderSPI         = renderSPI;
window.renderWebCAB      = renderWebCAB;
window.renderKakiShiken  = renderKakiShiken;
window.selectTopic       = selectTopic;
window.pickRandomTopic   = pickRandomTopic;
window.showExpertIntro   = showExpertIntro;
window.evaluateEssay     = evaluateEssay;
window.updateEssayCount  = updateEssayCount;
