// ─────────────────────────────────────
// 二次面接シミュレーター
// ES upload → AI generates questions → Voice interview → AI evaluation
// ─────────────────────────────────────

const GEMINI_API_KEY2 = 'AIzaSyDst9TClnMCxy70KW_rIA1H_mI0aSR0sFw';
const GEMINI_URL2 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY2}`;

async function geminiRequest2(prompt, maxTokens = 2048, retries = 3, delayMs = 2000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GEMINI_URL2, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens }
        })
      });
      if (res.status === 429 || res.status === 503 || res.status === 502 || res.status === 500) {
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
          continue;
        }
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

// ── State ──
let esContent      = '';          // ES text uploaded by user
let i2Questions    = [];          // AI-generated questions
let i2Index        = 0;           // current question index
let i2Answers      = {};          // { qIndex: { answer, feedback } }
let recognition    = null;        // SpeechRecognition instance
let isListening    = false;
let interimText    = '';

// ─────────────────────────────────────
// Init — render step 1
// ─────────────────────────────────────

function initInterview2() {
  renderStep1();
}

// ─────────────────────────────────────
// Step 1: Upload ES
// ─────────────────────────────────────

function renderStep1() {
  const wrap = document.getElementById('interview2-wrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:20px">

      <!-- Intro -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px 24px">
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:1.5px;color:var(--accent2);text-transform:uppercase;margin-bottom:10px">
          🎙️ 二次面接シミュレーター
        </div>
        <p style="font-size:0.85rem;color:var(--text-sub);line-height:1.7">
          提出したESをAIが読み込み、その内容をもとに面接官役のAIが質問を生成します。<br>
          マイクを使って声で回答し、AIがリアルタイムで採点・フィードバックを行います。
        </p>
        <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
          <span style="font-size:0.75rem;background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);color:var(--accent2);border-radius:20px;padding:4px 12px">📄 ES連動</span>
          <span style="font-size:0.75rem;background:rgba(72,207,173,0.1);border:1px solid rgba(72,207,173,0.2);color:var(--accent);border-radius:20px;padding:4px 12px">🎤 音声認識</span>
          <span style="font-size:0.75rem;background:rgba(247,183,49,0.1);border:1px solid rgba(247,183,49,0.2);color:var(--accent3);border-radius:20px;padding:4px 12px">✨ AI評価</span>
        </div>
      </div>

      <!-- Upload card -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
        <div style="padding:16px 22px;border-bottom:1px solid var(--border);font-size:0.88rem;font-weight:700">
          📎 ESをアップロード
        </div>
        <div style="padding:20px 22px;display:flex;flex-direction:column;gap:16px">

          <!-- File drop zone -->
          <div id="drop-zone" style="
            border:2px dashed var(--border);border-radius:12px;
            padding:32px 20px;text-align:center;cursor:pointer;
            transition:all 0.2s;color:var(--text-sub)
          "
            onclick="document.getElementById('es-file-input').click()"
            ondragover="handleDragOver(event)"
            ondragleave="handleDragLeave(event)"
            ondrop="handleDrop(event)"
          >
            <div style="font-size:2rem;margin-bottom:8px">📄</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);margin-bottom:4px">
              クリックまたはドラッグ＆ドロップ
            </div>
            <div style="font-size:0.75rem">.pdf / .txt 対応</div>
          </div>
          <input type="file" id="es-file-input" accept=".pdf,.txt" style="display:none" onchange="handleFileSelect(event)">

          <!-- Divider -->
          <div style="display:flex;align-items:center;gap:10px;color:var(--text-sub);font-size:0.75rem">
            <div style="flex:1;height:1px;background:var(--border)"></div>
            または直接貼り付け
            <div style="flex:1;height:1px;background:var(--border)"></div>
          </div>

          <!-- Paste area -->
          <div>
            <div style="font-size:0.72rem;color:var(--text-sub);margin-bottom:6px;font-weight:600">ESの内容を貼り付け</div>
            <textarea id="es-paste-input" style="
              width:100%;min-height:160px;
              background:var(--surface2);border:1px solid var(--border);border-radius:10px;
              color:var(--text);font-size:0.83rem;font-family:inherit;
              padding:12px 14px;line-height:1.7;resize:vertical;outline:none;
              transition:border-color 0.2s
            "
              placeholder="自己PR、志望動機、学生時代に力を入れたことなど、ESの内容をそのまま貼り付けてください..."
              oninput="onEsPasteInput()"
              onfocus="this.style.borderColor='var(--accent2)'"
              onblur="this.style.borderColor='var(--border)'"
            ></textarea>
            <div id="es-char-count" style="font-size:0.7rem;color:var(--text-sub);margin-top:4px;text-align:right">0文字</div>
          </div>

          <button id="btn-analyze-es" onclick="analyzeES()" disabled style="
            display:flex;align-items:center;justify-content:center;gap:8px;
            background:linear-gradient(135deg,var(--accent2),var(--accent));
            border:none;border-radius:10px;color:#fff;
            font-size:0.88rem;font-weight:700;padding:12px;
            cursor:not-allowed;opacity:0.4;font-family:inherit;
            transition:opacity 0.2s
          ">
            ✨ ESを分析して質問を生成する
          </button>
        </div>
      </div>

    </div>
  `;
}

