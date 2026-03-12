import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { ref, get, set, update, onValue } from "firebase/database";

// ── 메인 페이지 기본 내용 ─────────────────────────────────────────────────────
const INTRO_DEFAULT = {
  eyebrow: "복지 서비스 욕구조사",
  title: "안녕하세요,\n여러분의 이야기를\n들을게요 🌿",
  subtitle: "몇 가지 간단한 질문에 답해주시면\n더 나은 서비스를 제공하는 데 큰 도움이 됩니다.\n소요 시간은 약 3~5분입니다.",
  badge1: "익명 보장",
  badge2: "즉시 결과",
  btnText: "설문 참여하기",
};

// ── 회사 정보 ─────────────────────────────────────────────────────────────────
const COMPANY_DEFAULT = {
  name: "따뜻한복지센터",
  tagline: "당신 곁에 함께하는 사회복지 서비스",
  description:
    "저희 센터는 지역사회 구성원 모두가 존엄하고 행복한 삶을 누릴 수 있도록 맞춤형 복지 서비스를 제공합니다. 어려운 상황에 처한 분들께 언제나 열려 있습니다.",
  features: [
    { icon: "🤝", title: "생활 지원", desc: "일상생활 지원 · 돌봄 서비스" },
    { icon: "💛", title: "상담 서비스", desc: "심리상담 · 가족상담 · 위기개입" },
    { icon: "🌿", title: "자립 지원", desc: "취업연계 · 주거지원 · 교육" },
    { icon: "👨‍👩‍👧", title: "지역 연계", desc: "주민 모임 · 커뮤니티 프로그램" },
  ],
  cta: "서비스 신청 / 문의하기",
  contact: "📞 1234-5678  |  welfare@center.or.kr",
};

