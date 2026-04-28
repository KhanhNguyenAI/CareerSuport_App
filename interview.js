// ─────────────────────────────────────
// Config
// ─────────────────────────────────────

// API key + model resolved dynamically from gemini-config.js (supports user override)

async function geminiRequest(prompt, maxTokens = 2048, retries = 3, delayMs = 2000) {
  return window.callAI(prompt, maxTokens, retries, delayMs);
}

// ─────────────────────────────────────
// Question Bank
// ─────────────────────────────────────

const QUESTIONS_DOMESTIC = [
  {
    id: 'jiko-shokai',
    category: '自己紹介',
    icon: '👋',
    question: '自己紹介をお願いします。',
    hint: ['挨拶', '名前', '専攻・分野', '強み', '具体的な行動', '締め'],
    template: '本日はよろしくお願いいたします。私は〇〇と申します。現在〜を専攻しており、特に〜に力を入れています。私の強みは〜で、〜という経験からそれを実感しました。本日はどうぞよろしくお願いいたします。',
    tips: ['1〜2分程度でまとめる', '強みは1つに絞る', '具体的なエピソードを一言添える'],
    placeholder: '日本語または参考用のベトナム語で入力してください...',
  },
  {
    id: 'tsuyomi',
    category: '強み・弱み',
    icon: '💪',
    question: 'あなたの強みと弱みを教えてください。',
    hint: ['強みを1つ述べる', '具体的なエピソード', '弱みを1つ述べる', '改善への取り組み'],
    template: '私の強みは〜です。例えば〜という経験で〜を実現しました。一方、弱みは〜ですが、〜を意識することで改善に取り組んでいます。',
    tips: ['強みと弱みは正直に', '弱みは「改善中」として前向きに', '継続力・責任感・完璧主義などが使いやすい'],
    examples: {
      '強み例': ['継続力 → 毎日勉強している', '責任感 → チームで最後までやり切る'],
      '弱み例': ['完璧主義 → 時間管理を意識して改善中', '慎重すぎる → 期限を決めて行動するよう意識'],
    },
    placeholder: '強みと弱みをそれぞれ具体的に...',
  },
  {
    id: 'gakkou',
    category: '学校・学習',
    icon: '🎓',
    question: '学校では何を学んでいますか？',
    hint: ['専攻・学科', '特に力を入れていること', '将来の仕事への活かし方'],
    template: '現在、〜を中心に学んでいます。特に〜の授業・研究に力を入れており、〜を習得しました。将来の仕事に活かしたいと考えています。',
    tips: ['具体的な技術・言語・ツール名を挙げる', '学んだことと志望職種をつなげる'],
    placeholder: '学んでいること・特に力を入れていることを具体的に...',
  },
  {
    id: 'riyuu',
    category: '志望動機',
    icon: '🎯',
    question: 'なぜこの仕事・業界を志望しましたか？',
    hint: ['きっかけ・経験', '興味を持った理由', '仕事への想い・目標'],
    template: '〜の経験から、〜に強い興味を持ちました。そのため、〜ができるこの仕事を志望しました。将来は〜を目指したいと考えています。',
    tips: ['「なんとなく」は禁物', '具体的な経験・出来事をきっかけにする', '会社・業界研究を反映させる'],
    placeholder: 'この仕事を選んだ理由・きっかけを...',
  },
  {
    id: 'doryoku',
    category: '頑張ったこと',
    icon: '🔥',
    question: 'これまでで最も頑張ったことを教えてください。困難と克服法も含めて。',
    hint: ['状況（何をしていたか）', '課題（どんな困難）', '行動（何をしたか）', '結果（何を得たか）'],
    template: '〜に取り組んでいた際、〜という課題がありました。そこで私は〜という行動をとりました。その結果、〜を達成し、〜を学びました。',
    tips: ['STAR法（状況・課題・行動・結果）で構成する', '数字・期間を入れると説得力UP', 'チーム or 個人どちらのエピソードでもOK'],
    placeholder: 'STAR法で答えてみましょう：状況→課題→行動→結果...',
  },
  {
    id: 'kaisha',
    category: '志望理由（会社）',
    icon: '🏢',
    question: 'なぜ当社を志望しましたか？',
    hint: ['会社の魅力を具体的に', '自分のスキル・経験との一致', '入社後にやりたいこと'],
    template: '御社の〜に魅力を感じました。自分の〜という強みを活かせると考えています。入社後は〜に携わり、〜を実現したいと思っています。',
    tips: ['企業HPやニュースを事前に調べる', '「安定しているから」はNG', '自分の強みとの接続が重要'],
    placeholder: '会社のどこに魅力を感じたか、自分とのマッチを...',
  },
  {
    id: 'shourai',
    category: '将来のビジョン',
    icon: '🚀',
    question: '10年後、どのような人材・キャリアを目指していますか？',
    hint: ['将来なりたい姿', 'そのために今取り組んでいること', '会社での成長イメージ'],
    template: '将来的には〜になりたいと考えています。そのためにまずは〜を身につけたいです。御社では〜を経験しながら成長していきたいと思っています。',
    tips: ['具体的な職種・スキル・ポジションを述べる', '現実的かつ前向きなビジョンを', '会社の事業と絡めると好印象'],
    placeholder: '5〜10年後のキャリアビジョンを...',
  },
  {
    id: 'hyouka',
    category: '周囲からの評価',
    icon: '👥',
    question: '周りの人からどのような人だと言われますか？それは正しいと思いますか？',
    hint: ['周囲からよく言われること', '具体的なエピソード', '自己評価との一致・相違'],
    template: '周りからは〜と言われます。例えば〜という場面で〜と言われました。自分でもその通りだと思っており、〜という部分は特に意識しています。',
    tips: ['ポジティブな評価を選ぶ', '具体的な場面・言葉を入れる', '謙虚さも一言添える'],
    placeholder: '友人・チームメンバー・先生などからの評価を...',
  },
];