function onEsPasteInput() {
  const val = document.getElementById('es-paste-input')?.value || '';
  document.getElementById('es-char-count').textContent = `${val.length}文字`;
  const btn = document.getElementById('btn-analyze-es');
  if (btn) {
    const hasContent = val.trim().length > 30;
    btn.disabled = !hasContent;
    btn.style.opacity = hasContent ? '1' : '0.4';
    btn.style.cursor  = hasContent ? 'pointer' : 'not-allowed';
  }
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('drop-zone').style.borderColor = 'var(--accent2)';
  document.getElementById('drop-zone').style.background  = 'rgba(108,99,255,0.05)';
}

function handleDragLeave() {
  document.getElementById('drop-zone').style.borderColor = 'var(--border)';
  document.getElementById('drop-zone').style.background  = '';
}

function handleDrop(e) {
  e.preventDefault();
  handleDragLeave();
  const file = e.dataTransfer?.files?.[0];
  if (file) readFile(file);
}

function handleFileSelect(e) {
  const file = e.target?.files?.[0];
  if (file) readFile(file);
}

async function readFile(file) {
  const dropZone = document.getElementById('drop-zone');
  dropZone.innerHTML = `
    <div class="spinner" style="margin:0 auto 8px"></div>
    <div style="font-size:0.82rem;color:var(--text-sub)">読み込み中...</div>
  `;

  try {
    let text = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      text = await readPDF(file);
    } else {
      text = await readText(file);
    }

    document.getElementById('es-paste-input').value = text;
    onEsPasteInput();
    dropZone.innerHTML = `
      <div style="font-size:1.8rem;margin-bottom:6px">✅</div>
      <div style="font-size:0.85rem;font-weight:600;color:var(--accent)">${file.name}</div>
      <div style="font-size:0.72rem;color:var(--text-sub);margin-top:4px">${text.length}文字読み込みました</div>
    `;
  } catch (e) {
    dropZone.innerHTML = `
      <div style="font-size:1.8rem;margin-bottom:6px">❌</div>
      <div style="font-size:0.82rem;color:var(--accent4)">読み込みエラー: ${e.message}</div>
      <div style="font-size:0.72rem;color:var(--text-sub);margin-top:4px">クリックして再試行</div>
    `;
    dropZone.onclick = () => document.getElementById('es-file-input').click();
  }
}

function readText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsText(file, 'UTF-8');
  });
}

async function readPDF(file) {
  // Load PDF.js from CDN dynamically
  const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  if (!fullText.trim()) {
    throw new Error('PDFからテキストを抽出できませんでした（スキャン画像のPDFは非対応です）');
  }

  return fullText.trim();
}

// ─────────────────────────────────────
// Step 2: Analyze ES and generate questions
// ─────────────────────────────────────

