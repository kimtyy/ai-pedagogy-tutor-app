/**
 * AI 리터러시 & 맞춤형 프롬프트 튜터 (SPA)
 * AI교수법기초 과제 제출용 웹 애플리케이션
 * 
 * 주요 기능 모듈:
 * 1. 탭 네비게이션 제어
 * 2. ZPD 적응형 퀴즈 엔진 (스캐폴딩 힌트, 오답 추적, 첫 시도 정답률)
 * 3. RCTF 프롬프트 빌더 (실시간 조합, 프리셋, 클립보드 복사, 토스트)
 * 4. 학습 대시보드 (통계 계산, ZPD 교수학적 맞춤 피드백, 성찰 노트)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. 데이터 정의 (Data Definitions)
     ========================================================================== */

  // ZPD 적응형 퀴즈 문항 데이터
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      category: "교육공학 이론 (ZPD & 비계설정)",
      difficulty: "보통",
      question: "비고츠키(Vygotsky)의 '근접발달영역(ZPD)' 이론에 근거하여 생성형 AI를 수업에 보조 튜터로 활용할 때, 교수학적으로 가장 바람직한 AI의 상호작용 방식은 무엇인가요?",
      options: [
        {
          id: "A",
          text: "학습자가 질문하면 즉시 완성된 최종 모범 정답과 전체 풀이과정을 한 번에 제공한다.",
          isCorrect: false,
          scaffoldHint: "단순히 완성된 정답을 제공하는 것은 학습자의 인지적 노력을 생략시키고 의존성을 높입니다. 비고츠키가 말한 '비계(Scaffolding)'의 원래 역할을 떠올려보세요."
        },
        {
          id: "B",
          text: "학습자의 현재 이해도를 진단하고, 스스로 답을 찾을 수 있도록 단계별 유도 질문과 인지적 단서(비계)를 점진적으로 제공한다.",
          isCorrect: true,
          scaffoldHint: null
        },
        {
          id: "C",
          text: "어려운 문제일수록 학생의 실제적 발달 수준보다 훨씬 높은 고난도 대학 수준의 전문 이론을 제시한다.",
          isCorrect: false,
          scaffoldHint: "ZPD는 '실제적 발달 수준' 바로 위의 도달 가능한 '잠재적 발달 수준' 사이의 영역입니다. 너무 높은 난도는 학습자에게 인지적 과부하와 좌절을 유발합니다."
        },
        {
          id: "D",
          text: "모든 힌트와 피드백을 중단하고, 학생 스스로 완전히 혼자 해결할 때까지 일체의 개입을 금지한다.",
          isCorrect: false,
          scaffoldHint: "유능한 타자(교수자나 AI)의 적시 조력이 없으면 ZPD 영역에서의 도약이 일어나기 어렵습니다. '발판'을 제공해주는 방식이 필요합니다."
        }
      ],
      explanation: "정답은 **B번**입니다! 비고츠키의 ZPD(근접발달영역)에서 조력자(교사 또는 적응형 AI)의 핵심 역할은 '정답 자판기'가 아니라, 학습자가 스스로 잠재적 발달 수준에 도달할 수 있도록 인지적 사다리(Scaffolding)를 점진적으로 놓아주고 과제 해결 후 점차 비계를 걷어내는(Fading) 것입니다.",
      generalHint: "💡 비고츠키의 '비계설정(Scaffolding)'은 건축 공사장의 임시 가설물처럼, 학습자가 스스로 지식을 구성할 수 있도록 돕는 일시적 안내와 유도 발문을 의미합니다."
    },
    {
      id: 2,
      category: "AI 리터러시 & 교수자 역할",
      difficulty: "중요",
      question: "생성형 AI가 그럴듯하지만 사실과 다른 허위 정보를 생성하는 '환각(Hallucination)' 현상이 빈번합니다. 이에 대응하여 교수자가 수업 중에 반드시 수행해야 할 고유한 교수학적 영역은 무엇인가요?",
      options: [
        {
          id: "A",
          text: "AI가 생성한 텍스트를 학생들에게 100% 신뢰하도록 권장하고 비판적 검토 과정을 생략한다.",
          isCorrect: false,
          scaffoldHint: "AI의 출력을 무비판적으로 수용하면 잘못된 오개념이 고착화될 수 있습니다. 교사의 비판적 리터러시 지도가 필수적입니다."
        },
        {
          id: "B",
          text: "학생들에게 AI의 출력을 맹신하지 않고 다양한 출처와 교과서를 통해 팩트체크하며 비판적으로 교차 검증하는 능력을 지도한다.",
          isCorrect: true,
          scaffoldHint: null
        },
        {
          id: "C",
          text: "환각 위험이 있으므로 학교 현장에서 모든 디지털 도구와 AI의 접근을 전면 금지하고 차단한다.",
          isCorrect: false,
          scaffoldHint: "단순한 차단은 미래 사회에 필요한 AI 리터러시 함양 기회를 박탈합니다. 위험을 인지하고 다룰 수 있는 능력을 키워주는 것이 교육의 목적입니다."
        },
        {
          id: "D",
          text: "환각 검증은 기술 개발 기업의 책임이므로 교수자는 결과물의 오탈자 교정만 담당한다.",
          isCorrect: false,
          scaffoldHint: "교육적 맥락에서 학습자의 올바른 개념 형성을 책임지는 최종 주체는 교수자입니다. 내용의 타당성과 윤리성을 검증하는 것은 교사의 핵심 전문성입니다."
        }
      ],
      explanation: "정답은 **B번**입니다! AI는 효율적인 초안 작성 도구이지만, 생성된 내용의 진위와 윤리성을 분별하는 비판적 사고력(Critical Literacy)은 인간 교수자가 학생들에게 길러주어야 할 대체 불가능한 고유 영역입니다.",
      generalHint: "💡 환각(Hallucination)에 대처하는 가장 효과적인 교육 방법은 'AI의 결과를 의심하고 검증하는 탐구 과제'로 전환하여 학생의 비판적 분석력을 자극하는 것입니다."
    },
    {
      id: 3,
      category: "프롬프트 엔지니어링 (RCTF 구조)",
      difficulty: "실습",
      question: "효과적인 교육용 프롬프트 작성을 위한 'RCTF(Role-Context-Task-Format)' 구조 중, [학습자의 학년, 사전 이해도, 수업 단원, 특수 교육적 요구사항]을 구체적으로 서술하는 구성 요소는 무엇인가요?",
      options: [
        {
          id: "A",
          text: "Role (역할 지정): AI에게 부여하는 페르소나와 전문적 성격",
          isCorrect: false,
          scaffoldHint: "Role은 '너는 초등 과학교사야'처럼 AI 자체의 정체성과 말투를 규정하는 단계입니다. 학습자의 환경이나 수업 상황을 기술하는 항목을 생각해보세요."
        },
        {
          id: "B",
          text: "Context (맥락 및 환경): 학습자 특성, 수업 배경, 선수 지식 및 상황 설정",
          isCorrect: true,
          scaffoldHint: null
        },
        {
          id: "C",
          text: "Task (과업 지시): AI가 실행해야 할 구체적인 교육적 활동 명령",
          isCorrect: false,
          scaffoldHint: "Task는 '오개념 유도 질문 3개를 만들어줘'와 같은 구체적 지시사항입니다. 대상 학습자의 수준과 배경 정보가 담기는 축을 찾아보세요."
        },
        {
          id: "D",
          text: "Format (출력 양식): 결과물을 표, 마크다운, 리스트 등으로 지정하는 형태",
          isCorrect: false,
          scaffoldHint: "Format은 '3열 마크다운 표로 작성해줘'처럼 외형적 출력 형식을 뜻합니다. 교육 대상과 환경을 정의하는 요소를 골라보세요."
        }
      ],
      explanation: "정답은 **B번**입니다! **Context(맥락)**는 AI에게 '누구를 가르치는지', '어떤 배경지식을 가진 학생인지'를 알려주는 핵심 축입니다. Context가 정밀할수록 AI는 학습자의 실제 발달 수준에 부합하는 정교한 맞춤형 비계를 형성할 수 있습니다.",
      generalHint: "💡 맥락(Context)이 구체적일수록 AI는 일반론적 답변에서 벗어나 학습자의 인지 수준에 꼭 맞춘 수준별 피드백을 산출할 수 있습니다."
    }
  ];

  // RCTF 빌더용 프리셋 템플릿
  const RCTF_PRESETS = {
    science: {
      role: "너는 15년 차 초등학교 과학교사이자 비고츠키의 ZPD 이론을 실천하는 발문 전문 튜터야.",
      context: "초등학교 5학년 2학기 '식물의 구조와 기능' 단원이며, 학생들은 '식물은 뿌리로만 숨을 쉰다'는 흔한 오개념을 가지고 있어. 사전 지식 수준은 중간 정도야.",
      task: "학생이 자신의 오개념을 스스로 인지할 수 있도록 즉시 정답을 알려주지 말고, 일상 속 경험을 떠올릴 수 있는 3단계 유도 질문(스캐폴딩 비계)을 작성해줘.",
      format: "1) 핵심 오개념 진단, 2) 3단계 유도 질문 리스트, 3) 교사용 코칭 팁을 마크다운 3열 표(Table)로 구조화하여 출력해줘."
    },
    english: {
      role: "너는 중학교 영어과 수석교사이자 학습자 맞춤형 형성평가 피드백 설계자야.",
      context: "중학교 2학년 '관계대명사 who/which' 단원 수업 후 형성평가를 진행함. 기본 문법 규칙은 암기했으나 주격과 목적격 관계대명사 구분을 자주 헷갈려 함.",
      task: "상위권, 중위권, 기초학력 지원 학생 3개 집단별로 파이비오의 이중 부호화 이론을 적용한 맞춤형 오류 수정 피드백 및 시각적 예문을 생성해줘.",
      format: "각 수준별로 [진단 요약], [이중 부호화 시각화 텍스트 도식], [맞춤 피드백 메시지]를 블록 인용문과 불릿 포인트로 작성해줘."
    },
    math: {
      role: "너는 소크라테스식 문답법으로 학생의 자기주도적 문제해결력을 신장시키는 고등학교 수학 전담 튜터야.",
      context: "고1 '이차함수의 최대·최소' 단원. 제한된 범위에서의 최댓값 구하기 문제에서 축의 위치가 범위 안에 있는지 확인하지 않고 무조건 꼭짓점만 대입하는 실수를 범함.",
      task: "문제를 대신 풀어주지 말고, 학생이 그래프의 축(대칭축)과 주어진 정의역의 관계를 스스로 그리며 깨달을 수 있는 단계별 힌트 질문 3개를 순차적으로 제시해줘.",
      format: "[1단계 관찰 질문] -> [2단계 인지갈등 유발 질문] -> [3단계 개념도약 질문] 순서로 이모지와 함께 친절한 대화체로 작성해줘."
    },
    rubric: {
      role: "너는 교육과정-수업-평가-기록 일체화 전문가이자 과정중심평가 루브릭 설계자야.",
      context: "중3 사회 '기후변화와 지속가능한 발전' 모둠 탐구 프로젝트. 학생들은 보고서 작성과 발표를 병행함.",
      task: "AI 도구를 활용한 탐구 윤리 준수, 정보의 비판적 검증(환각 검증 태도), 그리고 창의적 해결방안 도출을 평가할 수 있는 과정중심평가 루브릭을 제작해줘.",
      format: "평가 기준(항목), 탁월(A), 보통(B), 노력요함(C)의 4개 열로 구성된 상세 마크다운 표(Table)로 작성해줘."
    },
    custom: {
      role: "",
      context: "",
      task: "",
      format: ""
    }
  };

  /* ==========================================================================
     2. 앱 상태 관리 (State Management)
     ========================================================================== */
  const state = {
    currentTab: 'tab-concepts',
    quiz: {
      currentIndex: 0,
      totalQuestions: QUIZ_QUESTIONS.length,
      userAnswers: {}, // { [qIndex]: { selectedOptionId, isCorrect, attempts, hintCount, firstAttemptSuccess } }
      globalScaffoldCount: 0,
      isAnsweredCurrent: false
    },
    builder: {
      role: "",
      context: "",
      task: "",
      format: "",
      currentPreset: "science"
    },
    reflection: ""
  };

  /* ==========================================================================
     3. DOM 요소 캐싱 (Element Selectors)
     ========================================================================== */
  const DOM = {
    // 탭
    tabs: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    quizProgressChip: document.getElementById('quizProgressChip'),

    // 퀴즈
    quizCard: document.getElementById('quizCard'),
    quizCategory: document.getElementById('quizCategory'),
    quizDifficulty: document.getElementById('quizDifficulty'),
    quizQuestionTitle: document.getElementById('quizQuestionTitle'),
    quizOptionsList: document.getElementById('quizOptionsList'),
    quizFeedbackBox: document.getElementById('quizFeedbackBox'),
    quizCurrentStepText: document.getElementById('quizCurrentStepText'),
    quizProgressBar: document.getElementById('quizProgressBar'),
    scaffoldCount: document.getElementById('scaffoldCount'),
    nextQuestionBtn: document.getElementById('nextQuestionBtn'),
    requestHintBtn: document.getElementById('requestHintBtn'),
    resetQuizBtn: document.getElementById('resetQuizBtn'),

    // 빌더
    presetBtns: document.querySelectorAll('.preset-btn'),
    inputRole: document.getElementById('inputRole'),
    inputContext: document.getElementById('inputContext'),
    inputTask: document.getElementById('inputTask'),
    inputFormat: document.getElementById('inputFormat'),
    promptCodePreview: document.getElementById('promptCodePreview'),
    promptCharCount: document.getElementById('promptCharCount'),
    copyPromptBtn: document.getElementById('copyPromptBtn'),
    quickChips: document.querySelectorAll('.quick-chips .chip'),

    // 대시보드
    statSolvedCount: document.getElementById('statSolvedCount'),
    statSolvedBar: document.getElementById('statSolvedBar'),
    statHintCount: document.getElementById('statHintCount'),
    statHintSubtext: document.getElementById('statHintSubtext'),
    statFirstPassRate: document.getElementById('statFirstPassRate'),
    statPassSubtext: document.getElementById('statPassSubtext'),
    statZpdLevel: document.getElementById('statZpdLevel'),
    statZpdLevelSub: document.getElementById('statZpdLevelSub'),
    reportBadge: document.getElementById('reportBadge'),
    reportBody: document.getElementById('reportBody'),
    refreshDashboardBtn: document.getElementById('refreshDashboardBtn'),
    exportReportBtn: document.getElementById('exportReportBtn'),
    reflectionNotes: document.getElementById('reflectionNotes'),
    saveReflectionBtn: document.getElementById('saveReflectionBtn'),
    reflectionSaveStatus: document.getElementById('reflectionSaveStatus'),

    // 글로벌
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    quickHelpBtn: document.getElementById('quickHelpBtn'),
    helpModal: document.getElementById('helpModal'),
    closeHelpModalBtn: document.getElementById('closeHelpModalBtn'),
    confirmHelpModalBtn: document.getElementById('confirmHelpModalBtn')
  };

  /* ==========================================================================
     4. 탭 제어 모듈 (Tab Navigation)
     ========================================================================== */
  function switchTab(tabId) {
    if (!tabId) return;
    state.currentTab = tabId;

    // 탭 버튼 활성화
    DOM.tabs.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 탭 페인 활성화 & 애니메이션
    DOM.tabPanes.forEach(pane => {
      if (pane.id === tabId) {
        pane.classList.add('active');
        pane.classList.add('fade-in');
      } else {
        pane.classList.remove('active');
        pane.classList.remove('fade-in');
      }
    });

    // 대시보드 탭 진입 시 실시간 통계 갱신
    if (tabId === 'tab-dashboard') {
      updateDashboard();
    }

    // 윈도우 스크롤 상단으로 부드럽게
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 외부(HTML onclick 등)에서 접근 가능하도록 전역 노출
  window.switchTab = switchTab;

  /* ==========================================================================
     5. ZPD 적응형 퀴즈 엔진 (Adaptive Quiz Engine)
     ========================================================================== */
  function initQuiz() {
    renderCurrentQuestion();
    updateQuizProgressUI();
  }

  function resetQuiz() {
    state.quiz.currentIndex = 0;
    state.quiz.userAnswers = {};
    state.quiz.globalScaffoldCount = 0;
    state.quiz.isAnsweredCurrent = false;

    renderCurrentQuestion();
    updateQuizProgressUI();
    showToast("퀴즈가 초기화되었습니다. 다시 도전해보세요!", "info");
  }

  function renderCurrentQuestion() {
    const qIndex = state.quiz.currentIndex;
    const qData = QUIZ_QUESTIONS[qIndex];
    if (!qData) return;

    // 현재 문항 기록 초기화 (없을 경우)
    if (!state.quiz.userAnswers[qIndex]) {
      state.quiz.userAnswers[qIndex] = {
        selectedOptionId: null,
        isCorrect: false,
        attempts: 0,
        hintCount: 0,
        firstAttemptSuccess: null
      };
    }

    const currentRecord = state.quiz.userAnswers[qIndex];
    state.quiz.isAnsweredCurrent = currentRecord.isCorrect;

    // 헤더 및 타이틀 업데이트
    DOM.quizCategory.textContent = qData.category;
    DOM.quizDifficulty.innerHTML = `<i class="fa-solid fa-bolt"></i> 난이도: ${qData.difficulty}`;
    DOM.quizQuestionTitle.textContent = `Q${qData.id}. ${qData.question}`;

    // 선택지 리스트 렌더링
    DOM.quizOptionsList.innerHTML = '';
    qData.options.forEach(opt => {
      const optBtn = document.createElement('button');
      optBtn.type = 'button';
      optBtn.className = 'option-item';
      optBtn.setAttribute('data-option-id', opt.id);

      // 이미 정답 맞춘 상태라면 스타일 고정
      if (currentRecord.isCorrect) {
        if (opt.isCorrect) {
          optBtn.classList.add('correct');
        }
        optBtn.disabled = true;
      }

      optBtn.innerHTML = `
        <span class="option-index">${opt.id}</span>
        <span class="option-text">${opt.text}</span>
        <span class="option-icon"></span>
      `;

      optBtn.addEventListener('click', () => handleOptionSelect(opt.id));
      DOM.quizOptionsList.appendChild(optBtn);
    });

    // 피드백 박스 초기화 또는 이전 피드백 복원
    if (currentRecord.isCorrect) {
      showCorrectFeedback(qData.explanation);
      DOM.nextQuestionBtn.disabled = false;
    } else {
      DOM.quizFeedbackBox.className = 'quiz-feedback-box hidden';
      DOM.quizFeedbackBox.innerHTML = '';
      DOM.nextQuestionBtn.disabled = true;
    }

    // 다음 문항 버튼 텍스트 변경 (마지막 문항인 경우)
    if (qIndex === state.quiz.totalQuestions - 1) {
      DOM.nextQuestionBtn.innerHTML = `<span>대시보드에서 결과 확인</span> <i class="fa-solid fa-square-poll-vertical"></i>`;
    } else {
      DOM.nextQuestionBtn.innerHTML = `<span>다음 문항</span> <i class="fa-solid fa-arrow-right"></i>`;
    }
  }

  function handleOptionSelect(optionId) {
    const qIndex = state.quiz.currentIndex;
    const qData = QUIZ_QUESTIONS[qIndex];
    const record = state.quiz.userAnswers[qIndex];

    // 이미 정답을 맞춘 상태면 무시
    if (record.isCorrect) return;

    record.attempts += 1;
    record.selectedOptionId = optionId;

    const selectedOption = qData.options.find(o => o.id === optionId);
    if (!selectedOption) return;

    const optButtons = DOM.quizOptionsList.querySelectorAll('.option-item');
    const clickedBtn = DOM.quizOptionsList.querySelector(`[data-option-id="${optionId}"]`);

    if (selectedOption.isCorrect) {
      // [정답 선택 시]
      record.isCorrect = true;
      if (record.attempts === 1) {
        record.firstAttemptSuccess = true;
      } else {
        record.firstAttemptSuccess = false;
      }

      // 버튼 스타일 업데이트
      if (clickedBtn) {
        clickedBtn.classList.remove('wrong');
        clickedBtn.classList.add('correct');
        const icon = clickedBtn.querySelector('.option-icon');
        if (icon) icon.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i>`;
      }

      // 다른 버튼 비활성화
      optButtons.forEach(btn => {
        if (btn !== clickedBtn) btn.disabled = true;
      });

      // 초록색 축하 피드백 및 상세 해설 노출
      showCorrectFeedback(qData.explanation);
      DOM.nextQuestionBtn.disabled = false;
      showToast("정답입니다! 비고츠키적 도약에 성공하셨습니다. 🎉", "success");

    } else {
      // [오답 선택 시] - 단순 정답 노출 방지 & 스캐폴딩 힌트 제공!
      if (record.firstAttemptSuccess === null) {
        record.firstAttemptSuccess = false;
      }
      record.hintCount += 1;
      state.quiz.globalScaffoldCount += 1;

      // 버튼 스타일 (빨간색 진동 효과)
      if (clickedBtn) {
        clickedBtn.classList.add('wrong');
        const icon = clickedBtn.querySelector('.option-icon');
        if (icon) icon.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose"></i>`;
      }

      // 노란색/앰버 스캐폴딩 힌트 동적 노출
      showScaffoldingHint(selectedOption.scaffoldHint || qData.generalHint, record.attempts);
      showToast("오답입니다. 제공된 비계 힌트를 참고하여 다시 생각해보세요!", "warning");
    }

    updateQuizProgressUI();
  }

  function showScaffoldingHint(hintText, attempts) {
    DOM.quizFeedbackBox.className = 'quiz-feedback-box feedback-hint';
    DOM.quizFeedbackBox.innerHTML = `
      <div class="feedback-header">
        <i class="fa-solid fa-stairs"></i>
        <span>[ZPD 스캐폴딩 힌트] (시도 #${attempts})</span>
      </div>
      <div class="feedback-body">
        <p><strong>사고를 돕는 안내:</strong> ${hintText}</p>
        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--amber-700);">
          <i class="fa-solid fa-circle-exclamation"></i> 정답을 바로 알려주지 않습니다. 위의 비계를 딛고 정답을 다시 유추해보세요!
        </p>
      </div>
    `;
    DOM.quizFeedbackBox.classList.remove('hidden');
  }

  function showCorrectFeedback(explanationText) {
    DOM.quizFeedbackBox.className = 'quiz-feedback-box feedback-correct';
    DOM.quizFeedbackBox.innerHTML = `
      <div class="feedback-header">
        <i class="fa-solid fa-circle-check"></i>
        <span>정답입니다! 훌륭한 교육학적 통찰입니다.</span>
      </div>
      <div class="feedback-body">
        <p>${explanationText}</p>
      </div>
    `;
    DOM.quizFeedbackBox.classList.remove('hidden');
  }

  function handleRequestHint() {
    const qIndex = state.quiz.currentIndex;
    const qData = QUIZ_QUESTIONS[qIndex];
    const record = state.quiz.userAnswers[qIndex];

    record.hintCount += 1;
    state.quiz.globalScaffoldCount += 1;
    updateQuizProgressUI();

    showScaffoldingHint(qData.generalHint, record.attempts || 1);
    showToast("생각 열기 힌트가 제공되었습니다.", "info");
  }

  function handleNextQuestion() {
    if (state.quiz.currentIndex < state.quiz.totalQuestions - 1) {
      state.quiz.currentIndex += 1;
      renderCurrentQuestion();
      updateQuizProgressUI();
    } else {
      // 3문항 완료 -> 대시보드로 이동
      showToast("모든 퀴즈를 완료했습니다! 학습 대시보드로 이동합니다.", "success");
      switchTab('tab-dashboard');
    }
  }

  function updateQuizProgressUI() {
    const qIndex = state.quiz.currentIndex;
    const total = state.quiz.totalQuestions;

    // 카운터 텍스트 & 칩
    DOM.quizCurrentStepText.textContent = `문항 ${qIndex + 1} / ${total}`;
    
    // 완료된 문항 수 카운트
    let solvedCount = 0;
    Object.values(state.quiz.userAnswers).forEach(ans => {
      if (ans.isCorrect) solvedCount += 1;
    });

    DOM.quizProgressChip.textContent = `${solvedCount}/${total}`;
    DOM.scaffoldCount.textContent = state.quiz.globalScaffoldCount;

    // 프로그레스 바 너비 (%)
    const progressPercent = ((qIndex + 1) / total) * 100;
    DOM.quizProgressBar.style.width = `${progressPercent}%`;
  }

  /* ==========================================================================
     6. RCTF 프롬프트 빌더 모듈 (Prompt Builder)
     ========================================================================== */
  function initBuilder() {
    // 기본 프리셋(science) 로딩
    applyPreset('science');

    // 폼 입력 이벤트 리스너 (실시간 조합)
    DOM.inputRole.addEventListener('input', onBuilderInput);
    DOM.inputContext.addEventListener('input', onBuilderInput);
    DOM.inputTask.addEventListener('input', onBuilderInput);
    DOM.inputFormat.addEventListener('input', onBuilderInput);

    // 프리셋 버튼 리스너
    DOM.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const presetKey = btn.getAttribute('data-preset');
        applyPreset(presetKey);
      });
    });

    // 퀵 칩 클릭 이벤트
    DOM.quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const parent = chip.closest('.quick-chips');
        const targetId = parent.getAttribute('data-target');
        const val = chip.getAttribute('data-val');
        const targetInput = document.getElementById(targetId);
        if (targetInput) {
          targetInput.value = val;
          onBuilderInput();
          showToast("추천 텍스트가 적용되었습니다.", "info");
        }
      });
    });

    // 클립보드 복사 버튼
    DOM.copyPromptBtn.addEventListener('click', copyPromptToClipboard);
  }

  function applyPreset(presetKey) {
    const preset = RCTF_PRESETS[presetKey];
    if (!preset) return;

    state.builder.currentPreset = presetKey;
    state.builder.role = preset.role;
    state.builder.context = preset.context;
    state.builder.task = preset.task;
    state.builder.format = preset.format;

    DOM.inputRole.value = preset.role;
    DOM.inputContext.value = preset.context;
    DOM.inputTask.value = preset.task;
    DOM.inputFormat.value = preset.format;

    updatePromptPreview();
  }

  function onBuilderInput() {
    state.builder.role = DOM.inputRole.value.trim();
    state.builder.context = DOM.inputContext.value.trim();
    state.builder.task = DOM.inputTask.value.trim();
    state.builder.format = DOM.inputFormat.value.trim();

    updatePromptPreview();
  }

  function generateCompiledPrompt() {
    const { role, context, task, format } = state.builder;

    const r = role || "(지정되지 않음: 교수자 페르소나 및 전문성을 입력해주세요)";
    const c = context || "(지정되지 않음: 학습자 학년, 선수 지식, 수업 단원을 입력해주세요)";
    const t = task || "(지정되지 않음: AI가 수행할 구체적인 교육적 과업을 입력해주세요)";
    const f = format || "(지정되지 않음: 표, 마크다운, 리스트 등 출력 양식을 입력해주세요)";

    return `### [AI교수법 맞춤형 RCTF 프롬프트]

[1. Role (교수적 페르소나 및 역할)]
${r}

[2. Context (학습자 특성 및 수업 맥락)]
${c}

[3. Task (구체적 과업 및 교수학적 행동 지침)]
${t}

[4. Format (출력 양식 및 시각적 구조)]
${f}

---
* 안내: 본 프롬프트는 비고츠키의 ZPD 비계설정 및 파이비오의 이중 부호화 원리를 반영하도록 설계되었습니다.`;
  }

  function updatePromptPreview() {
    const compiled = generateCompiledPrompt();
    DOM.promptCodePreview.innerHTML = `<code>${escapeHtml(compiled)}</code>`;
    DOM.promptCharCount.innerHTML = `<i class="fa-solid fa-text-width"></i> 총 ${compiled.length}자`;
  }

  function copyPromptToClipboard() {
    const compiled = generateCompiledPrompt();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(compiled).then(() => {
        showToast("프롬프트가 클립보드에 복사되었습니다! 🎉", "success");
      }).catch(err => {
        fallbackCopyText(compiled);
      });
    } else {
      fallbackCopyText(compiled);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast("프롬프트가 클립보드에 복사되었습니다! 🎉", "success");
    } catch (err) {
      showToast("복사에 실패했습니다. 수동으로 복사해주세요.", "error");
    }
    document.body.removeChild(textArea);
  }

  /* ==========================================================================
     7. 학습 대시보드 및 ZPD 진단 엔진 (Dashboard & Diagnostics)
     ========================================================================== */
  function updateDashboard() {
    let solvedCount = 0;
    let firstPassCount = 0;
    const total = state.quiz.totalQuestions;

    Object.values(state.quiz.userAnswers).forEach(ans => {
      if (ans.isCorrect) {
        solvedCount += 1;
        if (ans.firstAttemptSuccess === true) {
          firstPassCount += 1;
        }
      }
    });

    // 1) 총 푼 문제 수
    DOM.statSolvedCount.textContent = solvedCount;
    const solvedRate = (solvedCount / total) * 100;
    DOM.statSolvedBar.style.width = `${solvedRate}%`;

    // 2) 받은 힌트(비계) 횟수
    const hintCount = state.quiz.globalScaffoldCount;
    DOM.statHintCount.textContent = hintCount;
    if (hintCount === 0) {
      DOM.statHintSubtext.textContent = "힌트 없이 독립적으로 해결 중입니다.";
    } else if (hintCount <= 2) {
      DOM.statHintSubtext.textContent = "적절한 수준의 비계를 효과적으로 활용했습니다.";
    } else {
      DOM.statHintSubtext.textContent = "풍부한 비계를 발판삼아 개념을 심화하고 있습니다.";
    }

    // 3) 첫 시도 정답률
    let passRate = 0;
    if (solvedCount > 0) {
      passRate = Math.round((firstPassCount / solvedCount) * 100);
    }
    DOM.statFirstPassRate.textContent = passRate;
    DOM.statPassSubtext.textContent = `첫 시도 통과: ${firstPassCount} / ${solvedCount} 문항`;

    // 4) ZPD 발달 진단 레벨 및 맞춤형 피드백 생성
    renderPedagogyReport(solvedCount, total, hintCount, passRate);
  }

  function renderPedagogyReport(solvedCount, total, hintCount, passRate) {
    if (solvedCount === 0) {
      DOM.statZpdLevel.textContent = "진단 대기 중";
      DOM.statZpdLevelSub.textContent = "퀴즈를 풀면 자동 진단됩니다.";
      DOM.reportBadge.textContent = "퀴즈 미시작";
      DOM.reportBadge.style.color = "var(--slate-500)";
      DOM.reportBadge.style.backgroundColor = "var(--slate-100)";
      DOM.reportBody.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-question"></i>
          <p>아직 퀴즈 풀이가 시작되지 않았습니다. [2. ZPD 적응형 퀴즈] 탭에서 문제를 풀고 오시면 비고츠키의 ZPD 및 비계 활용 패턴을 종합 진단해 드립니다.</p>
          <button class="btn btn-primary" onclick="window.switchTab('tab-quiz')">
            <i class="fa-solid fa-play"></i> 퀴즈 풀러 가기
          </button>
        </div>
      `;
      return;
    }

    // 상태 판별
    let levelTitle = "";
    let levelSub = "";
    let pedagogyComment = "";
    let aiImplicationComment = "";

    if (solvedCount < total) {
      DOM.reportBadge.textContent = `진행 중 (${solvedCount}/${total})`;
      DOM.reportBadge.style.color = "var(--primary-700)";
      DOM.reportBadge.style.backgroundColor = "var(--primary-50)";
      levelTitle = "탐색형 학습자";
      levelSub = `남은 ${total - solvedCount}문항을 모두 풀어보세요.`;
      pedagogyComment = `현재 총 ${total}문항 중 ${solvedCount}문항을 해결하며 비계(Scaffolding) 적응 훈련을 진행하고 있습니다. 오답을 두려워하지 말고 제공되는 스캐폴딩 힌트를 적극적으로 디딤돌 삼아보세요.`;
      aiImplicationComment = `AI 튜터는 학생의 수준에 맞추어 점진적으로 힌트를 조절해야 합니다. 남은 문항에서도 AI의 역할과 RCTF 프레임워크를 의식하며 풀어보세요.`;
    } else {
      DOM.reportBadge.textContent = "진단 완료 (3/3 완주)";
      DOM.reportBadge.style.color = "var(--emerald-700)";
      DOM.reportBadge.style.backgroundColor = "var(--emerald-50)";

      if (passRate === 100 && hintCount === 0) {
        levelTitle = "독립적 마스터 (Self-Directed Master)";
        levelSub = "실제적 발달 수준 최상위권 도달";
        pedagogyComment = `놀랍습니다! 모든 문항을 비계(힌트)의 도움 없이 첫 시도에 완벽히 해결했습니다. 이는 비고츠키가 정의한 '실제적 발달 수준(혼자서 자율적으로 문제를 해결할 수 있는 수준)'이 이미 AI교수법 이론 전반에 걸쳐 탄탄하게 구축되었음을 의미합니다.`;
        aiImplicationComment = `이제 학습자는 단순 수용자가 아닌, 다른 교원이나 학생들에게 비계를 설계해주는 '유능한 동료(More Knowledgeable Other, MKO)'로서의 역할을 수행할 수 있습니다. 3번 탭의 RCTF 빌더에서 고난도 맞춤형 프롬프트를 설계해보세요!`;
      } else if (hintCount > 0 && passRate >= 33) {
        levelTitle = "비계 도약형 탐구자 (ZPD Leap Explorer)";
        levelSub = "근접발달영역(ZPD)의 전형적 성공 모델";
        pedagogyComment = `가장 이상적인 비고츠키적 배움의 궤적을 보여주셨습니다! 비록 첫 시도에 오답이 있었으나, 시스템이 제공한 노란색 스캐폴딩 힌트(비계)를 디딤돌 삼아 인지적 갈등을 해소하고 스스로 최종 정답을 찾아냈습니다.`;
        aiImplicationComment = `교실 수업에서 AI 튜터의 진정한 가치는 바로 이 지점에 있습니다. 정답을 쉽게 주는 것이 아니라, ${hintCount}회의 비계를 제공하여 학생이 잠재적 발달 수준으로 스스로 도약하도록 유도하는 AI 교수설계를 직접 체득하셨습니다.`;
      } else {
        levelTitle = "성장형 도전자 (Growth-oriented Learner)";
        levelSub = "풍부한 비계를 통한 개념 정립 단계";
        pedagogyComment = `다양한 비계 힌트를 탐색하며 개념을 꼼꼼하게 다졌습니다. 비고츠키는 발달이 선천적인 것이 아니라 풍부한 상호작용과 조력 속에서 피어난다고 보았습니다. 힌트를 많이 활용한 것은 학습에 대한 적극적 참여의 증거입니다.`;
        aiImplicationComment = `기초 학력 지원이 필요한 학생들에게는 세분화된 단계별 비계가 필수적입니다. [1. 핵심 개념 탐구] 카드를 복습하고, RCTF 프롬프트의 Task에 '쉬운 일상 비유와 3단계 힌트'를 포함시키는 전략을 추천합니다.`;
      }
    }

    DOM.statZpdLevel.textContent = levelTitle;
    DOM.statZpdLevelSub.textContent = levelSub;

    DOM.reportBody.innerHTML = `
      <div class="report-section">
        <h4><i class="fa-solid fa-graduation-cap text-purple"></i> 비고츠키(Vygotsky) ZPD 관점의 종합 진단</h4>
        <p>${pedagogyComment}</p>
      </div>
      <div class="report-section">
        <h4><i class="fa-solid fa-chalkboard-user text-blue"></i> AI교수법 실천을 위한 제언</h4>
        <p>${aiImplicationComment}</p>
      </div>
      <div class="report-section" style="margin-bottom: 0;">
        <h4><i class="fa-solid fa-cube text-emerald"></i> RCTF 프롬프트 연계 액션 플랜</h4>
        <p>3번 탭의 [RCTF 프롬프트 빌더]에서 수업 대상자(Context)의 ZPD 수준을 정의하고, AI가 일방적 해답을 주지 않도록 Task에 <em>"학생의 오답 시 3단계 점진적 비계 질문을 제공하라"</em>는 제약 조건을 명시해보세요.</p>
      </div>
    `;
  }

  function handleSaveReflection() {
    const text = DOM.reflectionNotes.value.trim();
    if (!text) {
      showToast("성찰 내용을 입력해주세요.", "warning");
      return;
    }

    try {
      localStorage.setItem('ai_pedagogy_reflection', text);
      DOM.reflectionSaveStatus.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> 방금 성공적으로 저장되었습니다 (${new Date().toLocaleTimeString()})`;
      showToast("성찰 노트가 로컬 저장소에 보관되었습니다.", "success");
    } catch (e) {
      showToast("저장에 실패했습니다.", "error");
    }
  }

  function loadReflection() {
    try {
      const saved = localStorage.getItem('ai_pedagogy_reflection');
      if (saved) {
        DOM.reflectionNotes.value = saved;
        DOM.reflectionSaveStatus.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i> 이전 작성된 성찰 노트가 로딩되었습니다.`;
      }
    } catch (e) {
      // ignore
    }
  }

  function handleExportReport() {
    window.print();
  }

  /* ==========================================================================
     8. 유틸리티 & 팝업 (Toast, Modal, Escape)
     ========================================================================== */
  let toastTimer = null;
  function showToast(message, type = "info") {
    if (!DOM.toast) return;

    DOM.toastMessage.textContent = message;

    const icon = DOM.toast.querySelector('.toast-icon');
    if (icon) {
      if (type === "success") {
        icon.innerHTML = `<i class="fa-solid fa-circle-check text-emerald"></i>`;
      } else if (type === "warning") {
        icon.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-amber"></i>`;
      } else if (type === "error") {
        icon.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose"></i>`;
      } else {
        icon.innerHTML = `<i class="fa-solid fa-circle-info text-blue"></i>`;
      }
    }

    DOM.toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, 3200);
  }

  function escapeHtml(string) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(string).replace(/[&<>"']/g, s => entityMap[s]);
  }

  /* ==========================================================================
     9. 이벤트 리스너 바인딩 및 앱 초기화 (Initialization)
     ========================================================================== */
  function bindEvents() {
    // 탭 클릭
    DOM.tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    // 퀴즈 제어
    DOM.nextQuestionBtn.addEventListener('click', handleNextQuestion);
    DOM.requestHintBtn.addEventListener('click', handleRequestHint);
    DOM.resetQuizBtn.addEventListener('click', resetQuiz);

    // 대시보드
    DOM.refreshDashboardBtn.addEventListener('click', () => {
      updateDashboard();
      showToast("대시보드 지표가 갱신되었습니다.", "info");
    });
    DOM.exportReportBtn.addEventListener('click', handleExportReport);
    DOM.saveReflectionBtn.addEventListener('click', handleSaveReflection);

    // 퀵 헬프 모달
    DOM.quickHelpBtn.addEventListener('click', () => {
      DOM.helpModal.classList.remove('hidden');
    });
    DOM.closeHelpModalBtn.addEventListener('click', () => {
      DOM.helpModal.classList.add('hidden');
    });
    DOM.confirmHelpModalBtn.addEventListener('click', () => {
      DOM.helpModal.classList.add('hidden');
    });
    DOM.helpModal.addEventListener('click', (e) => {
      if (e.target === DOM.helpModal) {
        DOM.helpModal.classList.add('hidden');
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        DOM.helpModal.classList.add('hidden');
      }
    });
  }

  function initApp() {
    bindEvents();
    initQuiz();
    initBuilder();
    loadReflection();
    updateDashboard();
    console.log("AI 리터러시 & 맞춤형 프롬프트 튜터 SPA 준비 완료.");
  }

  // DOMContentLoaded 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();

