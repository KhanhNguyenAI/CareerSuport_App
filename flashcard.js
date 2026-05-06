// ─────────────────────────────────────
// flashcard.js — IT用語フラッシュカード
// 4資格 × 15枚 = 60枚
// ─────────────────────────────────────

const FC_DECKS = {
  'ai-passport': {
    name: '生成AIパスポート', icon: '🤖', color: '#6c63ff',
    cards: [
      { term: '生成AI', reading: 'せいせいAI', def: 'テキスト・画像・音声などの新しいコンテンツを自動生成するAI技術。GPTやStable Diffusionが代表例。' },
      { term: 'LLM', reading: '大規模言語モデル', def: '大量のテキストデータで学習した言語モデル。GPT・Gemini・Claudeなどが該当。文章生成・翻訳・要約が得意。' },
      { term: 'プロンプト', reading: 'ぷろんぷと', def: 'AIへの指示文・入力テキスト。書き方によってAIの出力品質が大きく変わる。' },
      { term: 'ハルシネーション', reading: 'はるしねーしょん', def: 'AIが事実に基づかない情報を自信満々に回答する現象。幻覚とも呼ばれ、重要な問題の一つ。' },
      { term: 'RAG', reading: '検索拡張生成', def: '外部データベースをリアルタイムで参照してAIの回答精度を高める手法。最新情報に対応可能になる。' },
      { term: 'ファインチューニング', reading: 'ふぁいんちゅーにんぐ', def: '学習済みモデルを特定のタスクや業務向けに追加学習させること。精度向上・コスト削減に有効。' },
      { term: 'トークン', reading: 'とーくん', def: 'AIが処理するテキストの最小単位。日本語は1文字≒1〜2トークン。APIの料金計算に使われる。' },
      { term: 'マルチモーダルAI', reading: 'まるちもーだるAI', def: 'テキスト・画像・音声・動画など複数の形式を統合的に扱えるAI。GPT-4oやGeminiが対応。' },
      { term: 'ゼロショット学習', reading: 'ぜろしょっとがくしゅう', def: '未学習のタスクをプロンプトだけで解かせること。サンプル例を提示するのはフューショット学習。' },
      { term: 'プロンプトインジェクション', reading: 'ぷろんぷといんじぇくしょん', def: '悪意ある指示をプロンプトに混入させてAIの動作を乗っ取る攻撃手法。セキュリティ上の脅威。' },
      { term: 'AI倫理・ガバナンス', reading: 'AIりんり・がばなんす', def: 'AIの公平性・透明性・説明責任・プライバシー保護に関する考え方や規制の枠組み。' },
      { term: 'AIバイアス', reading: 'AIばいあす', def: 'AIの学習データに含まれる偏りが原因で、特定グループへの差別的な結果が出ること。' },
      { term: 'ディープフェイク', reading: 'でぃーぷふぇいく', def: 'AIで作成された偽の動画・音声・画像。なりすましや詐欺に悪用されるリスクがある。' },
      { term: '転移学習', reading: 'てんいがくしゅう', def: '別のタスクで学習済みのモデルを、新しいタスクに流用する機械学習手法。少ないデータでも高精度。' },
      { term: '著作権とAI', reading: 'ちょさくけんとAI', def: 'AI生成コンテンツの著作権は原則AIには認められない。学習データの著作権侵害リスクも課題。' },
    ]
  },
  'it-passport': {
    name: 'ITパスポート', icon: '💻', color: '#48cfad',
    cards: [
      { term: 'クラウドコンピューティング', reading: 'くらうどこんぴゅーてぃんぐ', def: 'インターネット経由でサーバ・ストレージ・ソフトウェアなどITリソースを提供するサービス形態。' },
      { term: 'IoT', reading: 'アイオーティー', def: 'Internet of Things。物理的なモノをインターネットに接続して相互通信させる技術。家電・センサーなど。' },
      { term: 'ビッグデータ', reading: 'びっぐでーた', def: '従来のシステムでは処理困難な、大容量・多種類・高速生成のデータ群。3VはVolume/Variety/Velocity。' },
      { term: 'フィッシング詐欺', reading: 'ふぃっしんぐさぎ', def: '本物に見せかけた偽サイト・偽メールで個人情報やパスワードを騙し取るサイバー攻撃。' },
      { term: 'ランサムウェア', reading: 'らんさむうぇあ', def: 'ファイルを暗号化して身代金（ransom）を要求するマルウェア。バックアップが対策の基本。' },
      { term: 'TCP/IP', reading: 'てぃーしーぴー/あいぴー', def: 'インターネットの基本通信プロトコルの組合せ。TCPが信頼性、IPがアドレス指定を担当する。' },
      { term: 'DNS', reading: 'どめいんねーむしすてむ', def: 'ドメイン名（例：google.com）とIPアドレスを相互変換するシステム。インターネットの「電話帳」。' },
      { term: 'HTTPS', reading: 'えいちてぃーてぃーぴーえす', def: 'HTTP通信をSSL/TLSで暗号化したプロトコル。URLの鍵マークが目印。個人情報送信時は必須。' },
      { term: 'データベース', reading: 'でーたべーす', def: '大量のデータを効率よく管理・検索するシステム。RDB（リレーショナルDB）が代表的。' },
      { term: 'SQL', reading: 'えすきゅーえる', def: 'リレーショナルデータベースを操作する言語。SELECT（取得）・INSERT（追加）・UPDATE・DELETEが基本4命令。' },
      { term: 'SaaS / PaaS / IaaS', reading: 'さーす/ぱーす/いあーす', def: 'クラウドサービスの提供形態。SaaS=ソフト提供、PaaS=開発基盤、IaaS=インフラ提供。' },
      { term: 'アジャイル開発', reading: 'あじゃいるかいはつ', def: '短い開発サイクル（スプリント）を繰り返してソフトウェアをリリースし続ける開発手法。変化に強い。' },
      { term: '個人情報保護法', reading: 'こじんじょうほうほごほう', def: '個人情報の適切な取扱いを定めた日本の法律。2022年改正で罰則強化・提供規制が拡大された。' },
      { term: 'リスクマネジメント', reading: 'りすくまねじめんと', def: 'リスクの特定→分析→評価→対応のサイクルで組織のリスクを管理するプロセス。ISO 31000が国際標準。' },
      { term: 'ストラテジ・マネジメント・テクノロジ', reading: 'さんぶんや', def: 'ITパスポートの3分野。ストラテジ系（経営）・マネジメント系（管理）・テクノロジ系（技術）。' },
    ]
  },
  'fe': {
    name: '基本情報技術者', icon: '⚙️', color: '#f7b731',
    cards: [
      { term: '2進数・16進数', reading: 'にしんすう・じゅうろくしんすう', def: '2進数は0と1で表現。16進数は0〜F（0〜15）で表現。コンピュータ内部は全て2進数で処理される。' },
      { term: 'スタック（LIFO）', reading: 'すたっく', def: '後入れ先出し（Last In First Out）のデータ構造。PUSHで追加、POPで取り出す。関数呼び出しに使用。' },
      { term: 'キュー（FIFO）', reading: 'きゅー', def: '先入れ先出し（First In First Out）のデータ構造。ENQUEUEで追加、DEQUEUEで取り出す。印刷待ちなど。' },
      { term: '二分探索', reading: 'にぶんたんさく', def: 'ソート済みデータを半分に絞り込んで検索するアルゴリズム。計算量O(log n)で高速。' },
      { term: 'OSI参照モデル', reading: 'OSIさんしょうもでる', def: 'ネットワーク通信を7層に分けたモデル。物理→データリンク→ネットワーク→トランスポート→セション→プレゼン→アプリ。' },
      { term: 'IPアドレス・サブネットマスク', reading: 'あいぴーあどれす', def: 'IPアドレス：ネット上の機器を識別する番号。サブネットマスク：ネットワーク部とホスト部の境界を示す値。' },
      { term: 'プロセスとスレッド', reading: 'ぷろせすとすれっど', def: 'プロセス＝OS上で実行中のプログラム。スレッド＝プロセス内の並行処理単位。スレッドの方が軽量。' },
      { term: 'デッドロック', reading: 'でっどろっく', def: '複数のプロセスが互いに相手のリソース解放を待ち合い、永久に停止する状態。予防が重要。' },
      { term: 'データベース正規化', reading: 'でーたべーすせいきか', def: 'データの重複・更新異常をなくすための設計手法。第1〜第3正規化までが基本。' },
      { term: 'ACID特性', reading: 'あしっどとくせい', def: 'トランザクションの4特性。A=原子性・C=一貫性・I=独立性・D=永続性。DBの信頼性を保証する。' },
      { term: 'オブジェクト指向', reading: 'おぶじぇくとしこう', def: 'データと処理をオブジェクトとして定義するプログラミング概念。継承・カプセル化・ポリモーフィズムが3大原則。' },
      { term: '計算量・O記法', reading: 'けいさんりょう・おーきほう', def: 'アルゴリズムの効率を表す記法。O(1)は定数時間、O(n)は線形、O(n²)は二乗に比例して増加する。' },
      { term: 'キャッシュメモリ', reading: 'きゃっしゅめもり', def: 'CPUとメインメモリの速度差を埋める高速な中間メモリ。L1/L2/L3キャッシュの階層がある。' },
      { term: '割り込み処理', reading: 'わりこみしょり', def: 'CPU実行中に外部イベント（I/O完了・タイマー等）でOSに制御を移す仕組み。ハード/ソフト割り込みがある。' },
      { term: '排他制御', reading: 'はいたせいぎょ', def: '複数のプロセスが同一リソースに同時アクセスしないようにする制御。セマフォ・ミューテックスが代表手法。' },
    ]
  },
  'ap': {
    name: '応用情報技術者', icon: '🚀', color: '#fc5c65',
    cards: [
      { term: 'RASIS', reading: 'らしす', def: 'システム信頼性の5指標。R=信頼性・A=可用性・S=保守性・I=保全性・S=安全性。稼働率はAvailabilityで計算。' },
      { term: 'RAID', reading: 'れいど', def: '複数HDDを組み合わせてデータ保護/性能向上する技術。RAID0=ストライピング・RAID1=ミラーリング・RAID5が主要。' },
      { term: 'RTO・RPO', reading: 'あーるてぃーおー・あーるぴーおー', def: 'RTO＝障害後のシステム回復目標時間。RPO＝障害時に許容できるデータ損失の最大時間。BCP策定に重要。' },
      { term: 'SLA・SLO・SLI', reading: 'えすえるえー', def: 'SLA＝サービス品質合意書・SLO＝目標値（99.9%など）・SLI＝実測値。Google SREの概念として普及。' },
      { term: 'ロードバランサ', reading: 'ろーどばらんさ', def: '複数のサーバに処理を分散させる装置。スケールアウト・高可用性の実現に不可欠。L4/L7レイヤで動作。' },
      { term: '公開鍵暗号・PKI', reading: 'こうかいかぎあんごう', def: '暗号化と復号で異なる鍵ペアを使用。PKI（公開鍵基盤）は認証局（CA）が証明書を発行する仕組み。' },
      { term: 'デジタル署名', reading: 'でじたるしょめい', def: '送信者が秘密鍵で署名→受信者が公開鍵で検証。改ざん検知と本人確認を同時に実現する技術。' },
      { term: 'ISMS', reading: 'いすむす', def: '情報セキュリティマネジメントシステム。ISO/IEC 27001が国際標準。PDCAで継続的にセキュリティを管理。' },
      { term: 'DMZ', reading: 'でぃーえむぜっと', def: 'インターネットと内部ネットワーク間に設ける非武装地帯。WebサーバはDMZに置き内部LANを守る。' },
      { term: 'ゼロトラストセキュリティ', reading: 'ぜろとらすとせきゅりてぃ', def: '「信頼しない・常に検証する」思想に基づくセキュリティモデル。境界防御から脱却し全アクセスを認証。' },
      { term: 'DevOps・CI/CD', reading: 'でぶおぷす', def: 'DevOps＝開発と運用を統合する考え方。CI/CD＝コード変更を自動テスト・ビルド・デプロイするパイプライン。' },
      { term: 'マイクロサービス', reading: 'まいくろさーびす', def: '機能を独立した小さなサービスに分割し、APIで連携する設計手法。モノリスと対比される。スケールしやすい。' },
      { term: 'クリティカルパス', reading: 'くりてぃかるぱす', def: 'プロジェクト全体の完了に影響する最長の作業経路。ここが遅延するとプロジェクト全体が遅れる。' },
      { term: 'キャパシティプランニング', reading: 'きゃぱしてぃぷらんにんぐ', def: '将来の需要予測に基づきシステムのCPU・メモリ・帯域幅などの容量を事前に計画すること。' },
      { term: 'ガントチャート', reading: 'がんとちゃーと', def: 'プロジェクトのスケジュールを横棒グラフで表現した図。タスクの期間・依存関係・進捗を可視化する。' },
    ]
  }
};