async function analyzeES() {
  const pasteEl = document.getElementById('es-paste-input');
  esContent = pasteEl?.value.trim() || '';
  if (!esContent || esContent.length < 30) return;

  const btn = document.getElementById('btn-analyze-es');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div> 分析中...';

  const p = JSON.parse(localStorage.getItem('user_profile') || '{}');

  const prompt = `あなたはIT企業の二次面接の面接官です。
以下の応募者のESを読んで、ES内容に基づいた面接質問を6つ生成してください。

応募者：${p.name || '就活生'} / ${p.status || '学生'}

【ES内容】
${esContent}

以下の形式で、必ず6つの質問を出力してください：

[Q1]
（ES内の自己PRや強みに関連した深堀り質問）

[Q2]
（ES内の学生時代の経験・エピソードへの深堀り）

[Q3]
（ES内の志望動機に関連した質問）

[Q4]
（困難な経験・克服方法に関する質問）

[Q5]
（チームワーク・リーダーシップに関する質問）

[Q6]
（入社後のビジョン・キャリアプランに関する質問）

各質問は自然な日本語で、面接官らしい丁寧な口調で書いてください。`.trim();

  try {
    const text = await geminiRequest2(prompt, 1024);

    // Parse questions
    i2Questions = [];
    const regex = /\[Q(\d+)\]\s*([\s\S]*?)(?=\[Q\d+\]|$)/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      const q = m[2].trim();
      if (q) i2Questions.push(q);
    }

    if (i2Questions.length === 0) throw new Error('質問の生成に失敗しました');

    i2Index  = 0;
    i2Answers = {};
    renderStep2();

  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = '✨ ESを分析して質問を生成する';
    const wrap = document.getElementById('interview2-wrap');
    const msg = e.message === 'RATE_LIMIT'
      ? '⚠️ リクエストが集中しています。少し待ってから再試行してください。'
      : e.message === 'SERVER_ERROR'
      ? '⚠️ AIサーバーが混雑しています。しばらく待ってから再試行してください。'
      : `⚠️ エラー: ${e.message}`;
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'color:var(--accent4);font-size:0.83rem;margin-top:12px;padding:12px 16px;background:rgba(252,92,101,0.08);border-radius:8px;display:flex;align-items:center;gap:12px';
    errDiv.innerHTML = `<span>${msg}</span><button onclick="analyzeES()" style="background:var(--accent4);border:none;border-radius:8px;color:#fff;font-size:0.78rem;padding:6px 14px;cursor:pointer;font-family:inherit;flex-shrink:0">再試行</button>`;
    wrap.appendChild(errDiv);
  }
}

// ─────────────────────────────────────
// Step 2: Voice interview
// ─────────────────────────────────────

function renderStep2() {
  const wrap = document.getElementById('interview2-wrap');
  const total = i2Questions.length;
  const q     = i2Questions[i2Index];

  // Progress
  const steps = i2Questions.map((_, i) => {
    const cls = i < i2Index ? 'done' : i === i2Index ? 'current' : '';
    return `<div class="progress-step ${cls}"></div>`;
  }).join('');

  // Check speech support
  const hasSpeech = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  const hasTTS    = 'speechSynthesis' in window;

  wrap.innerHTML = `
    <!-- Progress -->
    <div class="interview-progress" style="margin-bottom:16px">
      <div class="progress-steps">${steps}</div>
      <span class="progress-label">${i2Index + 1} / ${total}</span>
    </div>

    <!-- Question card -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:16px">

      <div style="padding:14px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
        <span style="font-size:0.65rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.2);color:var(--accent2);border-radius:6px;padding:3px 9px">
          🎙️ 質問 ${i2Index + 1}
        </span>
        ${hasTTS ? `
        <button onclick="speakQuestion()" style="
          display:flex;align-items:center;gap:6px;
          background:var(--surface2);border:1px solid var(--border);
          border-radius:8px;color:var(--text-sub);
          font-size:0.72rem;padding:5px 12px;cursor:pointer;
          font-family:inherit;transition:all 0.2s
        " onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          🔊 読み上げ
        </button>` : ''}
        <button onclick="resetToStep1()" style="
          margin-left:auto;
          background:transparent;border:1px solid var(--border);
          border-radius:8px;color:var(--text-sub);
          font-size:0.72rem;padding:5px 12px;cursor:pointer;
          font-family:inherit;transition:all 0.2s
        " onmouseover="this.style.borderColor='var(--accent4)';this.style.color='var(--accent4)'"
           onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-sub)'">
          ← ESを変更
        </button>
      </div>

      <div style="padding:20px 22px">
        <div style="font-size:1rem;font-weight:700;line-height:1.6;margin-bottom:6px">${q}</div>
        <div style="font-size:0.75rem;color:var(--text-sub)">ESの内容をもとにした質問です。具体的なエピソードを交えて回答しましょう。</div>
      </div>

      <!-- Voice / Text answer -->
      <div style="padding:0 22px 20px">
        <div style="font-size:0.72rem;font-weight:700;color:var(--text-sub);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">
          あなたの回答
        </div>

        <!-- Voice mode -->
        ${hasSpeech ? `
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <button id="btn-voice" onclick="toggleVoice()" style="
            display:flex;align-items:center;gap:8px;
            background:var(--surface2);border:2px solid var(--border);
            border-radius:10px;color:var(--text);
            font-size:0.83rem;font-weight:600;padding:10px 18px;
            cursor:pointer;font-family:inherit;transition:all 0.2s;flex:1
          ">
            🎤 マイクで回答する
          </button>
        </div>
        <div id="voice-status" style="font-size:0.75rem;color:var(--text-sub);margin-bottom:8px;min-height:18px"></div>
        ` : `
        <div style="font-size:0.75rem;color:var(--accent3);margin-bottom:10px;padding:8px 12px;background:rgba(247,183,49,0.08);border-radius:8px">
          ⚠️ お使いのブラウザは音声認識に対応していません。テキストで回答してください。
        </div>
        `}

        <textarea id="i2-answer-input" style="
          width:100%;min-height:120px;
          background:var(--surface2);border:1px solid var(--border);border-radius:10px;
          color:var(--text);font-size:0.85rem;font-family:inherit;
          padding:12px 14px;line-height:1.7;resize:vertical;outline:none;
          transition:border-color 0.2s
        "
          placeholder="音声認識の結果がここに表示されます。直接入力することもできます..."
          onfocus="this.style.borderColor='var(--accent2)'"
          onblur="this.style.borderColor='var(--border)'"
        ></textarea>

        <div style="display:flex;justify-content:flex-end;margin-top:12px">
          <button onclick="evaluateI2Answer()" id="btn-i2-evaluate" style="
            display:flex;align-items:center;gap:8px;
            background:linear-gradient(135deg,var(--accent2),var(--accent));
            border:none;border-radius:10px;color:#fff;
            font-size:0.88rem;font-weight:700;padding:10px 22px;
            cursor:pointer;font-family:inherit;transition:opacity 0.2s
          ">
            ✨ AIに評価してもらう
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <div id="i2-feedback-area"></div>

    <!-- Nav -->
    <div id="i2-nav" style="display:none;justify-content:flex-end;gap:10px;margin-top:4px">
      ${i2Index > 0 ? `<button class="btn-next" onclick="i2Prev()">← 前の質問</button>` : ''}
      <button class="btn-next primary" onclick="i2Next()">
        ${i2Index < total - 1 ? '次の質問 →' : '🎉 完了'}
      </button>
    </div>
  `;

  // Auto-restore saved answer
  const saved = i2Answers[i2Index];
  if (saved) {
    document.getElementById('i2-answer-input').value = saved.answer || '';
    if (saved.feedback) renderI2Feedback(saved.feedback);
  }
}

