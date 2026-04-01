import { useState, useEffect, useRef } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyPvgRzt6h6u98fldO9leSD8hblCn_0mk6XkcASZl0DaCwWJV276elhMlKGrLRfK7MJRA/exec";

const INTRO_DEFAULT = {
  eyebrow: "동료지원 인식개선 퀴즈",
  title: "정신질환,\n당사자가 가장 잘 알아요 🌿",
  subtitle: "비슷한 경험을 가진 사람이 서로를 돕는\n'동료지원'에 대해 알고 계신가요?\n5문제로 동료지원을 쉽게 알아보세요!",
  badge1: "5문항", badge2: "즉시 정답확인", btnText: "퀴즈 시작하기",
};

const COMPANY_DEFAULT = {
  name: "서울동행동료지원센터",
  tagline: "정신장애인 당사자가 만드는 동료지원의 공간",
  description: "서울동행동료지원센터는 정신장애인 당사자의 자립을 지원하고, 동료지원가를 양성하여 함께 지역사회에서 살아갈 수 있도록 돕는 곳입니다. 당사자의 목소리로 권익을 옹호하고, 인식개선을 위해 함께 활동합니다.",
  features: [
    { icon: "🤝", title: "동료지원", desc: "동료지원가 양성 · 동료상담 활동" },
    { icon: "🌿", title: "자립지원", desc: "정신장애인 당사자 자립생활 지원" },
    { icon: "📢", title: "권익옹호", desc: "인권증진 · 언론 및 인식개선 활동" },
    { icon: "👥", title: "지역사회 조직화", desc: "자조모임 · 지역사회 네트워킹" },
  ],
  cta: "센터 이용 문의하기",
  contact: "📞 070-5143-0180  |  mpcil0723@daum.net",
};

const QUESTIONS_DEFAULT = [
  { id:1, type:"quiz", question:"정신질환을 경험한 사람이 할 수 없는 것은 무엇인가요?", options:["직장 생활","결혼과 가정생활","지역사회에서의 자립 생활","위 항목 모두 가능하다"], correctAnswer:"위 항목 모두 가능하다", explanation:"정신질환을 경험했다고 해서 평범한 삶이 불가능한 것은 아닙니다. 적절한 지원과 환경이 갖춰진다면 직장, 가정, 자립생활 모두 충분히 가능해요. 많은 당사자들이 지금 이 순간에도 지역사회에서 함께 살아가고 있습니다." },
  { id:2, type:"quiz", question:"'동료지원가'는 어떤 사람인가요?", options:["정신건강 전문 자격증을 취득한 상담사","정신질환을 직접 경험한 당사자 활동가","자원봉사 활동을 하는 일반 시민","병원에서 파견된 사회복지사"], correctAnswer:"정신질환을 직접 경험한 당사자 활동가", explanation:"동료지원가는 정신질환을 직접 겪은 당사자예요. 전문 자격증이 아닌 '살아있는 경험'을 바탕으로, 같은 어려움을 겪고 있는 분들 곁에서 함께 이야기 나누고 정보를 안내하는 역할을 합니다." },
  { id:3, type:"quiz", question:"동료지원가가 일반 상담사와 가장 다른 점은 무엇인가요?", options:["더 저렴한 비용으로 이용할 수 있다","\"나도 그랬어\"라는 공감을 직접 전할 수 있다","24시간 언제든지 연락할 수 있다","의학적 처방과 진단이 가능하다"], correctAnswer:"\"나도 그랬어\"라는 공감을 직접 전할 수 있다", explanation:"동료지원가의 가장 큰 힘은 같은 경험에서 나오는 진심 어린 공감이에요. \"저도 그 시절이 있었는데 지금은 이렇게 지내고 있어요\"라는 말 한마디가 전문가의 조언보다 더 강한 희망이 될 수 있습니다." },
  { id:4, type:"quiz", question:"정신질환자에 대한 설명 중 사실인 것은 무엇인가요?", options:["정신질환자는 항상 위험하다","정신질환은 의지가 약해서 생긴다","정신질환자는 범죄를 더 많이 저지른다","정신질환은 적절한 지원으로 회복이 가능하다"], correctAnswer:"정신질환은 적절한 지원으로 회복이 가능하다", explanation:"정신질환자가 위험하다거나 범죄율이 높다는 것은 사실이 아닙니다. 통계적으로 정신질환자의 범죄율은 일반 인구와 큰 차이가 없어요. 정신질환은 당뇨, 고혈압처럼 적절한 치료와 지원이 있으면 충분히 회복하며 살아갈 수 있는 질환입니다." },
  { id:5, type:"quiz", question:"서울동행동료지원센터는 어떤 역할을 하는 곳인가요?", options:["정신질환자를 시설에서 보호하고 관리","당사자 스스로 지역사회에서 살아갈 수 있도록 지원","정신질환 진단과 약물 처방","정신질환자 가족을 위한 교육 전담"], correctAnswer:"당사자 스스로 지역사회에서 살아갈 수 있도록 지원", explanation:"서울동행동료지원센터는 정신질환을 경험한 당사자가 시설이 아닌 지역사회에서 스스로 결정하며 살아갈 수 있도록 동료지원, 자립지원, 권익옹호 활동을 합니다. 당사자의 목소리가 중심이 되는 곳이에요." },
];

const LOTTERY_DEFAULT = {
  enabled: true,
  maxWinners: 0,
  description: "퀴즈 참여자 중 추첨하여 선물을 드립니다!",
  resetKey: "1",
  prizes: [
    { id: 1, name: "스타벅스 아메리카노", probability: 10, stock: 3 },
    { id: 2, name: "편의점 상품권 5,000원", probability: 20, stock: 5 },
  ],
};

const apiGet  = async (action) => { const r = await fetch(`${API_URL}?action=${action}`); return r.json(); };
const apiPost = async (action, data) => { const r = await fetch(API_URL,{method:"POST",body:JSON.stringify({action,data})}); return r.json(); };