const QUESTIONS_INTERNATIONAL = [
  ...QUESTIONS_DOMESTIC,
  {
    id: 'why-japan',
    category: '日本での就職',
    icon: '🗾',
    question: 'なぜ日本に来て、日本で働きたいと思っているのですか？',
    hint: ['日本を選んだ理由', '日本で働きたい理由', '日本語・日本文化への関心'],
    template: '〜がきっかけで日本に興味を持ちました。日本の〜という点に魅力を感じ、日本で〜のキャリアを築きたいと考えています。',
    tips: ['「日本が好き」だけでは弱い', '具体的な文化・技術・市場への興味を述べる', '日本語学習への取り組みも添えると良い'],
    placeholder: '日本を選んだ理由・日本で働きたい理由を具体的に...',
  },
  {
    id: 'how-long',
    category: '日本での就職',
    icon: '📅',
    question: '日本にはどのくらい滞在する予定ですか？将来的に帰国の予定はありますか？',
    hint: ['日本での滞在予定期間', '長期的なキャリアプラン', '帰国の有無と理由'],
    template: '現在は〜年程度を考えていますが、仕事・キャリア次第で長期滞在も視野に入れています。〜のスキルを身につけた後のことは、状況を見ながら柔軟に考えていきたいと思います。',
    tips: ['正直に、しかし前向きに', '「仕事に集中したい」姿勢を示す', '曖昧でもOK、誠実さが大切'],
    placeholder: '日本での今後のプランを正直に...',
  },
];

// ─────────────────────────────────────
// State
// ─────────────────────────────────────

let currentQuestions = QUESTIONS_DOMESTIC;
let currentIndex     = 0;
let studentType      = 'domestic'; // 'domestic' | 'international'

// ─────────────────────────────────────
// Profile helper
// ─────────────────────────────────────

function getProfile() {
  return JSON.parse(localStorage.getItem('user_profile') || '{}');
}

// ─────────────────────────────────────
// Tab switcher (main tabs) — defined on window below
// ─────────────────────────────────────

// ─────────────────────────────────────
// Student type toggle
// ─────────────────────────────────────