// ── 기본 설문 문항 ─────────────────────────────────────────────────────────────
const QUESTIONS_DEFAULT = [
  {
    id: 1,
    type: "single",
    question: "현재 가장 필요하다고 느끼는 지원은 무엇인가요?",
    options: ["생활비·경제적 지원", "돌봄·의료 서비스", "심리·정서 지원", "취업·자립 지원"],
  },
  {
    id: 2,
    type: "multiple",
    question: "현재 어떤 어려움을 겪고 계신가요? (해당 항목 모두 선택)",
    options: ["경제적 어려움", "건강 문제", "고립감·외로움", "주거 불안", "양육·돌봄 부담", "취업·실직 문제"],
  },
  {
    id: 3,
    type: "single",
    question: "복지 서비스를 이용해보신 경험이 있으신가요?",
    options: ["있다 — 도움이 됐다", "있다 — 아쉬웠다", "없다 — 이용하고 싶다", "없다 — 잘 모르겠다"],
  },
  {
    id: 4,
    type: "text",
    question: "현재 상황이나 바라는 점을 자유롭게 적어주세요.",
    placeholder: "예: 혼자 생활하는데 가끔 도움이 필요합니다...",
  },
  {
    id: 5,
    type: "single",
    question: "센터 서비스를 알게 된 경로는 어디인가요?",
    options: ["지인 소개", "인터넷 검색", "주민센터 안내", "현수막·홍보물"],
  },
];

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Pretendard:wght@300;400;500;600&display=swap');

  :root {
    --bg:       #fdf6ee;
    --surface:  #fff9f3;
    --surface2: #fdeee0;
    --border:   #e8d5c0;
    --border2:  #f0e0cc;
    --terra:    #c8652a;
    --terra-l:  #e07a3a;
    --terra-bg: rgba(200,101,42,0.08);
    --sage:     #6b8f71;
    --sage-l:   #8aac90;
    --text:     #2d1f14;
    --muted:    #9c7c62;
    --muted2:   #c4a98a;
    --shadow:   0 4px 32px rgba(180,120,60,0.10);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 60% at 10% 0%, rgba(212,149,42,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 90% 100%, rgba(200,101,42,0.08) 0%, transparent 60%);
    color: var(--text);
    font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 24px;
    padding: 52px 48px;
    max-width: 660px;
    width: 100%;
    box-shadow: var(--shadow);
    position: relative;
    animation: fadeUp .45s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--terra);
    font-weight: 600;
    margin-bottom: 14px;
  }
  h1 {
    font-family: 'Gowun Batang', serif;
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 700;
    line-height: 1.25;
    color: var(--text);
    margin-bottom: 16px;
  }
  h2 {
    font-family: 'Gowun Batang', serif;
    font-size: clamp(19px, 3vw, 26px);
    font-weight: 700;
    color: var(--text);
    line-height: 1.4;
    margin-bottom: 28px;
  }
  .subtitle {
    color: var(--muted);
    font-size: 15px;
    line-height: 1.8;
    margin-bottom: 36px;
    font-weight: 300;
  }

  .progress-wrap { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
  .progress-dots { display: flex; gap: 7px; flex: 1; }
  .dot { flex: 1; height: 4px; border-radius: 4px; background: var(--border); transition: background .35s; }
  .dot.done { background: var(--terra); }
  .dot.active { background: var(--terra-l); }
  .progress-label { font-size: 12px; color: var(--muted2); white-space: nowrap; }

  .options { display: flex; flex-direction: column; gap: 9px; margin-bottom: 32px; }
  .opt {
    display: flex; align-items: center; gap: 14px;
    padding: 15px 20px;
    border: 1.5px solid var(--border);
    border-radius: 14px;
    background: transparent;
    cursor: pointer; text-align: left;
    color: var(--text); font-family: inherit; font-size: 14.5px; font-weight: 400;
    transition: all .2s; line-height: 1.4;
  }
  .opt:hover { border-color: var(--terra-l); background: var(--terra-bg); }
  .opt.sel { border-color: var(--terra); background: var(--terra-bg); color: var(--terra); font-weight: 500; }

  .radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .2s; }
  .opt.sel .radio { border-color: var(--terra); background: var(--terra); }
  .radio-inner { width: 7px; height: 7px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity .2s; }
  .opt.sel .radio-inner { opacity: 1; }

  .checkbox { width: 20px; height: 20px; border-radius: 6px; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .2s; }
  .opt.sel .checkbox { border-color: var(--terra); background: var(--terra); }

  textarea {
    width: 100%; background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 18px 20px; color: var(--text); font-family: inherit;
    font-size: 14px; font-weight: 300; line-height: 1.8; resize: none; height: 130px;
    outline: none; transition: border-color .2s; margin-bottom: 32px;
  }
  textarea:focus { border-color: var(--terra); }
  textarea::placeholder { color: var(--muted2); }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 50px; font-family: inherit;
    font-size: 14.5px; font-weight: 500; cursor: pointer; transition: all .2s; border: none;
  }
  .btn-primary { background: var(--terra); color: #fff; box-shadow: 0 4px 20px rgba(200,101,42,.22); }
  .btn-primary:hover { background: var(--terra-l); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(200,101,42,.3); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1.5px solid var(--border); }
  .btn-ghost:hover { border-color: var(--muted); color: var(--text); }
  .btn-sage { background: var(--sage); color: #fff; box-shadow: 0 4px 20px rgba(107,143,113,.2); }
  .btn-sage:hover { background: var(--sage-l); transform: translateY(-1px); }

  .btn-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .result-block { margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid var(--border2); }
  .result-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .result-q-no { font-size: 11px; color: var(--terra); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .result-q-text { font-family: 'Gowun Batang', serif; font-size: 17px; color: var(--text); margin-bottom: 16px; font-weight: 700; line-height: 1.45; }
  .bar-row { margin-bottom: 9px; }
  .bar-meta { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin-bottom: 4px; }
  .bar-meta.mine { color: var(--terra); font-weight: 500; }
  .bar-track { height: 7px; background: var(--border); border-radius: 6px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 6px; background: var(--terra-l); transition: width .9s cubic-bezier(.16,1,.3,1); }
  .bar-fill.mine { background: var(--terra); }
  .text-bubble { background: var(--surface2); border-left: 3px solid var(--terra); border-radius: 0 12px 12px 0; padding: 16px 18px; font-size: 14px; color: var(--text); line-height: 1.8; font-style: italic; }

  .co-header { text-align: center; margin-bottom: 32px; }
  .co-name { font-family: 'Gowun Batang', serif; font-size: 36px; font-weight: 700; color: var(--terra); margin-bottom: 6px; }
  .co-tag { font-size: 13px; color: var(--muted); letter-spacing: .5px; }
  .feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
  .feat-card { background: var(--surface2); border: 1px solid var(--border2); border-radius: 16px; padding: 18px 18px 16px; transition: box-shadow .2s; }
  .feat-card:hover { box-shadow: var(--shadow); }
  .feat-icon { font-size: 22px; margin-bottom: 8px; }
  .feat-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .feat-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .cta-wrap { background: linear-gradient(135deg, #fdeee0, #fdf4e8); border: 1.5px solid var(--terra); border-radius: 18px; padding: 28px 24px; text-align: center; }
  .cta-contact { font-size: 13px; color: var(--muted); margin-top: 14px; line-height: 1.8; }

  .divider { height: 1px; background: var(--border2); margin: 24px 0; }
  .hint { font-size: 12px; color: var(--muted2); margin-top: -16px; margin-bottom: 20px; }

  .admin-btn { position: absolute; top: 20px; right: 20px; padding: 8px 14px; border-radius: 50px; font-size: 12px; font-weight: 500; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all .2s; font-family: inherit; }
  .admin-btn:hover { border-color: var(--terra); color: var(--terra); }

  .edit-section { margin-bottom: 28px; }
  .edit-q-card { background: var(--surface2); border: 1px solid var(--border2); border-radius: 16px; padding: 20px 20px 16px; margin-bottom: 14px; position: relative; }
  .edit-field { width: 100%; background: var(--surface); border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 14px; color: var(--text); font-family: inherit; font-size: 13.5px; outline: none; transition: border-color .2s; margin-bottom: 8px; resize: none; }
  .edit-field:focus { border-color: var(--terra); }
  .edit-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; margin-top: 12px; }
  .type-select { background: var(--surface); border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 14px; color: var(--text); font-family: inherit; font-size: 13px; outline: none; margin-bottom: 10px; width: 100%; cursor: pointer; }
  .type-select:focus { border-color: var(--terra); }
  .opt-input-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .opt-input { flex: 1; background: var(--surface); border: 1.5px solid var(--border); border-radius: 8px; padding: 9px 12px; color: var(--text); font-family: inherit; font-size: 13px; outline: none; transition: border-color .2s; }
  .opt-input:focus { border-color: var(--terra); }
  .icon-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 14px; transition: all .2s; flex-shrink: 0; }
  .icon-btn:hover.del { background: #fde8e8; border-color: #e07070; color: #c04040; }
  .del-q-btn { position: absolute; top: 14px; right: 14px; padding: 5px 12px; border-radius: 50px; font-size: 11px; font-weight: 500; background: transparent; border: 1px solid var(--border); color: var(--muted); cursor: pointer; font-family: inherit; transition: all .2s; }
  .del-q-btn:hover { background: #fde8e8; border-color: #e07070; color: #c04040; }
  .q-num { font-size: 11px; font-weight: 600; color: var(--terra); letter-spacing: 1.5px; margin-bottom: 10px; }

  .loading { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 14px; padding: 20px 0; }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--terra); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .section-title { font-size: 13px; font-weight: 600; color: var(--terra); margin-bottom: 12px; letter-spacing: 1px; }

  @media (max-width: 560px) {
    .card { padding: 36px 22px; }
    .feat-grid { grid-template-columns: 1fr; }
  }
`;

// ── Icons ──────────────────────────────────────────────────────────────────────
const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Check = () => (
  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
    <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Firebase helpers ───────────────────────────────────────────────────────────
const fbGet = async (path, fallback) => {
  try {
    const snap = await get(ref(db, path));
    return snap.exists() ? snap.val() : fallback;
  } catch { return fallback; }
};
const fbSet = async (path, val) => {
  try { await set(ref(db, path), val); } catch (e) { console.error("FB write error:", e); }
};

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase]         = useState("loading");
  const [step, setStep]           = useState(0);
  const [answers, setAnswers]     = useState({});
  const [allResp, setAllResp]     = useState({});
  const [barW, setBarW]           = useState({});
  const [questions, setQuestions] = useState(QUESTIONS_DEFAULT);
  const [company, setCompany]     = useState(COMPANY_DEFAULT);
  const [intro, setIntro]         = useState(INTRO_DEFAULT);
  const [editQ, setEditQ]         = useState(null);
  const [editCo, setEditCo]       = useState(null);
  const [editIntro, setEditIntro] = useState(null);
  const cardRef = useRef(null);

  const q     = questions[step];
  const total = questions.length;

  // ── 초기 데이터 로드 ──
  useEffect(() => {
    (async () => {
      const [loadedQ, loadedCo, loadedIntro, loadedResp] = await Promise.all([
        fbGet("config/questions", QUESTIONS_DEFAULT),
        fbGet("config/company",   COMPANY_DEFAULT),
        fbGet("config/intro",     INTRO_DEFAULT),
        fbGet("responses",        {}),
      ]);
      setQuestions(loadedQ);
      setCompany(loadedCo);
      setIntro(loadedIntro);
      setAllResp(loadedResp);
      setPhase("intro");
    })();
  }, []);

  // ── 응답 실시간 구독 (결과 페이지에서 최신 통계 반영) ──
  useEffect(() => {
    if (phase !== "results") return;
    const unsub = onValue(ref(db, "responses"), (snap) => {
      if (snap.exists()) {
        setAllResp(snap.val());
        setBarW(calcBars(snap.val(), questions));
      }
    });
    return () => unsub();
  }, [phase]);

  const animate = () => {
    if (!cardRef.current) return;
    cardRef.current.style.animation = "none";
    void cardRef.current.offsetHeight;
    cardRef.current.style.animation = "fadeUp .4s cubic-bezier(.16,1,.3,1) both";
  };
  const go = (p) => { setPhase(p); animate(); };

  // ── Survey 핸들러 ──
  const setSingle   = (opt) => setAnswers(p => ({ ...p, [q.id]: opt }));
  const setMultiple = (opt) => setAnswers(p => {
    const cur = p[q.id] || [];
    return { ...p, [q.id]: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] };
  });
  const setText = (v) => setAnswers(p => ({ ...p, [q.id]: v }));

  const canNext = () => {
    const a = answers[q?.id];
    if (!q) return false;
    if (q.type === "single")   return !!a;
    if (q.type === "multiple") return a && a.length > 0;
    if (q.type === "text")     return a && a.trim().length > 0;
    return false;
  };

  const calcBars = (resp, qs) => {
    const w = {};
    qs.forEach(question => {
      if (question.type === "text") return;
      const data = resp[question.id] || {};
      const tot  = Object.values(data).reduce((a, b) => a + b, 0);
      w[question.id] = {};
      (question.options || []).forEach(opt => {
        w[question.id][opt] = tot > 0 ? Math.round(((data[opt] || 0) / tot) * 100) : 0;
      });
    });
    return w;
  };

  const saveResponse = async (finalAns) => {
    const updates = {};
    questions.forEach(question => {
      const ans = finalAns[question.id];
      if (!ans || question.type === "text") return;
      const opts = question.type === "multiple" ? ans : [ans];
      const cur = allResp[question.id] || {};
      opts.forEach(o => {
        updates[`responses/${question.id}/${o}`] = (cur[o] || 0) + 1;
      });
    });
    try { await update(ref(db), updates); } catch (e) { console.error("save error:", e); }
  };

  const next = async () => {
    if (step < total - 1) {
      setStep(s => s + 1); animate();
    } else {
      await saveResponse(answers);
      const updated = await fbGet("responses", {});
      setAllResp(updated);
      setBarW(calcBars(updated, questions));
      go("results");
    }
  };
  const prev = () => { if (step > 0) { setStep(s => s - 1); animate(); } };

  // ── Admin ──
  const openAdmin = () => {
    setEditQ(JSON.parse(JSON.stringify(questions)));
    setEditCo(JSON.parse(JSON.stringify(company)));
    setEditIntro(JSON.parse(JSON.stringify(intro)));
    go("admin");
  };
  const updateQ = (idx, field, val) => {
    const qs = [...editQ]; qs[idx] = { ...qs[idx], [field]: val }; setEditQ(qs);
  };
  const updateOpt = (qi, oi, val) => {
    const qs = [...editQ]; const opts = [...qs[qi].options]; opts[oi] = val; qs[qi] = { ...qs[qi], options: opts }; setEditQ(qs);
  };
  const addOpt = (qi) => {
    const qs = [...editQ]; qs[qi] = { ...qs[qi], options: [...(qs[qi].options || []), "새 선택지"] }; setEditQ(qs);
  };
  const delOpt = (qi, oi) => {
    const qs = [...editQ]; qs[qi] = { ...qs[qi], options: qs[qi].options.filter((_, i) => i !== oi) }; setEditQ(qs);
  };
  const changeType = (qi, type) => {
    const qs = [...editQ];
    const base = { id: qs[qi].id, type, question: qs[qi].question, placeholder: qs[qi].placeholder };
    if (type !== "text") base.options = qs[qi].options || ["선택지 1", "선택지 2"];
    qs[qi] = base; setEditQ(qs);
  };
  const addQuestion = () => {
    const newId = Math.max(...editQ.map(q => q.id), 0) + 1;
    setEditQ([...editQ, { id: newId, type: "single", question: "새 질문을 입력하세요", options: ["선택지 1", "선택지 2"] }]);
  };
  const delQuestion = (idx) => { if (editQ.length > 1) setEditQ(editQ.filter((_, i) => i !== idx)); };

  const saveAdmin = async () => {
    await Promise.all([
      fbSet("config/questions", editQ),
      fbSet("config/company",   editCo),
      fbSet("config/intro",     editIntro),
    ]);
    setQuestions(editQ);
    setCompany(editCo);
    setIntro(editIntro);
    go("intro");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="card" ref={cardRef}>

          {/* LOADING */}
          {phase === "loading" && (
            <div className="loading">
              <div className="spinner" />
              <span>잠시만 기다려주세요...</span>
            </div>
          )}

          {/* INTRO */}
          {phase === "intro" && (
            <>
              <button className="admin-btn" onClick={openAdmin}>⚙ 편집</button>
              <div className="eyebrow">{intro.eyebrow}</div>
              <h1>{intro.title.split("\n").map((l, i, a) => <span key={i}>{l}{i < a.length-1 && <br/>}</span>)}</h1>
              <p className="subtitle">
                {intro.subtitle.split("\n").map((l, i, a) => <span key={i}>{l}{i < a.length-1 && <br/>}</span>)}
              </p>
              <div style={{ display: "flex", gap: "28px", marginBottom: "36px" }}>
                {[`${total}문항`, intro.badge1, intro.badge2].map(t => (
                  <div key={t} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--terra)" }}>{t.split(" ")[0]}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>{t.split(" ").slice(1).join(" ")}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => { setAnswers({}); setStep(0); go("survey"); }}>
                {intro.btnText} <Arrow />
              </button>
            </>
          )}

          {/* SURVEY */}
          {phase === "survey" && q && (
            <>
              <div className="progress-wrap">
                <div className="progress-dots">
                  {questions.map((_, i) => <div key={i} className={`dot ${i < step ? "done" : i === step ? "active" : ""}`} />)}
                </div>
                <span className="progress-label">{step + 1} / {total}</span>
              </div>
              <div className="eyebrow">질문 {step + 1}</div>
              <h2>{q.question}</h2>

              {q.type === "single" && (
                <div className="options">
                  {q.options.map(opt => (
                    <button key={opt} className={`opt ${answers[q.id] === opt ? "sel" : ""}`} onClick={() => setSingle(opt)}>
                      <span className="radio"><span className="radio-inner" /></span>{opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === "multiple" && (
                <>
                  <p className="hint">복수 선택 가능합니다</p>
                  <div className="options">
                    {q.options.map(opt => {
                      const sel = (answers[q.id] || []).includes(opt);
                      return (
                        <button key={opt} className={`opt ${sel ? "sel" : ""}`} onClick={() => setMultiple(opt)}>
                          <span className="checkbox">{sel && <Check />}</span>{opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {q.type === "text" && (
                <textarea placeholder={q.placeholder || "자유롭게 작성해 주세요..."} value={answers[q.id] || ""} onChange={e => setText(e.target.value)} />
              )}

              <div className="btn-row">
                {step > 0 && <button className="btn btn-ghost" onClick={prev}>← 이전</button>}
                <button className="btn btn-primary" onClick={next} disabled={!canNext()}>
                  {step === total - 1 ? "결과 보기" : "다음"} <Arrow />
                </button>
              </div>
            </>
          )}

          {/* RESULTS */}
          {phase === "results" && (
            <>
              <div className="eyebrow">응답 완료 🎉</div>
              <h1>설문 결과</h1>
              <p className="subtitle" style={{ marginBottom: "28px" }}>
                참여해 주셔서 감사합니다.<br/>전체 응답 통계와 귀하의 응답을 함께 보여드립니다.
              </p>
              {questions.map(question => (
                <div className="result-block" key={question.id}>
                  <div className="result-q-no">Q{question.id}</div>
                  <div className="result-q-text">{question.question}</div>
                  {question.type === "text" ? (
                    <div className="text-bubble">{answers[question.id] || "(응답 없음)"}</div>
                  ) : (
                    question.options.map(opt => {
                      const pct = barW[question.id]?.[opt] ?? 0;
                      const mine = question.type === "multiple"
                        ? (answers[question.id] || []).includes(opt)
                        : answers[question.id] === opt;
                      return (
                        <div className="bar-row" key={opt}>
                          <div className={`bar-meta ${mine ? "mine" : ""}`}>
                            <span>{mine ? "✔ " : ""}{opt}</span><span>{pct}%</span>
                          </div>
                          <div className="bar-track">
                            <div className={`bar-fill ${mine ? "mine" : ""}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ))}
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => go("company")}>
                저희 센터 서비스 알아보기 <Arrow />
              </button>
            </>
          )}

          {/* COMPANY */}
          {phase === "company" && (
            <>
              <div className="co-header">
                <div className="co-name">{company.name}</div>
                <div className="co-tag">{company.tagline}</div>
              </div>
              <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: "1.85", marginBottom: "28px", fontWeight: 300 }}>
                {company.description}
              </p>
              <div className="feat-grid">
                {company.features.map(f => (
                  <div className="feat-card" key={f.title}>
                    <div className="feat-icon">{f.icon}</div>
                    <div className="feat-title">{f.title}</div>
                    <div className="feat-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
              <div className="cta-wrap">
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  {company.cta} <Arrow />
                </button>
                <p className="cta-contact">{company.contact}</p>
              </div>
              <div className="divider" />
              <div style={{ textAlign: "center" }}>
                <button className="btn btn-ghost" style={{ fontSize: "13px" }} onClick={() => { setAnswers({}); setStep(0); go("intro"); }}>
                  설문 다시 하기
                </button>
              </div>
            </>
          )}

          {/* ADMIN */}
          {phase === "admin" && editQ && editCo && editIntro && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
                <div style={{ fontFamily: "'Gowun Batang', serif", fontSize: "22px", fontWeight: 700 }}>⚙ 설문 편집</div>
                <button className="btn btn-ghost" style={{ fontSize: "12px", padding: "8px 16px" }} onClick={() => go("intro")}>취소</button>
              </div>

              {/* 메인 페이지 */}
              <div className="edit-section">
                <div className="section-title">🏠 메인 페이지</div>
                <div className="edit-label">상단 라벨</div>
                <input className="edit-field" value={editIntro.eyebrow} onChange={e => setEditIntro({...editIntro, eyebrow: e.target.value})} />
                <div className="edit-label">제목 (줄바꿈은 엔터로)</div>
                <textarea className="edit-field" style={{ height: "90px" }} value={editIntro.title} onChange={e => setEditIntro({...editIntro, title: e.target.value})} />
                <div className="edit-label">소개 문구 (줄바꿈은 엔터로)</div>
                <textarea className="edit-field" style={{ height: "90px" }} value={editIntro.subtitle} onChange={e => setEditIntro({...editIntro, subtitle: e.target.value})} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <div className="edit-label">배지 1</div>
                    <input className="edit-field" value={editIntro.badge1} onChange={e => setEditIntro({...editIntro, badge1: e.target.value})} />
                  </div>
                  <div>
                    <div className="edit-label">배지 2</div>
                    <input className="edit-field" value={editIntro.badge2} onChange={e => setEditIntro({...editIntro, badge2: e.target.value})} />
                  </div>
                </div>
                <div className="edit-label">시작 버튼 문구</div>
                <input className="edit-field" value={editIntro.btnText} onChange={e => setEditIntro({...editIntro, btnText: e.target.value})} />
              </div>

              <div className="divider" />

              {/* 센터 정보 */}
              <div className="edit-section">
                <div className="section-title">🏢 센터 정보</div>
                <div className="edit-label">센터명</div>
                <input className="edit-field" value={editCo.name} onChange={e => setEditCo({...editCo, name: e.target.value})} />
                <div className="edit-label">태그라인</div>
                <input className="edit-field" value={editCo.tagline} onChange={e => setEditCo({...editCo, tagline: e.target.value})} />
                <div className="edit-label">소개글</div>
                <textarea className="edit-field" style={{ height: "90px" }} value={editCo.description} onChange={e => setEditCo({...editCo, description: e.target.value})} />
                <div className="edit-label">CTA 버튼 문구</div>
                <input className="edit-field" value={editCo.cta} onChange={e => setEditCo({...editCo, cta: e.target.value})} />
                <div className="edit-label">연락처</div>
                <input className="edit-field" value={editCo.contact} onChange={e => setEditCo({...editCo, contact: e.target.value})} />
              </div>

              <div className="divider" />

              {/* 설문 문항 */}
              <div className="edit-section">
                <div className="section-title">📋 설문 문항 ({editQ.length}개)</div>
                {editQ.map((eq, qi) => (
                  <div className="edit-q-card" key={eq.id}>
                    <div className="q-num">질문 {qi + 1}</div>
                    <button className="del-q-btn" onClick={() => delQuestion(qi)}>삭제</button>
                    <div className="edit-label">질문 내용</div>
                    <textarea className="edit-field" style={{ height: "72px" }} value={eq.question} onChange={e => updateQ(qi, "question", e.target.value)} />
                    <div className="edit-label">문항 형식</div>
                    <select className="type-select" value={eq.type} onChange={e => changeType(qi, e.target.value)}>
                      <option value="single">객관식 (단일 선택)</option>
                      <option value="multiple">객관식 (복수 선택)</option>
                      <option value="text">주관식 (텍스트)</option>
                    </select>
                    {eq.type === "text" ? (
                      <>
                        <div className="edit-label">안내 문구</div>
                        <input className="edit-field" value={eq.placeholder || ""} onChange={e => updateQ(qi, "placeholder", e.target.value)} />
                      </>
                    ) : (
                      <>
                        <div className="edit-label">선택지</div>
                        {(eq.options || []).map((opt, oi) => (
                          <div className="opt-input-row" key={oi}>
                            <input className="opt-input" value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} />
                            <button className="icon-btn del" onClick={() => delOpt(qi, oi)}>×</button>
                          </div>
                        ))}
                        <button className="btn btn-ghost" style={{ fontSize: "12px", padding: "7px 14px", marginTop: "4px" }} onClick={() => addOpt(qi)}>
                          + 선택지 추가
                        </button>
                      </>
                    )}
                  </div>
                ))}
                <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: "4px" }} onClick={addQuestion}>
                  + 질문 추가
                </button>
              </div>

              <div className="divider" />
              <button className="btn btn-sage" style={{ width: "100%", justifyContent: "center" }} onClick={saveAdmin}>
                저장하고 적용하기 <Arrow />
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}