// ─────────────────────────────────────
// Text-to-Speech
// ─────────────────────────────────────

function speakQuestion() {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const q   = i2Questions[i2Index];
  const utt = new SpeechSynthesisUtterance(q);
  utt.lang  = 'ja-JP';
  utt.rate  = 0.9;
  utt.pitch = 1.0;

  // Try to pick a Japanese voice
  const voices = speechSynthesis.getVoices();
  const jaVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jaVoice) utt.voice = jaVoice;

  speechSynthesis.speak(utt);
}

// ─────────────────────────────────────
// Speech Recognition
// ─────────────────────────────────────

function toggleVoice() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.lang           = 'ja-JP';
  recognition.continuous     = true;
  recognition.interimResults = true;

  const btn    = document.getElementById('btn-voice');
  const status = document.getElementById('voice-status');
  const input  = document.getElementById('i2-answer-input');

  recognition.onstart = () => {
    isListening = true;
    btn.style.borderColor = 'var(--accent4)';
    btn.style.color       = 'var(--accent4)';
    btn.innerHTML = '⏹️ 録音を停止する';
    if (status) status.textContent = '🔴 録音中... 話してください';
    interimText = input.value;
  };

  recognition.onresult = (e) => {
    let interim = '';
    let final   = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        final += e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    if (final) interimText += final;
    input.value = interimText + interim;
  };

  recognition.onerror = (e) => {
    if (e.error === 'no-speech') return;
    if (status) status.textContent = `⚠️ エラー: ${e.error}`;
    stopListening();
  };

  recognition.onend = () => {
    if (isListening) stopListening();
  };

  recognition.start();
}

function stopListening() {
  isListening = false;
  if (recognition) recognition.stop();

  const btn    = document.getElementById('btn-voice');
  const status = document.getElementById('voice-status');
  if (btn) {
    btn.style.borderColor = 'var(--border)';
    btn.style.color       = 'var(--text)';
    btn.innerHTML = '🎤 マイクで回答する';
  }
  if (status) status.textContent = '✅ 録音完了。内容を確認して評価ボタンを押してください。';
}