// ── Custom deck ──
const FC_CUSTOM_KEY  = 'fc_custom_cards';
const FC_CUSTOM_DECK = { name: 'カスタム', icon: '✏️', color: '#e879f9' };

function fcLoadCustom() {
  try {
    return JSON.parse(localStorage.getItem(FC_CUSTOM_KEY) || '[]');
  } catch { return []; }
}
function fcSaveCustom(cards) {
  localStorage.setItem(FC_CUSTOM_KEY, JSON.stringify(cards));
}

window.fcAddCustomCard = function (term, def, groupId) {
  const cards = fcLoadCustom();
  const idx = cards.findIndex(c => c.term === term);
  if (idx !== -1) {
    cards[idx].def = def;
    if (groupId !== undefined) cards[idx].groupId = groupId || '';
  } else {
    cards.push({ term, def, groupId: groupId || '', addedAt: new Date().toISOString() });
  }
  fcSaveCustom(cards);
  // Refresh count badge if deck selector is visible
  const btn = document.getElementById('fc-deck-custom');
  if (btn) { const s = btn.querySelector('span'); if (s) s.textContent = fcLoadCustom().length + '枚'; }
};

// ── State ──
let fcDeckKey  = 'custom';
let fcCards    = [];
let fcIndex    = 0;
let fcFlipped  = false;
let fcKnew     = 0;
let fcDidntKnow = 0;