// 추첨 함수: 재고 소진된 상품 제외 후 독립 확률로 추첨
// 당첨된 상품이 여럿이면 랜덤으로 1개 지급
function drawPrize(prizes, prizeCount) {
  const available = prizes.filter(p => {
    const stock = Number(p.stock || 0);
    if (stock === 0) return true; // 0 = 무제한
    const used = prizeCount[p.name] || 0;
    return used < stock;
  });
  const winners = available.filter(p => Math.random() * 100 < Number(p.probability || 0));
  if (winners.length === 0) return null;
  return winners[Math.floor(Math.random() * winners.length)];
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Pretendard:wght@300;400;500;600&display=swap');
  :root {
    --bg:#fdf6ee; --surface:#fff9f3; --surface2:#fdeee0;
    --border:#e8d5c0; --border2:#f0e0cc;
    --terra:#c8652a; --terra-l:#e07a3a; --terra-bg:rgba(200,101,42,0.08);
    --sage:#6b8f71; --sage-l:#8aac90;
    --gold:#d4952a; --gold-l:#f0b84a; --gold-bg:rgba(212,149,42,0.10);
    --correct:#3a8f5a; --correct-bg:rgba(58,143,90,0.08);
    --wrong:#c04040; --wrong-bg:rgba(192,64,64,0.08);
    --text:#2d1f14; --muted:#9c7c62; --muted2:#c4a98a;
    --shadow:0 4px 32px rgba(180,120,60,0.10);
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);background-image:radial-gradient(ellipse 80% 60% at 10% 0%,rgba(212,149,42,0.10) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 100%,rgba(200,101,42,0.08) 0%,transparent 60%);color:var(--text);font-family:'Pretendard','Apple SD Gothic Neo',sans-serif;min-height:100vh;}
  .app{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 20px;}
  .card{background:var(--surface);border:1px solid var(--border2);border-radius:24px;padding:52px 48px;max-width:660px;width:100%;box-shadow:var(--shadow);position:relative;animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
  .eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--terra);font-weight:600;margin-bottom:14px;}
  h1{font-family:'Gowun Batang',serif;font-size:clamp(28px,5vw,42px);font-weight:700;line-height:1.25;color:var(--text);margin-bottom:16px;}
  h2{font-family:'Gowun Batang',serif;font-size:clamp(19px,3vw,26px);font-weight:700;color:var(--text);line-height:1.4;margin-bottom:28px;}
  .subtitle{color:var(--muted);font-size:15px;line-height:1.8;margin-bottom:36px;font-weight:300;}
  .progress-wrap{display:flex;align-items:center;gap:14px;margin-bottom:36px;}
  .progress-dots{display:flex;gap:7px;flex:1;}
  .dot{flex:1;height:4px;border-radius:4px;background:var(--border);transition:background .35s;}
  .dot.done{background:var(--terra);}.dot.active{background:var(--terra-l);}
  .progress-label{font-size:12px;color:var(--muted2);white-space:nowrap;}
  .options{display:flex;flex-direction:column;gap:9px;margin-bottom:32px;}
  .opt{display:flex;align-items:center;gap:14px;padding:15px 20px;border:1.5px solid var(--border);border-radius:14px;background:transparent;cursor:pointer;text-align:left;color:var(--text);font-family:inherit;font-size:14.5px;font-weight:400;transition:all .2s;line-height:1.4;}
  .opt:hover:not(:disabled){border-color:var(--terra-l);background:var(--terra-bg);}
  .opt.sel{border-color:var(--terra);background:var(--terra-bg);color:var(--terra);font-weight:500;}
  .opt:disabled{cursor:default;}
  .opt.correct-answer{border-color:var(--correct)!important;background:var(--correct-bg)!important;color:var(--correct)!important;font-weight:600;}
  .opt.wrong{border-color:var(--wrong)!important;background:var(--wrong-bg)!important;color:var(--wrong)!important;}
  .quiz-feedback{border-radius:14px;padding:18px 20px;margin-bottom:24px;animation:fadeUp .3s ease both;}
  .quiz-feedback.correct{background:var(--correct-bg);border:1.5px solid var(--correct);}
  .quiz-feedback.wrong{background:var(--wrong-bg);border:1.5px solid var(--wrong);}
  .quiz-feedback-header{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
  .quiz-feedback-icon{font-size:22px;}
  .quiz-feedback-title{font-family:'Gowun Batang',serif;font-size:18px;font-weight:700;}
  .quiz-feedback.correct .quiz-feedback-title{color:var(--correct);}
  .quiz-feedback.wrong .quiz-feedback-title{color:var(--wrong);}
  .quiz-feedback-answer{font-size:13px;color:var(--muted);margin-bottom:8px;}
  .quiz-feedback-answer strong{color:var(--correct);font-weight:600;}
  .quiz-feedback-explanation{font-size:14px;line-height:1.75;color:var(--text);}
  .quiz-score-box{background:linear-gradient(135deg,#f0f8f3,#e8f4ec);border:1.5px solid var(--correct);border-radius:16px;padding:24px;text-align:center;margin-bottom:28px;}
  .quiz-score-num{font-family:'Gowun Batang',serif;font-size:48px;font-weight:700;color:var(--correct);line-height:1;}
  .quiz-score-label{font-size:13px;color:var(--muted);margin-top:4px;}
  .quiz-result-opt{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;margin-bottom:6px;font-size:13.5px;}
  .quiz-result-opt.correct-answer{background:var(--correct-bg);color:var(--correct);font-weight:600;}
  .quiz-result-opt.wrong-answer{background:var(--wrong-bg);color:var(--wrong);}
  .quiz-result-opt.neutral{background:var(--surface2);color:var(--muted);}
  .radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .opt.sel .radio,.opt.correct-answer .radio,.opt.wrong .radio{border-color:currentColor;}
  .radio-inner{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:0;transition:opacity .2s;}
  .opt.sel .radio-inner{opacity:1;}
  .checkbox{width:20px;height:20px;border-radius:6px;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .opt.sel .checkbox{border-color:var(--terra);background:var(--terra);}
  textarea{width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:14px;padding:18px 20px;color:var(--text);font-family:inherit;font-size:14px;font-weight:300;line-height:1.8;resize:none;height:130px;outline:none;transition:border-color .2s;margin-bottom:32px;}
  textarea:focus{border-color:var(--terra);}textarea::placeholder{color:var(--muted2);}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:50px;font-family:inherit;font-size:14.5px;font-weight:500;cursor:pointer;transition:all .2s;border:none;}
  .btn-primary{background:var(--terra);color:#fff;box-shadow:0 4px 20px rgba(200,101,42,.22);}
  .btn-primary:hover{background:var(--terra-l);transform:translateY(-1px);}
  .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
  .btn-ghost{background:transparent;color:var(--muted);border:1.5px solid var(--border);}
  .btn-ghost:hover{border-color:var(--muted);color:var(--text);}
  .btn-sage{background:var(--sage);color:#fff;}
  .btn-sage:hover{background:var(--sage-l);transform:translateY(-1px);}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-l));color:#fff;box-shadow:0 4px 20px rgba(212,149,42,.3);}
  .btn-gold:hover{transform:translateY(-1px);}
  .btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;}
  .btn-danger{background:transparent;color:var(--wrong);border:1.5px solid var(--wrong);}
  .btn-danger:hover{background:var(--wrong-bg);}
  .btn-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
  .result-block{margin-bottom:30px;padding-bottom:30px;border-bottom:1px solid var(--border2);}
  .result-block:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
  .result-q-no{font-size:11px;color:var(--terra);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
  .result-q-text{font-family:'Gowun Batang',serif;font-size:17px;color:var(--text);margin-bottom:16px;font-weight:700;line-height:1.45;}
  .bar-row{margin-bottom:9px;}
  .bar-meta{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);margin-bottom:4px;}
  .bar-meta.mine{color:var(--terra);font-weight:500;}
  .bar-track{height:7px;background:var(--border);border-radius:6px;overflow:hidden;}
  .bar-fill{height:100%;border-radius:6px;background:var(--terra-l);transition:width .9s cubic-bezier(.16,1,.3,1);}
  .bar-fill.mine{background:var(--terra);}
  .text-bubble{background:var(--surface2);border-left:3px solid var(--terra);border-radius:0 12px 12px 0;padding:16px 18px;font-size:14px;color:var(--text);line-height:1.8;font-style:italic;}
  .lottery-banner{background:linear-gradient(135deg,#fffbef,#fff4d6);border:1.5px solid var(--gold);border-radius:16px;padding:20px 22px;margin-bottom:32px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:box-shadow .2s;}
  .lottery-banner:hover{box-shadow:0 4px 20px rgba(212,149,42,.2);}
  .lottery-banner-icon{font-size:28px;flex-shrink:0;}
  .lottery-banner-text{flex:1;}
  .lottery-banner-title{font-size:13px;font-weight:600;color:var(--gold);margin-bottom:3px;}
  .lottery-banner-desc{font-size:12px;color:var(--muted);line-height:1.5;}

  /* 상품 목록 (인트로) */
  .prize-list{display:flex;flex-direction:column;gap:7px;margin-bottom:24px;}
  .prize-item{display:flex;align-items:center;justify-content:space-between;background:var(--gold-bg);border:1px solid var(--gold);border-radius:10px;padding:10px 16px;}
  .prize-item-name{font-size:13px;font-weight:600;color:var(--text);}
  .prize-item-prob{font-size:12px;color:var(--gold);font-weight:600;}

  .scratch-area{width:100%;max-width:320px;margin:0 auto 32px;aspect-ratio:1.8;border-radius:20px;position:relative;overflow:hidden;cursor:pointer;user-select:none;}
  .scratch-cover{position:absolute;inset:0;background:linear-gradient(135deg,#d4a843,#e8c060,#c8952a);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:20px;transition:opacity .6s,transform .6s;z-index:2;}
  .scratch-cover.revealed{opacity:0;transform:scale(1.05);pointer-events:none;}
  .scratch-cover-text{font-size:32px;}
  .scratch-cover-sub{font-size:13px;color:rgba(255,255,255,0.85);font-weight:500;}
  .scratch-result{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;border-radius:20px;z-index:1;}
  .scratch-result.win{background:linear-gradient(135deg,#fff8e8,#ffefc0);}
  .scratch-result.lose{background:linear-gradient(135deg,#f5f0ea,#ede5d8);}
  .scratch-result-emoji{font-size:48px;animation:popIn .5s cubic-bezier(.16,1,.3,1) both;}
  .scratch-result-text{font-family:'Gowun Batang',serif;font-size:22px;font-weight:700;}
  .scratch-result.win .scratch-result-text{color:var(--gold);}
  .scratch-result.lose .scratch-result-text{color:var(--muted);}
  .scratch-result-sub{font-size:13px;color:var(--muted);text-align:center;padding:0 16px;}
  @keyframes popIn{from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);}}
  .confetti{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;}

  .winner-form{background:linear-gradient(135deg,#fffbef,#fff4d6);border:1.5px solid var(--gold);border-radius:18px;padding:28px 24px;margin-top:24px;animation:fadeUp .4s ease both;}
  .winner-form-title{font-family:'Gowun Batang',serif;font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px;}
  .winner-form-sub{font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.6;}
  .form-field{margin-bottom:14px;}
  .form-label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;display:block;}
  .form-input{width:100%;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:12px 14px;color:var(--text);font-family:inherit;font-size:14px;outline:none;transition:border-color .2s;}
  .form-input:focus{border-color:var(--gold);}
  .prize-badge{display:inline-flex;align-items:center;gap:6px;background:var(--gold-bg);border:1px solid var(--gold);border-radius:50px;padding:6px 14px;font-size:13px;font-weight:600;color:var(--gold);margin-bottom:20px;}

  .co-header{text-align:center;margin-bottom:32px;}
  .co-name{font-family:'Gowun Batang',serif;font-size:36px;font-weight:700;color:var(--terra);margin-bottom:6px;}
  .co-tag{font-size:13px;color:var(--muted);letter-spacing:.5px;}
  .feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px;}
  .feat-card{background:var(--surface2);border:1px solid var(--border2);border-radius:16px;padding:18px 18px 16px;}
  .feat-icon{font-size:22px;margin-bottom:8px;}
  .feat-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:3px;}
  .feat-desc{font-size:12px;color:var(--muted);line-height:1.5;}
  .cta-wrap{background:linear-gradient(135deg,#fdeee0,#fdf4e8);border:1.5px solid var(--terra);border-radius:18px;padding:28px 24px;text-align:center;}
  .cta-contact{font-size:13px;color:var(--muted);margin-top:14px;line-height:1.8;}
  .divider{height:1px;background:var(--border2);margin:24px 0;}
  .hint{font-size:12px;color:var(--muted2);margin-top:-16px;margin-bottom:20px;}

  .admin-btn{position:absolute;top:20px;right:20px;padding:8px 14px;border-radius:50px;font-size:12px;font-weight:500;background:var(--surface2);border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all .2s;font-family:inherit;}
  .admin-btn:hover{border-color:var(--terra);color:var(--terra);}
  .pw-overlay{position:fixed;inset:0;background:rgba(45,31,20,0.5);display:flex;align-items:center;justify-content:center;z-index:100;}
  .pw-box{background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:36px 32px;width:300px;box-shadow:0 8px 48px rgba(180,120,60,0.2);text-align:center;}
  .pw-title{font-family:'Gowun Batang',serif;font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px;}
  .pw-sub{font-size:13px;color:var(--muted);margin-bottom:20px;}
  .pw-input{width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:10px;padding:12px 16px;color:var(--text);font-family:inherit;font-size:16px;outline:none;text-align:center;transition:border-color .2s;margin-bottom:8px;}
  .pw-input:focus{border-color:var(--terra);}
  .pw-error{font-size:12px;color:#c04040;margin-bottom:12px;height:16px;}
  .pw-row{display:flex;gap:8px;}

  .edit-section{margin-bottom:28px;}
  .edit-q-card{background:var(--surface2);border:1px solid var(--border2);border-radius:16px;padding:20px 20px 16px;margin-bottom:14px;position:relative;}
  .edit-field{width:100%;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-family:inherit;font-size:13.5px;outline:none;transition:border-color .2s;margin-bottom:8px;resize:none;}
  .edit-field:focus{border-color:var(--terra);}
  .edit-label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;margin-top:12px;}
  .type-select{background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text);font-family:inherit;font-size:13px;outline:none;margin-bottom:10px;width:100%;cursor:pointer;}
  .opt-input-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .opt-input{flex:1;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-family:inherit;font-size:13px;outline:none;}
  .correct-mark{width:30px;height:30px;border-radius:8px;border:1.5px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s;flex-shrink:0;}
  .correct-mark.active{background:var(--correct-bg);border-color:var(--correct);}
  .icon-btn{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px;transition:all .2s;flex-shrink:0;}
  .icon-btn:hover{background:#fde8e8;border-color:#e07070;color:#c04040;}
  .del-q-btn{position:absolute;top:14px;right:14px;padding:5px 12px;border-radius:50px;font-size:11px;font-weight:500;background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;font-family:inherit;transition:all .2s;}
  .del-q-btn:hover{background:#fde8e8;border-color:#e07070;color:#c04040;}
  .q-num{font-size:11px;font-weight:600;color:var(--terra);letter-spacing:1.5px;margin-bottom:10px;}
  .section-title{font-size:13px;font-weight:600;color:var(--terra);margin-bottom:12px;letter-spacing:1px;}
  .quiz-type-badge{display:inline-flex;align-items:center;gap:4px;background:#e8f4ec;border:1px solid var(--correct);border-radius:50px;padding:3px 10px;font-size:11px;font-weight:600;color:var(--correct);margin-left:8px;vertical-align:middle;}

  /* 상품 편집 카드 */
  .prize-edit-card{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:16px 16px 12px;margin-bottom:10px;position:relative;}
  .prize-edit-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
  .prize-name-input{flex:1;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-family:inherit;font-size:13px;outline:none;transition:border-color .2s;}
  .prize-name-input:focus{border-color:var(--gold);}
  .prize-prob-wrap{display:flex;align-items:center;gap:6px;}
  .prize-prob-input{width:64px;background:var(--surface2);border:1.5px solid var(--border);border-radius:8px;padding:9px 10px;color:var(--text);font-family:inherit;font-size:13px;outline:none;text-align:center;transition:border-color .2s;}
  .prize-prob-input:focus{border-color:var(--gold);}
  .prize-prob-unit{font-size:12px;color:var(--muted);}
  .prize-total-warn{font-size:12px;margin-top:4px;padding:8px 12px;border-radius:8px;background:rgba(212,149,42,0.12);color:var(--gold);font-weight:500;}
  .prize-total-ok{font-size:12px;margin-top:4px;padding:8px 12px;border-radius:8px;background:var(--correct-bg);color:var(--correct);font-weight:500;}

  .toggle-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
  .toggle{width:44px;height:24px;border-radius:12px;background:var(--border);border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
  .toggle.on{background:var(--sage);}
  .toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.2);}
  .toggle.on::after{left:23px;}
  .prob-row{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
  .prob-input{width:80px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;color:var(--text);font-family:inherit;font-size:14px;outline:none;text-align:center;}

  .winner-status{background:var(--gold-bg);border:1px solid var(--gold);border-radius:14px;padding:16px 20px;margin-bottom:16px;}
  .winner-status-row{display:flex;align-items:center;justify-content:space-between;}
  .winner-status-label{font-size:13px;color:var(--muted);font-weight:500;}
  .winner-status-count{font-family:'Gowun Batang',serif;font-size:22px;font-weight:700;color:var(--gold);}
  .winner-status-bar{height:6px;background:var(--border);border-radius:6px;overflow:hidden;margin-top:10px;}
  .winner-status-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,var(--gold),var(--gold-l));transition:width .6s ease;}

  .confirm-overlay{position:fixed;inset:0;background:rgba(45,31,20,0.5);display:flex;align-items:center;justify-content:center;z-index:200;}
  .confirm-box{background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:32px 28px;width:320px;box-shadow:0 8px 48px rgba(180,120,60,0.2);text-align:center;}
  .confirm-title{font-family:'Gowun Batang',serif;font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px;}
  .confirm-sub{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:24px;}
  .confirm-row{display:flex;gap:10px;}

  .loading{display:flex;align-items:center;justify-content:center;gap:10px;color:var(--muted);font-size:14px;padding:40px 0;}
  .spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--terra);border-radius:50%;animation:spin .7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  /* 개인정보 동의 */
  .consent-box{background:var(--surface2);border:1.5px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:20px;}
  .consent-text{font-size:12px;color:var(--muted);line-height:1.8;margin-bottom:14px;}
  .consent-check-row{display:flex;align-items:center;gap:10px;cursor:pointer;}
  .consent-checkbox{width:20px;height:20px;border-radius:5px;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .consent-checkbox.checked{border-color:var(--terra);background:var(--terra);}
  .consent-label{font-size:13px;font-weight:500;color:var(--text);}
  .info-form{background:linear-gradient(135deg,#fffbef,#fff4d6);border:1.5px solid var(--gold);border-radius:18px;padding:24px 22px;margin-bottom:24px;}
  .info-form-title{font-family:'Gowun Batang',serif;font-size:17px;font-weight:700;color:var(--text);margin-bottom:4px;}
  .info-form-sub{font-size:12px;color:var(--muted);margin-bottom:18px;line-height:1.5;}
  @media(max-width:560px){.card{padding:36px 22px;}.feat-grid{grid-template-columns:1fr;}}
`;

const Arrow = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Check = () => <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function Confetti() {
  const colors = ["#d4952a","#e07a3a","#6b8f71","#c8652a","#f0b84a"];
  return (
    <div className="confetti">
      <style>{`@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}`}</style>
      {Array.from({length:60},(_,i)=>({id:i,color:colors[i%colors.length],left:Math.random()*100,delay:Math.random()*1.5,size:6+Math.random()*8,dur:2+Math.random()*2})).map(p=>(
        <div key={p.id} style={{position:"absolute",left:`${p.left}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:Math.random()>.5?"50%":"2px",animation:`fall ${p.dur}s ${p.delay}s ease-in forwards`}}/>
      ))}
    </div>
  );
}

export default function App() {
  const [phase,setPhase]             = useState("loading");
  const [step,setStep]               = useState(0);
  const [answers,setAnswers]         = useState({});
  const [quizRevealed,setQuizRevealed] = useState({});
  const [barW,setBarW]               = useState({});
  const [questions,setQuestions]     = useState(QUESTIONS_DEFAULT);
  const [company,setCompany]         = useState(COMPANY_DEFAULT);
  const [intro,setIntro]             = useState(INTRO_DEFAULT);
  const [lottery,setLottery]         = useState(LOTTERY_DEFAULT);
  const [winnerCount,setWinnerCount] = useState(0);
  const [prizeCount,setPrizeCount]   = useState({});
  const [serverResetKey,setServerResetKey] = useState("1");
  const [wonPrize,setWonPrize]       = useState(null); // 당첨된 상품 객체
  const [revealed,setRevealed]       = useState(false);
  const [confetti,setConfetti]       = useState(false);
  const [winName,setWinName]         = useState("");
  const [winRegion,setWinRegion]     = useState("");
  const [winContact,setWinContact]   = useState("");
  const [winSaved,setWinSaved]       = useState(false);
  const [consented,setConsented]     = useState(false);
  const [editQ,setEditQ]             = useState(null);
  const [editCo,setEditCo]           = useState(null);
  const [editIntro,setEditIntro]     = useState(null);
  const [editLottery,setEditLottery] = useState(null);
  const [pwOpen,setPwOpen]           = useState(false);
  const [pwVal,setPwVal]             = useState("");
  const [pwErr,setPwErr]             = useState(false);
  const [saving,setSaving]           = useState(false);
  const [confirmReset,setConfirmReset] = useState(false);
  const [resetting,setResetting]     = useState(false);
  const cardRef = useRef(null);
  const q = questions[step]; const total = questions.length;

  useEffect(()=>{
    (async()=>{
      try{
        const [cfg,wc] = await Promise.all([apiGet("config"),apiGet("winnerCount")]);
        if(cfg.questions) setQuestions(cfg.questions);
        if(cfg.company)   setCompany(cfg.company);
        if(cfg.intro)     setIntro(cfg.intro);
        if(cfg.lottery)   setLottery({...LOTTERY_DEFAULT,...cfg.lottery, prizes: (cfg.lottery.prizes||LOTTERY_DEFAULT.prizes).map(p=>({stock:0,...p}))});
        if(wc.count !== undefined) setWinnerCount(wc.count);
        if(wc.prizeCount) setPrizeCount(wc.prizeCount);
        if(wc.resetKey)   setServerResetKey(wc.resetKey);
      }catch{}
      setPhase("intro");
    })();
  },[]);

  const animate=()=>{ if(!cardRef.current)return; cardRef.current.style.animation="none"; void cardRef.current.offsetHeight; cardRef.current.style.animation="fadeUp .4s cubic-bezier(.16,1,.3,1) both"; };
  const go=(p)=>{setPhase(p);animate();};

  const setSingle=(opt)=>setAnswers(p=>({...p,[q.id]:opt}));
  const setMultiple=(opt)=>setAnswers(p=>{const cur=p[q.id]||[];return{...p,[q.id]:cur.includes(opt)?cur.filter(x=>x!==opt):[...cur,opt]};});
  const setText=(v)=>setAnswers(p=>({...p,[q.id]:v}));
  const setQuiz=(opt)=>{ if(quizRevealed[q.id])return; setAnswers(p=>({...p,[q.id]:opt})); setQuizRevealed(p=>({...p,[q.id]:true})); };

  const canNext=()=>{
    const a=answers[q?.id];
    if(!q)return false;
    if(q.type==="single")  return !!a;
    if(q.type==="multiple")return a&&a.length>0;
    if(q.type==="text")    return a&&a.trim().length>0;
    if(q.type==="quiz")    return quizRevealed[q.id];
    return false;
  };

  const calcBars=(s,qs)=>{const w={};qs.forEach(question=>{if(question.type==="text"||question.type==="quiz")return;const data=s[question.id]||{};const tot=Object.values(data).reduce((a,b)=>a+b,0);w[question.id]={};(question.options||[]).forEach(opt=>{w[question.id][opt]=tot>0?Math.round(((data[opt]||0)/tot)*100):0;});});return w;};
  const calcQuizScore=()=>{const qs=questions.filter(q=>q.type==="quiz");if(!qs.length)return null;const c=qs.filter(q=>answers[q.id]===q.correctAnswer).length;return{correct:c,total:qs.length};};

  const next=async()=>{
    if(step<total-1){setStep(s=>s+1);animate();return;}
    go("submitting");

    // 제출 직전 서버에서 최신 당첨자 현황 + resetKey 가져오기
    let freshResetKey=serverResetKey;
    let freshWinnerCount=winnerCount;
    let freshPrizeCount=prizeCount;
    let freshLottery=lottery;
    try{
      const [submitRes, statsRes, wcRes, cfgRes] = await Promise.all([
        apiPost("submit",{questions,answers,name:winName,region:winRegion,contact:winContact}),
        apiGet("stats"),
        apiGet("winnerCount"),
        apiGet("config"),
      ]);
      if(statsRes.stats) setBarW(calcBars(statsRes.stats,questions));
      if(wcRes.resetKey)  { freshResetKey=wcRes.resetKey; setServerResetKey(wcRes.resetKey); }
      if(wcRes.count!==undefined){ freshWinnerCount=wcRes.count; setWinnerCount(wcRes.count); }
      if(wcRes.prizeCount){ freshPrizeCount=wcRes.prizeCount; setPrizeCount(wcRes.prizeCount); }
      if(cfgRes.lottery)  { freshLottery={...LOTTERY_DEFAULT,...cfgRes.lottery,prizes:(cfgRes.lottery.prizes||LOTTERY_DEFAULT.prizes).map(p=>({stock:0,...p}))}; setLottery(freshLottery); }
    }catch{}

    const localKey=localStorage.getItem("survey_reset_key");
    const alreadySubmitted=localKey===freshResetKey&&localStorage.getItem("survey_submitted_"+freshResetKey)==="true";
    const maxReached=freshLottery.maxWinners>0&&freshWinnerCount>=freshLottery.maxWinners;

    console.log("=== 추첨 디버그 ===");
    console.log("enabled:", freshLottery.enabled);
    console.log("alreadySubmitted:", alreadySubmitted, "| localKey:", localKey, "| freshResetKey:", freshResetKey);
    console.log("maxReached:", maxReached, "| winnerCount:", freshWinnerCount, "| maxWinners:", freshLottery.maxWinners);
    console.log("prizes:", JSON.stringify(freshLottery.prizes));
    console.log("prizeCount:", JSON.stringify(freshPrizeCount));

    let prize=null;
    if(freshLottery.enabled&&!alreadySubmitted&&!maxReached){
      prize=drawPrize(freshLottery.prizes||[],freshPrizeCount);
      console.log("drawPrize 결과:", prize);
    } else {
      console.log("추첨 건너뜀 — enabled:", freshLottery.enabled, "alreadySubmitted:", alreadySubmitted, "maxReached:", maxReached);
    }

    localStorage.setItem("survey_reset_key",freshResetKey);
    localStorage.setItem("survey_submitted_"+freshResetKey,"true");

    setWonPrize(prize); setRevealed(false); setWinSaved(false);
    go("results");
  };
  const prev=()=>{if(step>0){setStep(s=>s-1);animate();}};

  const handleReveal=()=>{
    if(revealed)return; setRevealed(true);
    if(wonPrize){
      setTimeout(()=>setConfetti(true),300);
      setTimeout(()=>setConfetti(false),4000);
      saveWinner(wonPrize);
    }
  };

  const saveWinner=async(prize)=>{
    try{
      await apiPost("saveWinner",{name:winName,region:winRegion,contact:winContact,prize:prize.name,date:new Date().toLocaleString("ko-KR"),resetKey:serverResetKey});
      setWinnerCount(c=>c+1);
      setPrizeCount(p=>({...p,[prize.name]:(p[prize.name]||0)+1}));
    }catch{}
    setWinSaved(true);
  };

  const doReset=async()=>{
    setResetting(true);
    try{
      const res=await apiPost("resetLottery",{});
      if(res.resetKey){setServerResetKey(res.resetKey);setWinnerCount(0);setPrizeCount({});const cfg=await apiGet("config");if(cfg.lottery)setLottery({...LOTTERY_DEFAULT,...cfg.lottery,prizes:cfg.lottery.prizes||LOTTERY_DEFAULT.prizes});}
    }catch{}
    // 로컬스토리지 초기화 → 이 기기도 다시 참여 가능
    localStorage.removeItem("survey_reset_key");
    // 기존 submitted 키 전체 삭제
    Object.keys(localStorage).filter(k=>k.startsWith("survey_submitted_")).forEach(k=>localStorage.removeItem(k));
    setResetting(false); setConfirmReset(false);
  };

  const handleAdminClick=()=>{setPwOpen(true);setPwVal("");setPwErr(false);};
  const handlePwSubmit=()=>{if(pwVal==="0723"){setPwOpen(false);openAdmin();}else{setPwErr(true);setPwVal("");}};
  const openAdmin=()=>{setEditQ(JSON.parse(JSON.stringify(questions)));setEditCo(JSON.parse(JSON.stringify(company)));setEditIntro(JSON.parse(JSON.stringify(intro)));setEditLottery(JSON.parse(JSON.stringify(lottery)));go("admin");};

  const updateQ=(i,f,v)=>{const qs=[...editQ];qs[i]={...qs[i],[f]:v};setEditQ(qs);};
  const updateOpt=(qi,oi,v)=>{const qs=[...editQ];const o=[...qs[qi].options];o[oi]=v;qs[qi]={...qs[qi],options:o};setEditQ(qs);};
  const addOpt=(qi)=>{const qs=[...editQ];qs[qi]={...qs[qi],options:[...(qs[qi].options||[]),"새 선택지"]};setEditQ(qs);};
  const delOpt=(qi,oi)=>{const qs=[...editQ];qs[qi]={...qs[qi],options:qs[qi].options.filter((_,i)=>i!==oi)};setEditQ(qs);};
  const changeType=(qi,type)=>{const qs=[...editQ];const base={id:qs[qi].id,type,question:qs[qi].question};if(type==="text"){base.placeholder=qs[qi].placeholder||"";}else if(type==="quiz"){base.options=qs[qi].options||["선택지 1","선택지 2","선택지 3","선택지 4"];base.correctAnswer=qs[qi].correctAnswer||"선택지 1";base.explanation=qs[qi].explanation||"";}else{base.options=qs[qi].options||["선택지 1","선택지 2"];}qs[qi]=base;setEditQ(qs);};
  const addQuestion=()=>{const newId=Math.max(...editQ.map(q=>q.id),0)+1;setEditQ([...editQ,{id:newId,type:"single",question:"새 질문을 입력하세요",options:["선택지 1","선택지 2"]}]);};
  const delQuestion=(i)=>{if(editQ.length>1)setEditQ(editQ.filter((_,idx)=>idx!==i));};

  // 상품 편집 헬퍼
  const updatePrize=(pi,field,val)=>{const ps=[...editLottery.prizes];ps[pi]={...ps[pi],[field]:val};setEditLottery({...editLottery,prizes:ps});};
  const addPrize=()=>{const newId=Math.max(...(editLottery.prizes||[]).map(p=>p.id),0)+1;setEditLottery({...editLottery,prizes:[...(editLottery.prizes||[]),{id:newId,name:"새 상품",probability:5,stock:0}]});};
  const delPrize=(pi)=>{if(editLottery.prizes.length>1)setEditLottery({...editLottery,prizes:editLottery.prizes.filter((_,i)=>i!==pi)});};
  const totalProb=(prizes)=>prizes.reduce((s,p)=>s+Number(p.probability||0),0);

  const saveAdmin=async()=>{setSaving(true);try{await apiPost("saveConfig",{questions:editQ,company:editCo,intro:editIntro,lottery:{...editLottery,resetKey:serverResetKey}});}catch{}setQuestions(editQ);setCompany(editCo);setIntro(editIntro);setLottery({...editLottery,resetKey:serverResetKey});setSaving(false);go("intro");};

  const score=calcQuizScore();
  const maxReached=lottery.maxWinners>0&&winnerCount>=lottery.maxWinners;
  const winnerPct=lottery.maxWinners>0?Math.min(winnerCount/lottery.maxWinners*100,100):0;
  const activePrizes=(lottery.prizes||[]).filter(p=>p.probability>0);

  return (
    <>
      <style>{css}</style>
      {confetti&&<Confetti/>}
      <div className="app">
        <div className="card" ref={cardRef}>

          {pwOpen&&(
            <div className="pw-overlay" onClick={()=>setPwOpen(false)}>
              <div className="pw-box" onClick={e=>e.stopPropagation()}>
                <div className="pw-title">🔒 관리자 확인</div>
                <div className="pw-sub">비밀번호를 입력해주세요</div>
                <input className="pw-input" type="password" value={pwVal} onChange={e=>{setPwVal(e.target.value);setPwErr(false);}} onKeyDown={e=>e.key==="Enter"&&handlePwSubmit()} autoFocus placeholder="비밀번호 입력"/>
                <div className="pw-error">{pwErr?"비밀번호가 틀렸습니다":""}</div>
                <div className="pw-row">
                  <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setPwOpen(false)}>취소</button>
                  <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={handlePwSubmit}>확인</button>
                </div>
              </div>
            </div>
          )}

          {confirmReset&&(
            <div className="confirm-overlay" onClick={()=>!resetting&&setConfirmReset(false)}>
              <div className="confirm-box" onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:"40px",marginBottom:"12px"}}>🔄</div>
                <div className="confirm-title">추첨 초기화</div>
                <div className="confirm-sub">초기화하면 이전 참여자들의 중복 방지 기록이 모두 사라지고 당첨자 카운트가 0으로 리셋돼요.<br/><br/><strong>새 회차를 시작하시겠어요?</strong></div>
                <div className="confirm-row">
                  <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setConfirmReset(false)} disabled={resetting}>취소</button>
                  <button className="btn btn-danger" style={{flex:1,justifyContent:"center"}} onClick={doReset} disabled={resetting}>{resetting?"초기화 중...":"초기화하기"}</button>
                </div>
              </div>
            </div>
          )}

          {(phase==="loading"||phase==="submitting")&&<div className="loading"><div className="spinner"/><span>{phase==="submitting"?"응답을 저장하는 중...":"잠시만 기다려주세요..."}</span></div>}

          {/* INTRO */}
          {phase==="intro"&&(
            <>
              <button className="admin-btn" onClick={handleAdminClick}>⚙ 편집</button>
              <div className="eyebrow">{intro.eyebrow}</div>
              <h1>{intro.title.split("\n").map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>)}</h1>
              <p className="subtitle">{intro.subtitle.split("\n").map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>)}</p>
              {lottery.enabled&&activePrizes.length>0&&(
                <div style={{marginBottom:"24px"}}>
                  <div style={{fontSize:"11px",fontWeight:600,color:"var(--gold)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px"}}>
                    {maxReached?"🎁 이번 회차 추첨 마감":"🎁 퀴즈 완료 후 즉석 추첨"}
                  </div>
                  {!maxReached&&(
                    <div className="prize-list">
                      {activePrizes.map(p=>(
                        <div className="prize-item" key={p.id}>
                          <span className="prize-item-name">🎁 {p.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div style={{display:"flex",gap:"28px",marginBottom:"36px"}}>
                {[`${total}문항`,intro.badge1,intro.badge2].map(t=>(
                  <div key={t} style={{textAlign:"center"}}>
                    <div style={{fontSize:"18px",fontWeight:600,color:"var(--terra)"}}>{t.split(" ")[0]}</div>
                    <div style={{fontSize:"11px",color:"var(--muted)",marginTop:"2px"}}>{t.split(" ").slice(1).join(" ")}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={()=>{setAnswers({});setQuizRevealed({});setStep(0);setWinName("");setWinRegion("");setWinContact("");setConsented(false);go("info");}}>{intro.btnText} <Arrow/></button>
            </>
          )}

          {/* INFO - 개인정보 수집 (설문 시작 전) */}
          {phase==="info"&&(
            <>
              <div className="eyebrow">{intro.eyebrow}</div>
              <h2 style={{marginBottom:"8px"}}>참여자 정보 입력</h2>
              <p className="subtitle" style={{marginBottom:"24px"}}>퀴즈 참여 및 추첨을 위해<br/>아래 정보를 먼저 입력해주세요</p>

              <div className="form-field"><label className="form-label">이름 <span style={{color:"var(--wrong)"}}>*</span></label><input className="form-input" placeholder="홍길동" value={winName} onChange={e=>setWinName(e.target.value)}/></div>
              <div className="form-field"><label className="form-label">사는 곳 (구 또는 시) <span style={{color:"var(--wrong)"}}>*</span></label><input className="form-input" placeholder="예: 마포구 / 수원시" value={winRegion} onChange={e=>setWinRegion(e.target.value)}/></div>
              <div className="form-field" style={{marginBottom:"20px"}}><label className="form-label">전화번호 <span style={{color:"var(--wrong)"}}>*</span></label><input className="form-input" placeholder="010-0000-0000" value={winContact} onChange={e=>setWinContact(e.target.value)}/></div>

              <div className="consent-box" style={{marginBottom:"28px"}}>
                <div className="consent-text">
                  <strong>[개인정보 수집 및 이용 동의]</strong><br/>
                  수집 항목: 이름, 사는 곳, 전화번호<br/>
                  수집 목적: 추첨 이벤트 당첨자 확인 및 경품 발송<br/>
                  보유 기간: 이벤트 종료 후 3개월<br/>
                  위 개인정보 수집·이용에 동의하지 않으실 수 있으며, 미동의 시 추첨 참여가 제한됩니다.
                </div>
                <div className="consent-check-row" onClick={()=>setConsented(v=>!v)}>
                  <div className={`consent-checkbox ${consented?"checked":""}`}>{consented&&<Check/>}</div>
                  <span className="consent-label">개인정보 수집 및 이용에 동의합니다 (필수)</span>
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-ghost" onClick={()=>go("intro")}>← 이전</button>
                <button className="btn btn-primary" onClick={async()=>{
                  try{const wc=await apiGet("winnerCount");if(wc.resetKey)setServerResetKey(wc.resetKey);if(wc.count!==undefined)setWinnerCount(wc.count);if(wc.prizeCount)setPrizeCount(wc.prizeCount);}catch{}
                  go("survey");
                }} disabled={!winName.trim()||!winRegion.trim()||!winContact.trim()||!consented}>퀴즈 시작하기 <Arrow/></button>
              </div>
            </>
          )}

          {/* SURVEY */}
          {phase==="survey"&&q&&(
            <>
              <div className="progress-wrap">
                <div className="progress-dots">{questions.map((_,i)=><div key={i} className={`dot ${i<step?"done":i===step?"active":""}`}/>)}</div>
                <span className="progress-label">{step+1} / {total}</span>
              </div>
              <div className="eyebrow">{q.type==="quiz"?<>퀴즈 {step+1}<span className="quiz-type-badge">🧠 퀴즈</span></>:`질문 ${step+1}`}</div>
              <h2>{q.question}</h2>
              {q.type==="single"&&<div className="options">{q.options.map(opt=><button key={opt} className={`opt ${answers[q.id]===opt?"sel":""}`} onClick={()=>setSingle(opt)}><span className="radio"><span className="radio-inner"/></span>{opt}</button>)}</div>}
              {q.type==="multiple"&&(<><p className="hint">복수 선택 가능합니다</p><div className="options">{q.options.map(opt=>{const sel=(answers[q.id]||[]).includes(opt);return<button key={opt} className={`opt ${sel?"sel":""}`} onClick={()=>setMultiple(opt)}><span className="checkbox">{sel&&<Check/>}</span>{opt}</button>;})}</div></>)}
              {q.type==="text"&&<textarea placeholder={q.placeholder||"자유롭게 작성해 주세요..."} value={answers[q.id]||""} onChange={e=>setText(e.target.value)}/>}
              {q.type==="quiz"&&(<>
                <div className="options">
                  {q.options.map(opt=>{const isSel=answers[q.id]===opt;const isC=opt===q.correctAnswer;const show=quizRevealed[q.id];let cls="opt";if(show){if(isC)cls+=" correct-answer";else if(isSel)cls+=" wrong";}else if(isSel)cls+=" sel";return<button key={opt} className={cls} onClick={()=>setQuiz(opt)} disabled={show}><span className="radio"><span className="radio-inner"/></span>{opt}{show&&isC&&<span style={{marginLeft:"auto"}}>✅</span>}{show&&isSel&&!isC&&<span style={{marginLeft:"auto"}}>❌</span>}</button>;})}
                </div>
                {quizRevealed[q.id]&&<div className={`quiz-feedback ${answers[q.id]===q.correctAnswer?"correct":"wrong"}`}><div className="quiz-feedback-header"><span className="quiz-feedback-icon">{answers[q.id]===q.correctAnswer?"🎉":"😅"}</span><span className="quiz-feedback-title">{answers[q.id]===q.correctAnswer?"정답입니다!":"오답입니다"}</span></div>{answers[q.id]!==q.correctAnswer&&<div className="quiz-feedback-answer">정답: <strong>{q.correctAnswer}</strong></div>}{q.explanation&&<div className="quiz-feedback-explanation">💡 {q.explanation}</div>}</div>}
                {!quizRevealed[q.id]&&<p className="hint" style={{marginBottom:"24px"}}>선택지를 클릭하면 즉시 정답을 확인할 수 있어요</p>}
              </>)}
              <div className="btn-row">
                {step>0&&<button className="btn btn-ghost" onClick={prev}>← 이전</button>}
                <button className="btn btn-primary" onClick={next} disabled={!canNext()}>{step===total-1?"결과 보기":"다음"} <Arrow/></button>
              </div>
            </>
          )}

          {/* RESULTS */}
          {phase==="results"&&(
            <>
              <div className="eyebrow">완료 🎉</div>
              <h1>결과 보기</h1>
              <p className="subtitle" style={{marginBottom:"28px"}}>참여해 주셔서 감사합니다!</p>
              {score&&<div className="quiz-score-box"><div className="quiz-score-num">{score.correct}<span style={{fontSize:"24px",color:"var(--muted)"}}>/{score.total}</span></div><div className="quiz-score-label">퀴즈 점수 · {Math.round(score.correct/score.total*100)}점</div></div>}
              {lottery.enabled&&<div className="lottery-banner" onClick={()=>go("lottery")}><div className="lottery-banner-icon">🎰</div><div className="lottery-banner-text"><div className="lottery-banner-title">즉석 추첨 참여하기 →</div><div className="lottery-banner-desc">{lottery.description}</div></div></div>}
              {questions.map(question=>(
                <div className="result-block" key={question.id}>
                  <div className="result-q-no">{question.type==="quiz"?<>Q{question.id}<span className="quiz-type-badge">🧠</span></>:`Q${question.id}`}</div>
                  <div className="result-q-text">{question.question}</div>
                  {question.type==="quiz"&&(<>{question.options.map(opt=>{const isC=opt===question.correctAnswer;const isM=answers[question.id]===opt;return<div key={opt} className={`quiz-result-opt ${isC?"correct-answer":isM?"wrong-answer":"neutral"}`}><span>{isC?"✅":isM?"❌":"　"}</span><span>{opt}</span>{isC&&<span style={{marginLeft:"auto",fontSize:"12px",fontWeight:600}}>정답</span>}</div>;})}
                  {question.explanation&&<div style={{marginTop:"12px",background:"var(--surface2)",borderLeft:"3px solid var(--correct)",borderRadius:"0 10px 10px 0",padding:"12px 16px",fontSize:"13px",color:"var(--text)",lineHeight:"1.7"}}>💡 {question.explanation}</div>}</>)}
                  {question.type==="text"&&<div className="text-bubble">{answers[question.id]||"(응답 없음)"}</div>}
                  {(question.type==="single"||question.type==="multiple")&&question.options.map(opt=>{const pct=barW[question.id]?.[opt]??0;const mine=question.type==="multiple"?(answers[question.id]||[]).includes(opt):answers[question.id]===opt;return<div className="bar-row" key={opt}><div className={`bar-meta ${mine?"mine":""}`}><span>{mine?"✔ ":""}{opt}</span><span>{pct}%</span></div><div className="bar-track"><div className={`bar-fill ${mine?"mine":""}`} style={{width:`${pct}%`}}/></div></div>;})}
                </div>
              ))}
              <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={()=>go("company")}>저희 센터 알아보기 <Arrow/></button>
            </>
          )}

          {/* LOTTERY */}
          {phase==="lottery"&&(
            <>
              <div className="eyebrow">즉석 추첨 🎰</div>
              <h1 style={{marginBottom:"8px"}}>행운을 긁어보세요!</h1>
              <p className="subtitle" style={{marginBottom:"32px"}}>아래 카드를 클릭하면 당첨 여부를 확인할 수 있어요 ✨</p>

              <div style={{textAlign:"center"}}>
                <div className="scratch-area" onClick={handleReveal}>
                  <div className={`scratch-result ${wonPrize?"win":"lose"}`}>
                    <div className="scratch-result-emoji">{wonPrize?"🎉":"😊"}</div>
                    <div className="scratch-result-text">{wonPrize?"당첨!":"아쉽게도 미당첨"}</div>
                    <div className="scratch-result-sub">{wonPrize?wonPrize.name:"다음 기회에 도전해보세요"}</div>
                  </div>
                  <div className={`scratch-cover ${revealed?"revealed":""}`}>
                    <div className="scratch-cover-text">🎁</div>
                    <div className="scratch-cover-sub">클릭해서 확인하기</div>
                  </div>
                </div>

                {revealed&&wonPrize&&(
                  <div style={{textAlign:"center",padding:"24px",background:"var(--gold-bg)",border:"1px solid var(--gold)",borderRadius:"16px",marginTop:"20px"}}>
                    <div style={{fontSize:"36px",marginBottom:"10px"}}>🎊</div>
                    <div style={{fontFamily:"'Gowun Batang',serif",fontSize:"18px",fontWeight:700,marginBottom:"6px"}}>당첨을 축하드려요!</div>
                    <div style={{fontSize:"13px",color:"var(--gold)",fontWeight:600,marginBottom:"4px"}}>🎁 {wonPrize.name}</div>
                    <div style={{fontSize:"12px",color:"var(--muted)"}}>입력하신 연락처로 안내드릴 예정입니다 😊</div>
                  </div>
                )}
                {revealed&&!wonPrize&&(
                  <div style={{textAlign:"center",padding:"20px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"16px",marginTop:"20px"}}>
                    <div style={{fontSize:"13px",color:"var(--muted)"}}>아쉽지만 다음 기회를 노려보세요!</div>
                  </div>
                )}
              </div>

              <div className="divider"/>
              <div style={{display:"flex",gap:"10px"}}>
                <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>go("results")}>← 결과로</button>
                <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>go("company")}>센터 소개 보기 <Arrow/></button>
              </div>
            </>
          )}

          {/* COMPANY */}
          {phase==="company"&&(
            <>
              <div className="co-header"><div className="co-name">{company.name}</div><div className="co-tag">{company.tagline}</div></div>
              <p style={{fontSize:"15px",color:"var(--muted)",lineHeight:"1.85",marginBottom:"28px",fontWeight:300}}>{company.description}</p>
              <div className="feat-grid">{company.features.map(f=><div className="feat-card" key={f.title}><div className="feat-icon">{f.icon}</div><div className="feat-title">{f.title}</div><div className="feat-desc">{f.desc}</div></div>)}</div>
              <div className="cta-wrap">
                <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={()=>window.open("https://www.mmdcil.or.kr/","_blank")}>{company.cta} <Arrow/></button>
                <p className="cta-contact">{company.contact}</p>
              </div>
              <div className="divider"/>
              <div style={{textAlign:"center"}}><button className="btn btn-ghost" style={{fontSize:"13px"}} onClick={()=>{setAnswers({});setQuizRevealed({});setStep(0);go("intro");}}>다시 시작하기</button></div>
            </>
          )}

          {/* ADMIN */}
          {phase==="admin"&&editQ&&editCo&&editIntro&&editLottery&&(
            <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"28px"}}>
                <div style={{fontFamily:"'Gowun Batang',serif",fontSize:"22px",fontWeight:700}}>⚙ 편집</div>
                <button className="btn btn-ghost" style={{fontSize:"12px",padding:"8px 16px"}} onClick={()=>go("intro")}>취소</button>
              </div>

              {/* 추첨 설정 */}
              <div className="edit-section">
                <div className="section-title">🎁 추첨 설정</div>
                <div className="toggle-row">
                  <span style={{fontSize:"14px",fontWeight:500}}>즉석 추첨 활성화</span>
                  <button className={`toggle ${editLottery.enabled?"on":""}`} onClick={()=>setEditLottery({...editLottery,enabled:!editLottery.enabled})}/>
                </div>
                {editLottery.enabled&&(<>
                  {/* 상품 목록 */}
                  <div className="edit-label">상품 목록 (각 상품별 당첨 확률 독립 설정)</div>
                  {(editLottery.prizes||[]).map((p,pi)=>(
                    <div className="prize-edit-card" key={p.id}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
                        <span style={{fontSize:"11px",color:"var(--muted)",fontWeight:600}}>상품 {pi+1}</span>
                        {(()=>{const stock=Number(p.stock||0);const used=prizeCount[p.name]||0;const full=stock>0&&used>=stock;return stock>0?<span style={{fontSize:"11px",fontWeight:600,color:full?"var(--wrong)":"var(--correct)"}}>{full?"🚫 소진":"✅"} {used}/{stock}개</span>:null;})()}
                      </div>
                      <div className="prize-edit-row">
                        <input className="prize-name-input" placeholder="상품명" value={p.name} onChange={e=>updatePrize(pi,"name",e.target.value)}/>
                        <button className="icon-btn" onClick={()=>delPrize(pi)} disabled={editLottery.prizes.length<=1}>×</button>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"4px"}}>
                        <div>
                          <div style={{fontSize:"10px",color:"var(--muted)",fontWeight:600,letterSpacing:"1px",marginBottom:"4px"}}>당첨 확률</div>
                          <div className="prize-prob-wrap">
                            <input className="prize-prob-input" style={{width:"100%"}} type="number" min="0" max="100" value={p.probability} onChange={e=>updatePrize(pi,"probability",Number(e.target.value))}/>
                            <span className="prize-prob-unit">%</span>
                          </div>
                        </div>
                        <div>
                          <div style={{fontSize:"10px",color:"var(--muted)",fontWeight:600,letterSpacing:"1px",marginBottom:"4px"}}>재고 수량 (0=무제한)</div>
                          <div className="prize-prob-wrap">
                            <input className="prize-prob-input" style={{width:"100%"}} type="number" min="0" value={p.stock||0} onChange={e=>updatePrize(pi,"stock",Number(e.target.value))}/>
                            <span className="prize-prob-unit">개</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:"8px"}} onClick={addPrize}>+ 상품 추가</button>

                  <div className="edit-label" style={{marginTop:"16px"}}>최대 당첨자 수 (0 = 제한 없음)</div>
                  <div className="prob-row"><input className="prob-input" type="number" min="0" value={editLottery.maxWinners} onChange={e=>setEditLottery({...editLottery,maxWinners:Number(e.target.value)})}/><span style={{fontSize:"13px",color:"var(--muted)"}}>명 초과 시 자동 마감</span></div>

                  <div className="edit-label">추첨 안내 문구</div>
                  <input className="edit-field" value={editLottery.description} onChange={e=>setEditLottery({...editLottery,description:e.target.value})}/>

                  {/* 당첨자 현황 */}
                  <div className="winner-status" style={{marginTop:"8px"}}>
                    <div className="winner-status-row">
                      <span className="winner-status-label">이번 회차 당첨자</span>
                      <span className="winner-status-count">{winnerCount}{editLottery.maxWinners>0?` / ${editLottery.maxWinners}명`:""}</span>
                    </div>
                    {editLottery.maxWinners>0&&<div className="winner-status-bar"><div className="winner-status-fill" style={{width:`${winnerPct}%`}}/></div>}
                  </div>
                  <button className="btn btn-danger" style={{width:"100%",justifyContent:"center",marginTop:"4px"}} onClick={()=>setConfirmReset(true)}>🔄 추첨 초기화 (새 회차 시작)</button>
                  <p style={{fontSize:"11px",color:"var(--muted2)",marginTop:"6px",lineHeight:"1.5"}}>초기화하면 당첨자 수가 0으로 리셋되고 이전 참여자도 다시 당첨될 수 있어요.</p>
                </>)}
              </div>

              <div className="divider"/>
              <div className="edit-section">
                <div className="section-title">🏠 메인 페이지</div>
                <div className="edit-label">상단 라벨</div><input className="edit-field" value={editIntro.eyebrow} onChange={e=>setEditIntro({...editIntro,eyebrow:e.target.value})}/>
                <div className="edit-label">제목</div><textarea className="edit-field" style={{height:"90px"}} value={editIntro.title} onChange={e=>setEditIntro({...editIntro,title:e.target.value})}/>
                <div className="edit-label">소개 문구</div><textarea className="edit-field" style={{height:"90px"}} value={editIntro.subtitle} onChange={e=>setEditIntro({...editIntro,subtitle:e.target.value})}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div><div className="edit-label">배지 1</div><input className="edit-field" value={editIntro.badge1} onChange={e=>setEditIntro({...editIntro,badge1:e.target.value})}/></div>
                  <div><div className="edit-label">배지 2</div><input className="edit-field" value={editIntro.badge2} onChange={e=>setEditIntro({...editIntro,badge2:e.target.value})}/></div>
                </div>
                <div className="edit-label">시작 버튼 문구</div><input className="edit-field" value={editIntro.btnText} onChange={e=>setEditIntro({...editIntro,btnText:e.target.value})}/>
              </div>

              <div className="divider"/>
              <div className="edit-section">
                <div className="section-title">🏢 센터 정보</div>
                <div className="edit-label">센터명</div><input className="edit-field" value={editCo.name} onChange={e=>setEditCo({...editCo,name:e.target.value})}/>
                <div className="edit-label">태그라인</div><input className="edit-field" value={editCo.tagline} onChange={e=>setEditCo({...editCo,tagline:e.target.value})}/>
                <div className="edit-label">소개글</div><textarea className="edit-field" style={{height:"90px"}} value={editCo.description} onChange={e=>setEditCo({...editCo,description:e.target.value})}/>
                <div className="edit-label">CTA 버튼 문구</div><input className="edit-field" value={editCo.cta} onChange={e=>setEditCo({...editCo,cta:e.target.value})}/>
                <div className="edit-label">연락처</div><input className="edit-field" value={editCo.contact} onChange={e=>setEditCo({...editCo,contact:e.target.value})}/>
              </div>

              <div className="divider"/>
              <div className="edit-section">
                <div className="section-title">📋 문항 ({editQ.length}개)</div>
                {editQ.map((eq,qi)=>(
                  <div className="edit-q-card" key={eq.id}>
                    <div className="q-num">문항 {qi+1}{eq.type==="quiz"&&<span className="quiz-type-badge">🧠 퀴즈</span>}</div>
                    <button className="del-q-btn" onClick={()=>delQuestion(qi)}>삭제</button>
                    <div className="edit-label">문항 내용</div>
                    <textarea className="edit-field" style={{height:"72px"}} value={eq.question} onChange={e=>updateQ(qi,"question",e.target.value)}/>
                    <div className="edit-label">유형</div>
                    <select className="type-select" value={eq.type} onChange={e=>changeType(qi,e.target.value)}>
                      <option value="single">객관식 (단일 선택)</option>
                      <option value="multiple">객관식 (복수 선택)</option>
                      <option value="text">주관식 (텍스트)</option>
                      <option value="quiz">🧠 퀴즈형 (정답+해설)</option>
                    </select>
                    {eq.type==="text"&&(<><div className="edit-label">안내 문구</div><input className="edit-field" value={eq.placeholder||""} onChange={e=>updateQ(qi,"placeholder",e.target.value)}/></>)}
                    {(eq.type==="single"||eq.type==="multiple")&&(<><div className="edit-label">선택지</div>{(eq.options||[]).map((opt,oi)=><div className="opt-input-row" key={oi}><input className="opt-input" value={opt} onChange={e=>updateOpt(qi,oi,e.target.value)}/><button className="icon-btn" onClick={()=>delOpt(qi,oi)}>×</button></div>)}<button className="btn btn-ghost" style={{fontSize:"12px",padding:"7px 14px",marginTop:"4px"}} onClick={()=>addOpt(qi)}>+ 선택지 추가</button></>)}
                    {eq.type==="quiz"&&(<>
                      <div className="edit-label">선택지 &amp; 정답 (✅ = 정답)</div>
                      {(eq.options||[]).map((opt,oi)=>(
                        <div className="opt-input-row" key={oi}>
                          <button className={`correct-mark ${eq.correctAnswer===opt?"active":""}`} onClick={()=>updateQ(qi,"correctAnswer",opt)}>✅</button>
                          <input className="opt-input" value={opt} onChange={e=>{const old=eq.options[oi];updateOpt(qi,oi,e.target.value);if(eq.correctAnswer===old){const qs=[...editQ];qs[qi]={...qs[qi],correctAnswer:e.target.value};setEditQ(qs);}}}/>
                          <button className="icon-btn" onClick={()=>delOpt(qi,oi)}>×</button>
                        </div>
                      ))}
                      <button className="btn btn-ghost" style={{fontSize:"12px",padding:"7px 14px",marginTop:"4px"}} onClick={()=>addOpt(qi)}>+ 선택지 추가</button>
                      <div className="edit-label">해설</div>
                      <textarea className="edit-field" style={{height:"80px"}} placeholder="정답 선택 후 표시될 해설" value={eq.explanation||""} onChange={e=>updateQ(qi,"explanation",e.target.value)}/>
                    </>)}
                  </div>
                ))}
                <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:"4px"}} onClick={addQuestion}>+ 문항 추가</button>
              </div>

              <div className="divider"/>
              <button className="btn btn-sage" style={{width:"100%",justifyContent:"center"}} onClick={saveAdmin} disabled={saving}>
                {saving?"저장 중...":"저장하고 적용하기"} {!saving&&<Arrow/>}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