// ─────────────────────────────────────
// Evaluate answer (same as round 1 but ES-aware)
// ─────────────────────────────────────

async function evaluateI2Answer() {
  const answer = document.getElementById('i2-answer-input')?.value.trim();
  if (!answer) { alert('回答を入力してください。'); return; }

  const btn = document.getElementById('btn-i2-evaluate');
  btn.disabled = true;
  btn.textContent = '評価中...';

  document.getElementById('i2-feedback-area').innerHTML = `
    <div class="feedback-card">
      <div class="fb-loading"><div class="spinner"></div><span>AIが回答を評価中...</span></div>
    </div>`;

  const q = i2Questions[i2Index];
  const p = JSON.parse(localStorage.getItem('user_profile') || '{}');

  const prompt = `あなたはIT企業の二次面接の面接官コーチです。

【ES内容（抜粋）】
${esContent.slice(0, 600)}

【質問】${q}
【応募者】${p.name || '就活生'} / ${p.status || '学生'}
【回答】
${answer}

以下の4ブロックを必ず全て出力してください：

[総合評価]
10点満点で次の3軸のスコア：
- ES内容との整合性：X/10
- 回答の具体性：X/10
- 日本語の自然さ：X/10
一言コメント（1〜2文）。

[良かった点]
ESの内容と照らし合わせて評価できる点を2〜3つ。

[改善ポイント]
より説得力を高めるための具体的なアドバイスを2〜3つ。

[改善版サンプル]
ESの内容を活かした、より良い回答例（200字程度）。`.trim();

  try {
    const text = await geminiRequest2(prompt, 2048);

    const feedback = parseI2Feedback(text);
    i2Answers[i2Index] = { answer, feedback };
    renderI2Feedback(feedback);
    document.getElementById('i2-nav').style.display = 'flex';

  } catch (e) {
    const msg = e.message === 'RATE_LIMIT'
      ? 'リクエストが集中しています。少し待ってから再試行してください。'
      : e.message === 'SERVER_ERROR'
      ? 'AIサーバーが混雑しています。しばらく待ってから再試行してください。'
      : e.message;
    document.getElementById('i2-feedback-area').innerHTML = `
      <div style="color:var(--accent4);padding:16px 20px;background:rgba(252,92,101,0.08);border-radius:12px;display:flex;align-items:center;gap:12px">
        <span style="font-size:0.85rem">⚠️ ${msg}</span>
        <button onclick="evaluateI2Answer()" style="background:var(--accent4);border:none;border-radius:8px;color:#fff;font-size:0.78rem;padding:6px 14px;cursor:pointer;font-family:inherit;flex-shrink:0">再試行</button>
      </div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ AIに評価してもらう';
  }
}

function parseI2Feedback(text) {
  const blocks = {};
  const regex  = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    blocks[m[1].trim()] = m[2].trim();
  }
  return blocks;
}

function renderI2Feedback(feedback) {
  const area = document.getElementById('i2-feedback-area');

  const totalText = feedback['総合評価'] || '';
  function extractS(label) {
    const m = totalText.match(new RegExp(label + '[：:]*\\s*(\\d+)/10'));
    return m ? parseInt(m[1]) : null;
  }
  const s1 = extractS('ES内容との整合性');
  const s2 = extractS('回答の具体性');
  const s3 = extractS('日本語の自然さ');

  function sc(s) {
    if (!s) return 'var(--text-sub)';
    return s >= 8 ? '#48cfad' : s >= 6 ? '#f7b731' : '#fc5c65';
  }
  function bar(s) {
    return s !== null ? `<div class="score-bar"><div class="score-bar-fill" style="width:${s*10}%;background:${sc(s)}"></div></div>` : '';
  }
  const comment = totalText
    .replace(/[-・]?\s*ES内容との整合性[：:][^\n]*/g, '')
    .replace(/[-・]?\s*回答の具体性[：:][^\n]*/g, '')
    .replace(/[-・]?\s*日本語の自然さ[：:][^\n]*/g, '')
    .trim();

  function toList(text) {
    if (!text) return '<p style="color:var(--text-sub)">—</p>';
    return text.split('\n').filter(l => l.trim())
      .map(l => l.replace(/^[-・\d\.]\s*/, ''))
      .filter(l => l)
      .map(l => `<div style="display:flex;gap:8px;margin-bottom:6px"><span style="flex-shrink:0">▸</span><span>${l}</span></div>`)
      .join('');
  }

  area.innerHTML = `
    <div class="feedback-card">
      <div class="feedback-header">
        <span>📊 AIフィードバック</span>
        <span class="ai-badge">Gemini AI</span>
      </div>
      <div class="feedback-score-row">
        <div class="score-item">
          <div class="score-label">ES整合性</div>
          <div class="score-value" style="color:${sc(s1)}">${s1 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
          ${bar(s1)}
        </div>
        <div class="score-item">
          <div class="score-label">具体性</div>
          <div class="score-value" style="color:${sc(s2)}">${s2 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
          ${bar(s2)}
        </div>
        <div class="score-item">
          <div class="score-label">日本語</div>
          <div class="score-value" style="color:${sc(s3)}">${s3 ?? '—'}<span style="font-size:0.8rem;color:var(--text-sub)">/10</span></div>
          ${bar(s3)}
        </div>
      </div>
      <div class="feedback-body">
        ${comment ? `<div class="fb-block"><div class="fb-block-header" style="color:#f7b731">💬 <span>総合コメント</span></div><div class="fb-block-body">${comment}</div></div>` : ''}
        <div class="fb-block"><div class="fb-block-header" style="color:#48cfad">✅ <span>良かった点</span></div><div class="fb-block-body">${toList(feedback['良かった点'])}</div></div>
        <div class="fb-block"><div class="fb-block-header" style="color:#fc5c65">🔧 <span>改善ポイント</span></div><div class="fb-block-body">${toList(feedback['改善ポイント'])}</div></div>
        ${feedback['改善版サンプル'] ? `<div class="fb-block"><div class="fb-block-header" style="color:#6c63ff">✨ <span>改善版サンプル</span></div><div class="fb-block-body"><div class="improved-text">${feedback['改善版サンプル']}</div></div></div>` : ''}
      </div>
    </div>
  `;

  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─────────────────────────────────────
// Navigation
// ─────────────────────────────────────

function i2Next() {
  // Save current answer text
  const input = document.getElementById('i2-answer-input');
  if (input) {
    i2Answers[i2Index] = i2Answers[i2Index] || {};
    i2Answers[i2Index].answer = input.value;
  }
  if (isListening) stopListening();
  speechSynthesis?.cancel();

  i2Index++;
  if (i2Index >= i2Questions.length) {
    renderI2Complete();
  } else {
    renderStep2();
    document.getElementById('interview2-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function i2Prev() {
  const input = document.getElementById('i2-answer-input');
  if (input) {
    i2Answers[i2Index] = i2Answers[i2Index] || {};
    i2Answers[i2Index].answer = input.value;
  }
  if (isListening) stopListening();
  speechSynthesis?.cancel();

  if (i2Index > 0) {
    i2Index--;
    renderStep2();
    document.getElementById('interview2-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function resetToStep1() {
  if (isListening) stopListening();
  speechSynthesis?.cancel();
  i2Questions = [];
  i2Index     = 0;
  i2Answers   = {};
  esContent   = '';
  renderStep1();
}

// ─────────────────────────────────────
// Complete screen
// ─────────────────────────────────────

function renderI2Complete() {
  const evaluated = Object.values(i2Answers).filter(a => a.feedback).length;
  document.getElementById('interview2-wrap').innerHTML = `
    <div class="complete-card">
      <div class="complete-icon">🎉</div>
      <h2>二次面接シミュレーション完了！</h2>
      <p>
        ${i2Questions.length}問中 <strong style="color:var(--accent)">${evaluated}問</strong> のAI評価を受けました。<br>
        ESの内容と回答の一致度を確認し、本番に備えましょう。
      </p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn-restart" onclick="i2Index=0;renderStep2()">🔄 もう一度練習する</button>
        <button class="btn-restart" style="background:var(--surface);border:1px solid var(--border);color:var(--text)" onclick="resetToStep1()">📄 ESを変更する</button>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────
// Expose to window
// ─────────────────────────────────────

window.initInterview2       = initInterview2;
window.onEsPasteInput       = onEsPasteInput;
window.handleDragOver       = handleDragOver;
window.handleDragLeave      = handleDragLeave;
window.handleDrop           = handleDrop;
window.handleFileSelect     = handleFileSelect;
window.analyzeES            = analyzeES;
window.speakQuestion        = speakQuestion;
window.toggleVoice          = toggleVoice;
window.evaluateI2Answer     = evaluateI2Answer;
window.i2Next               = i2Next;
window.i2Prev               = i2Prev;
window.resetToStep1         = resetToStep1;