// ── Init ──
window.initFlashcard = function () {
  renderFCPage();
};

function renderFCPage() {
  const wrap = document.getElementById('cert-tab-flash');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">
      <!-- Card area -->
      <div id="fc-card-area"></div>

      <!-- Stats bar -->
      <div id="fc-stats" style="display:none;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <span style="font-size:0.78rem;color:var(--text-sub)">セッション結果：</span>
        <span style="font-size:0.85rem;font-weight:700;color:#48cfad">✅ 知ってる：<span id="fc-knew-count">0</span></span>
        <span style="font-size:0.85rem;font-weight:700;color:#fc5c65">❌ 知らない：<span id="fc-dontknow-count">0</span></span>
        <button onclick="fcRestart()" style="margin-left:auto;font-size:0.78rem;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text-sub);padding:6px 14px;cursor:pointer;font-family:inherit">🔄 もう一度</button>
      </div>
    </div>
  `;

  renderFCCustom();
}

window.fcSelectDeck = function (key, resetProgress = true) {
  fcDeckKey = 'custom';
  fcCards = [...fcLoadCustom()].sort(() => Math.random() - 0.5);
  if (resetProgress) { fcIndex = 0; fcKnew = 0; fcDidntKnow = 0; }
  fcFlipped = false;
  renderFCCustom();
};

window.fcRestart = function () {
  fcIndex = 0; fcKnew = 0; fcDidntKnow = 0; fcFlipped = false;
  fcCards = [...fcGetActiveCards()].sort(() => Math.random() - 0.5);
  const statsBar = document.getElementById('fc-stats');
  if (statsBar) statsBar.style.display = 'none';
  renderFCCard();
};

function renderFCCard() {
  const area  = document.getElementById('fc-card-area');
  const statsBar = document.getElementById('fc-stats');
  if (!area) return;

  if (fcIndex >= fcCards.length) {
    // Completed!
    const total = fcCards.length;
    const pct   = Math.round((fcKnew / total) * 100);
    area.innerHTML = `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:40px 24px;text-align:center;animation:fadeUp 0.3s ease">
        <div style="font-size:3rem;margin-bottom:12px">${pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
        <div style="font-size:1.2rem;font-weight:800;margin-bottom:8px">完了！</div>
        <div style="font-size:0.85rem;color:var(--text-sub);margin-bottom:20px">
          ${total}枚中 <strong style="color:#48cfad">${fcKnew}枚</strong> を知っていました（${pct}%）
        </div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button onclick="fcRestart()" style="background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:10px;color:#fff;font-size:0.88rem;font-weight:700;padding:11px 24px;cursor:pointer;font-family:inherit">
            🔄 シャッフルしてもう一度
          </button>
          <button onclick="fcShowOnly('dontknow')" style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:0.88rem;font-weight:600;padding:11px 24px;cursor:pointer;font-family:inherit">
            ❌ 知らない単語だけ
          </button>
          ${fcDeckKey === 'custom' ? `
          <button onclick="renderFCCustom()" style="background:var(--surface2);border:1px solid #e879f9;border-radius:10px;color:#e879f9;font-size:0.88rem;font-weight:600;padding:11px 24px;cursor:pointer;font-family:inherit">
            📋 カードを管理
          </button>` : ''}
        </div>
      </div>`;
    if (statsBar) {
      statsBar.style.display = 'flex';
      document.getElementById('fc-knew-count').textContent    = fcKnew;
      document.getElementById('fc-dontknow-count').textContent = fcDidntKnow;
    }
    return;
  }

  const card  = fcCards[fcIndex];
  const deck  = FC_DECKS[fcDeckKey] || FC_CUSTOM_DECK;
  const total = fcCards.length;

  area.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">

      <!-- Progress -->
      <div style="display:flex;align-items:center;gap:10px">
        <div style="flex:1;height:5px;background:var(--border);border-radius:5px;overflow:hidden">
          <div style="height:100%;width:${(fcIndex/total)*100}%;background:${deck.color};border-radius:5px;transition:width 0.3s"></div>
        </div>
        <span style="font-size:0.72rem;color:var(--text-sub);flex-shrink:0">${fcIndex+1} / ${total}</span>
        <span style="font-size:0.72rem;font-weight:700;color:#48cfad">✅ ${fcKnew}</span>
        <span style="font-size:0.72rem;font-weight:700;color:#fc5c65">❌ ${fcDidntKnow}</span>
      </div>

      <!-- Flash card (click to flip) -->
      <div class="fc-card-wrap" onclick="fcFlip()">
        <div class="fc-card ${fcFlipped ? 'fc-card-flipped' : ''}" id="fc-main-card">

          <!-- Front: term -->
          <div class="fc-card-front" style="--dc:${deck.color}">
            <div class="fc-card-deck-label">${deck.icon} ${deck.name}</div>
            <div class="fc-term">${card.term}</div>
            <div class="fc-reading">${card.reading || ''}</div>
            <div class="fc-flip-hint">タップして答えを見る 👆</div>
          </div>

          <!-- Back: definition -->
          <div class="fc-card-back" style="--dc:${deck.color}">
            <div class="fc-card-deck-label">${deck.icon} ${deck.name}</div>
            <div class="fc-term" style="font-size:1.1rem;margin-bottom:10px">${card.term}</div>
            <div class="fc-def">${card.def}</div>
          </div>
        </div>
      </div>

      <!-- Action buttons (shown after flip) -->
      <div id="fc-action-btns" style="display:${fcFlipped ? 'flex' : 'none'};gap:12px">
        <button onclick="fcAnswer(false)" class="fc-btn-dontknow">
          ❌ 知らない
        </button>
        <button onclick="fcAnswer(true)" class="fc-btn-knew">
          ✅ 知ってる！
        </button>
      </div>

      <!-- Skip without answering -->
      <div style="text-align:center">
        <button onclick="fcSkip()" style="font-size:0.72rem;background:transparent;border:none;color:var(--text-sub);cursor:pointer;font-family:inherit;opacity:0.6;padding:4px 8px" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">
          → スキップ
        </button>
      </div>

    </div>
  `;
}

window.fcFlip = function () {
  fcFlipped = !fcFlipped;
  const card = document.getElementById('fc-main-card');
  const btns = document.getElementById('fc-action-btns');
  if (card) card.classList.toggle('fc-card-flipped', fcFlipped);
  if (btns) btns.style.display = fcFlipped ? 'flex' : 'none';
};

window.fcAnswer = function (knew) {
  if (knew) fcKnew++; else fcDidntKnow++;
  fcIndex++;
  fcFlipped = false;
  renderFCCard();
};

window.fcSkip = function () {
  fcIndex++;
  fcFlipped = false;
  renderFCCard();
};

window.fcShowOnly = function (filter) {
  // Re-run with only "don't know" cards (stored in session)
  // Simple: just restart with current cards
  fcRestart();
};

// ── Groups storage ──
const FC_GROUPS_KEY = 'fc_groups';
const FC_GRP_COLORS = ['#6c63ff','#48cfad','#f7b731','#fc5c65','#4a90d9','#e879f9'];

function fcLoadGroups() {
  try { return JSON.parse(localStorage.getItem(FC_GROUPS_KEY) || '[]'); } catch { return []; }
}
function fcSaveGroups(g) { localStorage.setItem(FC_GROUPS_KEY, JSON.stringify(g)); }

// ── Custom deck management ──

let fcEditingTerm  = null;     // term currently being edited
let fcAddFormOpen  = false;    // add-card form open?
let fcCurrentGroup = 'all';   // 'all' or group id
let fcNewGroupOpen = false;    // new-group inline input open?
let fcNewGroupColor = '#6c63ff';

// Cards filtered by current group
function fcGetActiveCards() {
  const all = fcLoadCustom();
  return fcCurrentGroup === 'all' ? all : all.filter(c => c.groupId === fcCurrentGroup);
}

function renderFCCustom() {
  const area     = document.getElementById('fc-card-area');
  const statsBar = document.getElementById('fc-stats');
  if (!area) return;
  if (statsBar) statsBar.style.display = 'none';

  const allCards = fcLoadCustom();
  const groups   = fcLoadGroups();
  const filtered = fcGetActiveCards();

  // group lookup helper
  const gMap = Object.fromEntries(groups.map(g => [g.id, g]));

  // group selector for forms
  const groupSelectOptions = `
    <option value="">グループなし</option>
    ${groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}
  `;

  area.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:14px">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;color:#e879f9;text-transform:uppercase;margin-bottom:4px">🃏 フラッシュカード</div>
          <div style="font-size:0.78rem;color:var(--text-sub)">${allCards.length}枚 · ${groups.length}グループ</div>
        </div>
        ${filtered.length > 0 ? `
          <button onclick="fcStartCustomQuiz()"
            style="background:linear-gradient(135deg,#e879f9,#6c63ff);border:none;border-radius:10px;color:#fff;font-size:0.83rem;font-weight:700;padding:9px 18px;cursor:pointer;font-family:inherit">
            ▶ 練習 ${fcCurrentGroup==='all'?'':'('+filtered.length+'枚)'}
          </button>
        ` : ''}
      </div>

      <!-- Group bar -->
      <div style="display:flex;gap:6px;flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px;-ms-overflow-style:none;scrollbar-width:none">

        <button onclick="fcSetGroup('all')"
          style="flex-shrink:0;background:${fcCurrentGroup==='all'?'#e879f9':'transparent'};border:1px solid ${fcCurrentGroup==='all'?'#e879f9':'var(--border)'};border-radius:20px;color:${fcCurrentGroup==='all'?'#fff':'var(--text-sub)'};font-size:0.73rem;font-weight:600;padding:4px 12px;cursor:pointer;font-family:inherit;white-space:nowrap">
          すべて <span style="opacity:0.75">${allCards.length}</span>
        </button>

        ${groups.map(g => {
          const cnt   = allCards.filter(c => c.groupId === g.id).length;
          const active = fcCurrentGroup === g.id;
          return `
            <div style="display:inline-flex;align-items:center;flex-shrink:0;border-radius:20px;border:1px solid ${active?g.color:'var(--border)'};background:${active?g.color+'22':'transparent'};overflow:hidden">
              <button onclick="fcSetGroup('${g.id}')"
                style="background:transparent;border:none;color:${active?g.color:'var(--text-sub)'};font-size:0.73rem;font-weight:600;padding:4px 6px 4px 10px;cursor:pointer;font-family:inherit;white-space:nowrap;display:flex;align-items:center;gap:5px">
                <span style="width:7px;height:7px;border-radius:50%;background:${g.color};flex-shrink:0;display:inline-block"></span>
                ${g.name} <span style="opacity:0.65">${cnt}</span>
              </button>
              <button data-gid="${g.id}" onclick="fcDeleteGroup(this.dataset.gid)"
                style="background:transparent;border:none;color:var(--text-sub);font-size:0.68rem;padding:4px 8px 4px 2px;cursor:pointer;line-height:1;opacity:0.45"
                onmouseover="this.style.opacity='1';this.style.color='#fc5c65'"
                onmouseout="this.style.opacity='0.45';this.style.color=''">✕</button>
            </div>`;
        }).join('')}

        ${fcNewGroupOpen ? `
          <div style="display:inline-flex;align-items:center;gap:6px;flex-shrink:0;background:var(--surface2,rgba(255,255,255,0.06));border:1px solid var(--border);border-radius:20px;padding:3px 10px">
            <input id="fc-gname" type="text" placeholder="グループ名" maxlength="16" autofocus
              style="background:transparent;border:none;outline:none;color:var(--text);font-family:inherit;font-size:0.75rem;width:80px"
              onkeydown="if(event.key==='Enter')fcCreateGroup();if(event.key==='Escape')fcToggleNewGroup()">
            <div style="display:flex;gap:3px;align-items:center">
              ${FC_GRP_COLORS.map(col=>`
                <button onclick="fcSetNewGroupColor('${col}')"
                  style="width:11px;height:11px;border-radius:50%;background:${col};border:2px solid ${fcNewGroupColor===col?'#fff':'transparent'};cursor:pointer;padding:0;flex-shrink:0;box-sizing:border-box"></button>
              `).join('')}
            </div>
            <button onclick="fcCreateGroup()"
              style="background:${fcNewGroupColor};border:none;border-radius:10px;color:#fff;font-size:0.7rem;font-weight:700;padding:3px 8px;cursor:pointer;font-family:inherit;white-space:nowrap">作成</button>
            <button onclick="fcToggleNewGroup()"
              style="background:transparent;border:none;color:var(--text-sub);font-size:0.8rem;cursor:pointer;padding:0 1px;line-height:1">✕</button>
          </div>
        ` : `
          <button onclick="fcToggleNewGroup()"
            style="flex-shrink:0;background:transparent;border:1px dashed var(--border);border-radius:20px;color:var(--text-sub);font-size:0.73rem;font-weight:600;padding:4px 11px;cursor:pointer;font-family:inherit;white-space:nowrap"
            onmouseover="this.style.borderColor='#e879f9';this.style.color='#e879f9'"
            onmouseout="this.style.borderColor='';this.style.color=''">
            ＋ 新グループ
          </button>
        `}
      </div>

      <!-- Add card toggle -->
      <div>
        ${fcAddFormOpen ? `
          <div style="background:var(--surface2,rgba(255,255,255,0.04));border:1.5px solid var(--accent,#6c63ff);border-radius:12px;padding:16px;animation:fadeUp 0.18s ease">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
              <span style="font-size:0.75rem;font-weight:700;color:var(--accent,#6c63ff);letter-spacing:0.5px">＋ カードを追加</span>
              <button onclick="fcToggleAddForm()" style="background:transparent;border:none;color:var(--text-sub);font-size:1rem;cursor:pointer;padding:2px 6px;line-height:1">✕</button>
            </div>
            <input id="fc-new-term" type="text" placeholder="用語・単語（表面）" maxlength="80"
              style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;font-size:0.85rem;padding:9px 12px;margin-bottom:8px;outline:none;display:block"
              onkeydown="if(event.key==='Enter')document.getElementById('fc-new-def').focus()">
            <textarea id="fc-new-def" rows="2" placeholder="説明・定義（裏面）" maxlength="300"
              style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;font-size:0.83rem;padding:9px 12px;margin-bottom:8px;outline:none;resize:vertical;display:block"></textarea>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <select id="fc-new-group"
                style="flex:1;min-width:120px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text-sub);font-family:inherit;font-size:0.78rem;padding:7px 10px;outline:none;cursor:pointer">
                ${groupSelectOptions}
              </select>
              <button onclick="fcSubmitCustomCard()"
                style="background:var(--accent,#6c63ff);border:none;border-radius:8px;color:#fff;font-size:0.82rem;font-weight:700;padding:9px 20px;cursor:pointer;font-family:inherit">
                追加する
              </button>
            </div>
          </div>
        ` : `
          <button onclick="fcToggleAddForm()"
            style="width:100%;background:transparent;border:1.5px dashed var(--border);border-radius:12px;color:var(--text-sub);font-size:0.83rem;font-weight:600;padding:11px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px"
            onmouseover="this.style.borderColor='var(--accent,#6c63ff)';this.style.color='var(--accent,#6c63ff)'"
            onmouseout="this.style.borderColor='';this.style.color=''">
            <span style="font-size:1.1rem;line-height:1">＋</span> カードを追加
          </button>
        `}
      </div>

      <!-- Card list (filtered by group) -->
      ${filtered.length === 0 ? `
        <div style="text-align:center;padding:28px 16px;color:var(--text-sub)">
          <div style="font-size:2.2rem;margin-bottom:10px">🃏</div>
          <div style="font-size:0.82rem;line-height:1.7">
            ${allCards.length === 0
              ? 'カードがまだありません。<br>＋ ボタンかAI用語ノートから追加できます。'
              : 'このグループにはカードがありません。'}
          </div>
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:8px">
          ${filtered.map(c => {
            const safeAttr = c.term.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
            const grp      = c.groupId ? gMap[c.groupId] : null;
            const isEditing = fcEditingTerm === c.term;
            if (isEditing) {
              return `
                <div style="background:var(--surface2,rgba(255,255,255,0.04));border:1.5px solid #e879f9;border-radius:10px;padding:14px">
                  <div style="font-size:0.7rem;font-weight:700;color:#e879f9;letter-spacing:0.5px;margin-bottom:10px">✏️ 編集中</div>
                  <input id="fc-edit-term" type="text" value="${c.term.replace(/"/g,'&quot;')}" maxlength="80"
                    style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;font-size:0.85rem;font-weight:700;padding:8px 11px;margin-bottom:8px;outline:none;display:block">
                  <textarea id="fc-edit-def" rows="2" maxlength="300"
                    style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;font-size:0.8rem;padding:8px 11px;margin-bottom:8px;outline:none;resize:vertical;display:block">${c.def}</textarea>
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">
                    <select id="fc-edit-group"
                      style="flex:1;min-width:120px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text-sub);font-family:inherit;font-size:0.78rem;padding:7px 10px;outline:none;cursor:pointer">
                      ${groupSelectOptions.replace(`value="${c.groupId||''}"`,`value="${c.groupId||''}" selected`)}
                    </select>
                  </div>
                  <div style="display:flex;gap:8px">
                    <button data-orig="${safeAttr}" onclick="fcSaveEditCard(this.dataset.orig)"
                      style="background:#e879f9;border:none;border-radius:8px;color:#fff;font-size:0.8rem;font-weight:700;padding:7px 16px;cursor:pointer;font-family:inherit">💾 保存</button>
                    <button onclick="fcCancelEdit()"
                      style="background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-sub);font-size:0.8rem;padding:7px 14px;cursor:pointer;font-family:inherit">キャンセル</button>
                  </div>
                </div>`;
            }
            return `
              <div style="background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border);border-radius:10px;padding:12px 14px;display:flex;align-items:flex-start;gap:10px">
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap">
                    <span style="font-size:0.88rem;font-weight:700;color:var(--text)">${c.term}</span>
                    ${grp ? `<span style="font-size:0.65rem;font-weight:600;padding:2px 7px;border-radius:10px;background:${grp.color}22;color:${grp.color};border:1px solid ${grp.color}44">${grp.name}</span>` : ''}
                  </div>
                  <div style="font-size:0.75rem;color:var(--text-sub);line-height:1.5">${c.def}</div>
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0">
                  <button data-term="${safeAttr}" onclick="fcOpenEditCard(this.dataset.term)"
                    style="background:transparent;border:1px solid var(--border);border-radius:7px;color:var(--text-sub);font-size:0.8rem;padding:5px 8px;cursor:pointer;font-family:inherit"
                    onmouseover="this.style.color='#e879f9';this.style.borderColor='#e879f9'"
                    onmouseout="this.style.color='';this.style.borderColor=''" title="編集">✏️</button>
                  <button data-term="${safeAttr}" onclick="fcDeleteCustomCard(this.dataset.term)"
                    style="background:transparent;border:1px solid var(--border);border-radius:7px;color:var(--text-sub);font-size:0.8rem;padding:5px 8px;cursor:pointer;font-family:inherit"
                    onmouseover="this.style.color='#fc5c65';this.style.borderColor='#fc5c65'"
                    onmouseout="this.style.color='';this.style.borderColor=''" title="削除">🗑️</button>
                </div>
              </div>`;
          }).join('')}
        </div>
      `}
    </div>
  `;

  // Pre-select group in add-form if a group is active
  if (fcAddFormOpen && fcCurrentGroup !== 'all') {
    const sel = document.getElementById('fc-new-group');
    if (sel) sel.value = fcCurrentGroup;
  }
  // Focus new-group input
  if (fcNewGroupOpen) setTimeout(() => document.getElementById('fc-gname')?.focus(), 40);
}

window.fcToggleAddForm = function () {
  fcAddFormOpen = !fcAddFormOpen;
  renderFCCustom();
  if (fcAddFormOpen) setTimeout(() => document.getElementById('fc-new-term')?.focus(), 60);
};

window.fcSubmitCustomCard = function () {
  const termEl = document.getElementById('fc-new-term');
  const defEl  = document.getElementById('fc-new-def');
  const term = termEl?.value.trim();
  const def  = defEl?.value.trim();
  if (!term) { termEl?.focus(); return; }
  if (!def)  { defEl?.focus(); return; }
  const groupId = document.getElementById('fc-new-group')?.value || '';
  window.fcAddCustomCard(term, def, groupId);
  fcAddFormOpen = false;   // collapse form after adding
  renderFCCustom();
};

window.fcDeleteCustomCard = function (term) {
  if (!confirm(`「${term}」を削除しますか？`)) return;
  if (fcEditingTerm === term) fcEditingTerm = null;
  fcSaveCustom(fcLoadCustom().filter(c => c.term !== term));
  renderFCCustom();
};

window.fcOpenEditCard = function (term) {
  fcEditingTerm = term;
  renderFCCustom();
  // Focus the term input after render
  setTimeout(() => document.getElementById('fc-edit-term')?.focus(), 50);
};

window.fcCancelEdit = function () {
  fcEditingTerm = null;
  renderFCCustom();
};

window.fcSaveEditCard = function (originalTerm) {
  const newTerm    = document.getElementById('fc-edit-term')?.value.trim();
  const newDef     = document.getElementById('fc-edit-def')?.value.trim();
  const newGroupId = document.getElementById('fc-edit-group')?.value || '';
  if (!newTerm) { document.getElementById('fc-edit-term')?.focus(); return; }
  if (!newDef)  { document.getElementById('fc-edit-def')?.focus(); return; }

  const cards = fcLoadCustom();
  const idx = cards.findIndex(c => c.term === originalTerm);
  if (idx !== -1) {
    cards[idx] = { ...cards[idx], term: newTerm, def: newDef, groupId: newGroupId };
    fcSaveCustom(cards);
  }
  fcEditingTerm = null;
  renderFCCustom();
};

window.fcStartCustomQuiz = function () {
  const cards = fcGetActiveCards();
  if (cards.length === 0) return;
  fcCards = [...cards].sort(() => Math.random() - 0.5);
  fcIndex = 0; fcKnew = 0; fcDidntKnow = 0; fcFlipped = false;
  renderFCCard();
};

// ── Group management ──

window.fcSetGroup = function (id) {
  fcCurrentGroup = id;
  renderFCCustom();
};

window.fcToggleNewGroup = function () {
  fcNewGroupOpen = !fcNewGroupOpen;
  if (!fcNewGroupOpen) fcNewGroupColor = '#6c63ff';
  renderFCCustom();
  if (fcNewGroupOpen) setTimeout(() => document.getElementById('fc-gname')?.focus(), 60);
};

window.fcSetNewGroupColor = function (color) {
  fcNewGroupColor = color;
  renderFCCustom();
  if (fcNewGroupOpen) setTimeout(() => document.getElementById('fc-gname')?.focus(), 60);
};

window.fcCreateGroup = function () {
  const nameEl = document.getElementById('fc-gname');
  const name   = nameEl?.value.trim();
  if (!name) { nameEl?.focus(); return; }
  const groups = fcLoadGroups();
  const id = 'grp_' + Date.now();
  groups.push({ id, name, color: fcNewGroupColor, createdAt: new Date().toISOString() });
  fcSaveGroups(groups);
  fcCurrentGroup = id;   // auto-select the new group
  fcNewGroupOpen = false;
  fcNewGroupColor = '#6c63ff';
  renderFCCustom();
};

window.fcDeleteGroup = function (id) {
  if (!confirm('このグループを削除しますか？（カードはそのまま残ります）')) return;
  const groups = fcLoadGroups().filter(g => g.id !== id);
  fcSaveGroups(groups);
  // Strip groupId from any cards that belonged to this group
  const cards = fcLoadCustom().map(c => c.groupId === id ? { ...c, groupId: '' } : c);
  fcSaveCustom(cards);
  if (fcCurrentGroup === id) fcCurrentGroup = 'all';
  renderFCCustom();
};

// Tab switcher for cert page
window.switchCertTab = function (tabId) {
  document.querySelectorAll('.cert-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cert-tab-pane').forEach(p => { p.style.display = 'none'; });
  document.querySelector(`[data-cert-tab="${tabId}"]`)?.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.style.display = 'block';

  if (tabId === 'cert-tab-flash' && window.initFlashcard) {
    if (!pane.innerHTML.trim()) window.initFlashcard();
  }
};