function setStudentType(type) {
  studentType = type;
  currentQuestions = type === 'international' ? QUESTIONS_INTERNATIONAL : QUESTIONS_DOMESTIC;
  currentIndex = 0;
  document.querySelectorAll('.student-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-type="${type}"]`).classList.add('active');
  renderQuestion();
}

// ─────────────────────────────────────
// Render question
// ─────────────────────────────────────

function renderQuestion() {
  const wrap = document.getElementById('interview-wrap');
  if (currentIndex >= currentQuestions.length) {
    renderComplete();
    return;
  }

  const q   = currentQuestions[currentIndex];
  const p   = getProfile();
  const total = currentQuestions.length;

  // Progress steps
  const stepsHtml = currentQuestions.map((_, i) => {
    const cls = i < currentIndex ? 'done' : i === currentIndex ? 'current' : '';
    return `<div class="progress-step ${cls}"></div>`;
  }).join('');

  // Hint flow
  const flowHtml = q.hint.map((s, i) =>
    i === 0 ? `<span class="step">${s}</span>`
            : `<span class="arrow">→</span><span class="step">${s}</span>`
  ).join('');

  // Examples (optional)
  let examplesHtml = '';
  if (q.examples) {
    examplesHtml = Object.entries(q.examples).map(([label, items]) => `
      <div style="margin-top:8px">
        <div style="font-size:0.68rem;color:var(--accent3);font-weight:700;margin-bottom:4px">${label}</div>
        ${items.map(it => `<div class="tip-chip" style="display:inline-flex;margin:2px">${it}</div>`).join('')}
      </div>
    `).join('');
  }

  wrap.innerHTML = `
    <!-- Progress -->
    <div class="interview-progress">
      <div class="progress-steps">${stepsHtml}</div>
      <span class="progress-label">${currentIndex + 1} / ${total}</span>
    </div>

    <!-- Question card -->
    <div class="question-card">
      <div class="question-header">
        <span class="question-num">${q.icon} ${q.category}</span>
        <div class="question-text">${q.question}</div>
      </div>

      <div class="question-hint">
        <div class="hint-label">💡 回答の構成ヒント</div>
        <div class="hint-flow">${flowHtml}</div>
        ${examplesHtml}
        <div class="hint-template" onclick="useTemplate('${q.id}')">
          <span class="hint-template-label">📝 テンプレート例（クリックで入力欄にコピー）</span>
          ${q.template}
        </div>
        <div class="hint-tips">
          ${q.tips.map(t => `<span class="tip-chip">✓ ${t}</span>`).join('')}
        </div>
      </div>

      <div class="answer-area">
        <div class="answer-label">あなたの回答</div>
        <textarea
          class="answer-textarea"
          id="answer-input"
          placeholder="${q.placeholder}"
          oninput="updateCharCount()"
        ></textarea>
        <div class="answer-footer">
          <span class="answer-charcount" id="char-count">0文字</span>
          <button class="btn-evaluate" onclick="evaluateAnswer('${q.id}')" id="btn-evaluate">
            ✨ AIに評価してもらう
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback placeholder -->
    <div id="feedback-area"></div>

    <!-- Nav -->
    <div class="interview-nav" id="nav-area" style="display:flex">
      ${currentIndex > 0 ? `<button class="btn-next" onclick="prevQuestion()">← 前の質問</button>` : ''}
      <button class="btn-next primary" onclick="nextQuestion()">
        ${currentIndex < total - 1 ? '次の質問 →' : '🎉 完了'}
      </button>
    </div>
  `;

  // Restore answer if exists
  const saved = sessionAnswers[q.id];
  if (saved) {
    document.getElementById('answer-input').value = saved.answer || '';
    updateCharCount();
    if (saved.feedback) renderFeedback(saved.feedback, q);
  }
}

// ─────────────────────────────────────
// Template copy
// ─────────────────────────────────────

function useTemplate(qId) {
  const q = currentQuestions.find(q => q.id === qId);
  if (!q) return;
  const ta = document.getElementById('answer-input');
  ta.value = q.template;
  updateCharCount();
  ta.focus();
}

function updateCharCount() {
  const val = document.getElementById('answer-input')?.value || '';
  const el  = document.getElementById('char-count');
  if (el) el.textContent = `${val.length}文字`;
}

// ─────────────────────────────────────
// Session answers cache
// ─────────────────────────────────────

const sessionAnswers = {};

// ─────────────────────────────────────
// Evaluate answer via Gemini
// ─────────────────────────────────────

async function evaluateAnswer(qId) {
  const q      = currentQuestions.find(q => q.id === qId);
  const answer = document.getElementById('answer-input')?.value.trim();
  if (!answer) {
    alert('回答を入力してください。');
    return;
  }

  const btn = document.getElementById('btn-evaluate');
  btn.disabled = true;
  btn.textContent = '評価中...';

  const fbArea = document.getElementById('feedback-area');
  fbArea.innerHTML = `
    <div class="feedback-card">
      <div class="fb-loading">
        <div class="spinner"></div>
        <span>Gemini AIが回答を分析中...</span>
      </div>
    </div>`;

  const p = getProfile();

  const prompt = `あなたはIT企業の採用面接の専門コーチです。
以下の面接の回答を分析・評価してください。

【質問】${q.question}
【カテゴリ】${q.category}
【応募者】${p.name || '就活生'}／${p.status || '学生'}

【回答】
${answer}

以下の4ブロックを必ず全て出力してください：

[総合評価]
10点満点で次の3軸それぞれのスコアを出してください：
- 内容の充実度：X/10
- 構成・論理性：X/10
- 日本語の自然さ：X/10
そして一言コメント（1〜2文）。

[良かった点]
回答の中で評価できる点を2〜3つ、具体的に。

[改善ポイント]
より良くするための具体的なアドバイスを2〜3つ。

[改善版サンプル]
上記のアドバイスを反映した、より良い回答例を書いてください（200字程度）。`.trim();

  try {
    const text = await geminiRequest(prompt, 2048);

    const feedback = parseFeedback(text);
    sessionAnswers[qId] = { answer, feedback };

    renderFeedback(feedback, q);
    document.getElementById('nav-area').style.display = 'flex';

  } catch (e) {
    const msg = e.message === 'RATE_LIMIT'
      ? '⏳ リクエスト制限です。1分ほど待ってから再試行してください。'
      : e.message === 'SERVER_ERROR'
      ? '🔄 AIサーバーが混雑しています。しばらく待ってから再試行してください。'
      : `⚠️ エラー: ${e.message}`;
    fbArea.innerHTML = `
      <div class="feedback-card" style="padding:20px 22px;color:var(--accent4)">
        ${msg}<br><br>
        <button class="btn-next" onclick="evaluateAnswer('${q.id}')" style="margin-top:4px">🔄 再試行する</button>
      </div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ AIに評価してもらう';
  }
}

// ─────────────────────────────────────
// Parse Gemini feedback text
// ─────────────────────────────────────

function parseFeedback(text) {
  const blocks = {};
  const regex  = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks[match[1].trim()] = match[2].trim();
  }
  return blocks;
}

function extractScore(text, label) {
  const m = text.match(new RegExp(label + '[：:]*\\s*(\\d+)/10'));
  return m ? parseInt(m[1]) : null;
}

// ─────────────────────────────────────
// Render feedback card
// ─────────────────────────────────────

function renderFeedback(feedback, q) {
  const fbArea = document.getElementById('feedback-area');

  const totalText  = feedback['総合評価'] || '';
  const score1 = extractScore(totalText, '内容の充実度');
  const score2 = extractScore(totalText, '構成・論理性');
  const score3 = extractScore(totalText, '日本語の自然さ');

  function scoreColor(s) {
    if (!s) return 'var(--text-sub)';
    if (s >= 8) return '#48cfad';
    if (s >= 6) return '#f7b731';
    return '#fc5c65';
  }

  function scoreBar(s) {
    return s !== null ? `
      <div class="score-bar">
        <div class="score-bar-fill" style="width:${s*10}%;background:${scoreColor(s)}"></div>
      </div>` : '';
  }

  // Strip score lines from comment
  const comment = totalText.replace(/[-・]?\s*内容の充実度[：:][^\n]*/g, '')
                            .replace(/[-・]?\s*構成・論理性[：:][^\n]*/g, '')
                            .replace(/[-・]?\s*日本語の自然さ[：:][^\n]*/g, '')
                            .trim();

  // Good points / improvements as list
  function toList(text) {
    if (!text) return '<p style="color:var(--text-sub)">—</p>';
    return text.split('\n')
      .filter(l => l.trim())
      .map(l => l.replace(/^[-・\d\.]\s*/, ''))
      .filter(l => l)
      .map(l => `<div style="display:flex;gap:8px;margin-bottom:6px"><span style="flex-shrink:0">▸</span><span>${l}</span></div>`)
      .join('');
  }

  fbArea.innerHTML = `
    <div class="feedback-card">
      <div class="feedback-header">
        <span>📊 AIフィードバック</span>
        <span class="ai-badge">Gemini AI</span>
      </div>

      <div class="feedback-score-row">
        <div class="score-item">
          <div class="score-label">内容の充実度</div>
          <div class="score-value" style="color:${scoreColor(score1)}">${score1 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
          ${scoreBar(score1)}
        </div>
        <div class="score-item">
          <div class="score-label">構成・論理性</div>
          <div class="score-value" style="color:${scoreColor(score2)}">${score2 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
          ${scoreBar(score2)}
        </div>
        <div class="score-item">
          <div class="score-label">日本語の自然さ</div>
          <div class="score-value" style="color:${scoreColor(score3)}">${score3 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
          ${scoreBar(score3)}
        </div>
      </div>

      <div class="feedback-body">
        ${comment ? `
        <div class="fb-block">
          <div class="fb-block-header" style="color:#f7b731">💬 <span>総合コメント</span></div>
          <div class="fb-block-body">${comment}</div>
        </div>` : ''}

        <div class="fb-block">
          <div class="fb-block-header" style="color:#48cfad">✅ <span>良かった点</span></div>
          <div class="fb-block-body">${toList(feedback['良かった点'])}</div>
        </div>

        <div class="fb-block">
          <div class="fb-block-header" style="color:#fc5c65">🔧 <span>改善ポイント</span></div>
          <div class="fb-block-body">${toList(feedback['改善ポイント'])}</div>
        </div>

        ${feedback['改善版サンプル'] ? `
        <div class="fb-block">
          <div class="fb-block-header" style="color:#6c63ff">✨ <span>改善版サンプル</span></div>
          <div class="fb-block-body">
            <div class="improved-text">${feedback['改善版サンプル']}</div>
          </div>
        </div>` : ''}
      </div>
    </div>
  `;

  document.getElementById('nav-area').style.display = 'flex';
  fbArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─────────────────────────────────────
// Navigation
// ─────────────────────────────────────

function nextQuestion() {
  // Save current answer
  const input = document.getElementById('answer-input');
  const qId   = currentQuestions[currentIndex]?.id;
  if (input && qId) {
    sessionAnswers[qId] = sessionAnswers[qId] || {};
    sessionAnswers[qId].answer = input.value;
  }
  currentIndex++;
  renderQuestion();
  document.getElementById('interview-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevQuestion() {
  const input = document.getElementById('answer-input');
  const qId   = currentQuestions[currentIndex]?.id;
  if (input && qId) {
    sessionAnswers[qId] = sessionAnswers[qId] || {};
    sessionAnswers[qId].answer = input.value;
  }
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
    document.getElementById('interview-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─────────────────────────────────────
// Complete screen
// ─────────────────────────────────────

function renderComplete() {
  const evaluated = Object.values(sessionAnswers).filter(a => a.feedback).length;
  document.getElementById('interview-wrap').innerHTML = `
    <div class="complete-card">
      <div class="complete-icon">🎉</div>
      <h2>一次面接シミュレーション完了！</h2>
      <p>
        ${currentQuestions.length}問中 <strong style="color:var(--accent)">${evaluated}問</strong> のAI評価を受けました。<br>
        フィードバックをもとに回答を磨いていきましょう。
      </p>
      <button class="btn-restart" onclick="restartInterview()">🔄 もう一度練習する</button>
    </div>
  `;
}

function restartInterview() {
  currentIndex = 0;
  Object.keys(sessionAnswers).forEach(k => delete sessionAnswers[k]);
  renderQuestion();
}

// ─────────────────────────────────────
// Init
// ─────────────────────────────────────

window.switchMainTab = function(tabId) {
  // Base tab switch
  document.querySelectorAll('.main-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.main-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');

  // Lazy init 二次面接
  if (tabId === 'tab-interview2' && window.initInterview2) {
    const wrap = document.getElementById('interview2-wrap');
    if (wrap && !wrap.innerHTML.trim()) window.initInterview2();
  }
  // Lazy init SPI / WebCAB / 筆記試験
  if (tabId === 'tab-spi' && window.renderSPI) {
    const el = document.getElementById('tab-spi');
    if (el && !el.innerHTML.trim()) window.renderSPI();
  }
  if (tabId === 'tab-webcab' && window.renderWebCAB) {
    const el = document.getElementById('tab-webcab');
    if (el && !el.innerHTML.trim()) window.renderWebCAB();
  }
  if (tabId === 'tab-kakishiken' && window.renderKakiShiken) {
    const el = document.getElementById('tab-kakishiken');
    if (el && !el.innerHTML.trim()) window.renderKakiShiken();
  }
  // Lazy init 企業研究
  if (tabId === 'tab-company' && window.initCompanySearch) {
    const el = document.getElementById('tab-company');
    if (el && !el.innerHTML.trim()) window.initCompanySearch();
  }
};
window.setStudentType  = setStudentType;
window.renderQuestion  = renderQuestion;
window.useTemplate     = useTemplate;
window.updateCharCount = updateCharCount;
window.evaluateAnswer  = evaluateAnswer;
window.nextQuestion    = nextQuestion;
window.prevQuestion    = prevQuestion;
window.restartInterview = restartInterview;
