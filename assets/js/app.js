(function () {
  const config = window.APP_CONFIG;
  const app = document.getElementById("app");
  const resetButton = document.getElementById("global-reset");
  let fitTextFrame = null;
  let responsiveLayoutFrame = null;

  const state = {
    screen: "home",
    mode: null,
    endPayload: null,
    inactivityTimer: null,
    memory: null,
    quiz: null,
  };

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function resetInactivityTimer() {
    clearTimeout(state.inactivityTimer);

    if (state.screen === "home" || state.screen === "end") {
      return;
    }

    state.inactivityTimer = window.setTimeout(() => {
      goHome();
    }, config.kiosk.inactivityMs);
  }

  function registerActivity() {
    resetInactivityTimer();
  }

  function renderLayout(content) {
    app.innerHTML = content;
    bindScreenActions();
    fitTextElements();
    applyResponsiveLayouts();
    resetInactivityTimer();
  }

  function fitTextElements() {
    const isLargeDisplay = window.innerWidth >= 2560;
    const fitElements = app.querySelectorAll("[data-fit-text]");

    fitElements.forEach((element) => {
      const minSize = Number(element.dataset.fitMin || 24);
      const baseMax = Number(element.dataset.fitMax || 96);
      const maxSize = isLargeDisplay ? baseMax * 2 : baseMax;
      const fitRatio = Number(element.dataset.fitRatio || 8);
      const fitHeightRatio = Number(element.dataset.fitHeightRatio || 0);
      const parent = element.parentElement;
      const availableWidth = parent ? parent.clientWidth : element.clientWidth;
      const availableHeight = parent ? parent.clientHeight : element.clientHeight;

      if (!availableWidth) {
        return;
      }

      const calculatedByWidth = Math.round(availableWidth / fitRatio);
      const calculatedByHeight =
        fitHeightRatio && availableHeight ? Math.round(availableHeight / fitHeightRatio) : maxSize;
      const calculatedSize = Math.min(calculatedByWidth, calculatedByHeight);
      const nextSize = Math.max(minSize, Math.min(maxSize, calculatedSize));
      element.style.fontSize = `${nextSize}px`;
    });
  }

  function scheduleFitText() {
    window.cancelAnimationFrame(fitTextFrame);
    fitTextFrame = window.requestAnimationFrame(fitTextElements);
  }

  function applyMemoryGridLayout() {
    const grid = app.querySelector(".memory-grid");
    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll(".memory-card"));
    if (!cards.length) {
      return;
    }

    const screen = app.querySelector(".screen-game");
    const actions = app.querySelector(".screen-actions");
    const gridRect = grid.getBoundingClientRect();
    const actionsRect = actions ? actions.getBoundingClientRect() : null;
    const computedGrid = window.getComputedStyle(grid);
    const gap = parseFloat(computedGrid.gap) || 18;
    const availableWidth = grid.clientWidth;

    const appRect = app.getBoundingClientRect();
    const viewportBottom = Math.min(window.innerHeight, appRect.bottom);
    const reservedActionsHeight = actionsRect ? actionsRect.height + gap + 12 : 92;
    const availableHeight = viewportBottom - gridRect.top - reservedActionsHeight;

    if (!availableWidth || availableHeight <= 0) {
      return;
    }

    const candidates = [8, 7, 6, 5, 4, 3, 2];
    let best = { columns: 4, size: 0 };

    candidates.forEach((columns) => {
      const rows = Math.ceil(cards.length / columns);
      const widthSize = (availableWidth - gap * (columns - 1)) / columns;
      const heightSize = (availableHeight - gap * (rows - 1)) / rows;
      const size = Math.floor(Math.min(widthSize, heightSize));

      if (size > best.size) {
        best = { columns, size };
      }
    });

    const fallbackSize = Math.max(88, Math.floor((availableWidth - gap * 3) / 4));
    const cardSize = Math.max(88, best.size || fallbackSize);
    const rows = Math.ceil(cards.length / best.columns);

    grid.style.gridTemplateColumns = `repeat(${best.columns}, ${cardSize}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${cardSize}px)`;
    grid.style.justifyContent = "center";
  }

  function applyResponsiveLayouts() {
    applyMemoryGridLayout();
  }

  function scheduleResponsiveLayouts() {
    window.cancelAnimationFrame(responsiveLayoutFrame);
    responsiveLayoutFrame = window.requestAnimationFrame(applyResponsiveLayouts);
  }

  function renderHome() {
    state.screen = "home";
    state.mode = null;
    state.endPayload = null;
    state.memory = null;
    state.quiz = null;

    renderLayout(`
      <section class="screen screen-home">
        <div class="hero-panel">
          <div class="hero-copy">
            <h1 data-fit-text data-fit-min="44" data-fit-max="112" data-fit-ratio="6.6" data-fit-height-ratio="4.2">${config.kiosk.title}</h1>
            <p class="lead">${config.kiosk.subtitle}</p>
            <div class="highlights">
              ${config.introHighlights
                .map((item) => `<span class="highlight-chip">${item}</span>`)
                .join("")}
            </div>
          </div>
        </div>

        <div class="mode-grid">
          <button class="mode-card" data-action="start-memory" type="button">
            <span class="mode-pill">Igra 1</span>
            <h2 data-fit-text data-fit-min="54" data-fit-max="92" data-fit-ratio="8.8">${config.memory.title}</h2>
            <p>${config.memory.description}</p>
            <span class="mode-cta">Pokreni memory</span>
          </button>

          <button class="mode-card alt" data-action="start-quiz" type="button">
            <span class="mode-pill">Igra 2</span>
            <h2 data-fit-text data-fit-min="54" data-fit-max="92" data-fit-ratio="8.8">${config.quiz.title}</h2>
            <p>${config.quiz.description}</p>
            <span class="mode-cta">Pokreni pitalicu</span>
          </button>
        </div>
      </section>
    `);
  }

  function createMemoryState() {
    var cards = [];
    config.memory.pairs.forEach(function (pair) {
      cards.push(Object.assign({}, pair, { uid: pair.id + "-a", flipped: false, matched: false }));
      cards.push(Object.assign({}, pair, { uid: pair.id + "-b", flipped: false, matched: false }));
    });
    const deck = shuffle(cards);

    return {
      deck,
      firstCard: null,
      secondCard: null,
      lockBoard: false,
      moves: 0,
      matches: 0,
      startedAt: Date.now(),
    };
  }

  function renderMemory() {
    state.screen = "memory";
    state.mode = "memory";

    if (!state.memory) {
      state.memory = createMemoryState();
    }

    const totalPairs = config.memory.pairs.length;

    renderLayout(`
      <section class="screen screen-game">
        <header class="top-bar">
          <div>
            <h1 data-fit-text data-fit-min="42" data-fit-max="116" data-fit-ratio="11" data-fit-height-ratio="6.8">${config.memory.title}</h1>
          </div>
          <div class="stat-row">
            <div class="stat-box"><span>Potezi</span><strong>${state.memory.moves}</strong></div>
            <div class="stat-box"><span>Parovi</span><strong>${state.memory.matches}/${totalPairs}</strong></div>
          </div>
        </header>

        <div class="memory-grid">
          ${state.memory.deck
            .map(
              (card, index) => `
                <button
                  class="memory-card ${card.flipped || card.matched ? "is-flipped" : ""} ${
                card.matched ? "is-matched" : ""
              }"
                  data-action="flip-card"
                  data-index="${index}"
                  type="button"
                  aria-label="Memory kartica ${index + 1}"
                >
                  <span class="memory-face memory-front">
                    <span class="memory-question">?</span>
                  </span>
                  <span class="memory-face memory-back">
                    <img class="memory-logo" src="${card.image}" alt="${card.label}" />
                  </span>
                </button>
              `
            )
            .join("")}
        </div>

        <div class="screen-actions">
          <button class="ghost-button" data-action="restart-memory" type="button">Igraj ponovno</button>
          <button class="ghost-button" data-action="home" type="button">Početni ekran</button>
        </div>
      </section>
    `);
  }

  function finishMemory() {
    state.endPayload = {
      mode: "memory",
      title: "Memory završen",
      summary: `Spojili ste sve parove u ${state.memory.moves} poteza.`,
      metrics: [
        { label: "Potezi", value: `${state.memory.moves}` },
        { label: "Parovi", value: `${state.memory.matches}/${config.memory.pairs.length}` },
      ],
    };

    renderEndScreen();
  }

  function handleMemoryCard(index) {
    const memory = state.memory;
    const card = memory.deck[index];

    if (!card || memory.lockBoard || card.flipped || card.matched) {
      return;
    }

    card.flipped = true;

    if (memory.firstCard === null) {
      memory.firstCard = index;
      renderMemory();
      return;
    }

    memory.secondCard = index;
    memory.moves += 1;
    memory.lockBoard = true;

    const firstCard = memory.deck[memory.firstCard];
    const secondCard = memory.deck[memory.secondCard];

    if (firstCard.id === secondCard.id) {
      firstCard.matched = true;
      secondCard.matched = true;
      memory.matches += 1;
      memory.firstCard = null;
      memory.secondCard = null;
      memory.lockBoard = false;
      renderMemory();

      if (memory.matches === config.memory.pairs.length) {
        window.setTimeout(finishMemory, 500);
      }
      return;
    }

    renderMemory();
    window.setTimeout(() => {
      firstCard.flipped = false;
      secondCard.flipped = false;
      memory.firstCard = null;
      memory.secondCard = null;
      memory.lockBoard = false;
      renderMemory();
    }, 700);
  }

  function renderQuiz() {
    state.screen = "quiz";
    state.mode = "quiz";

    if (!state.quiz) {
      state.quiz = {
        index: 0,
        correctCount: 0,
        answers: [],
        selectedIndex: null,
      };
    }

    const question = state.quiz.questions[state.quiz.index];
    const progress = ((state.quiz.index + 1) / state.quiz.questions.length) * 100;

    renderLayout(`
      <section class="screen screen-game">
        <header class="top-bar">
          <div>
            <h1 data-fit-text data-fit-min="42" data-fit-max="116" data-fit-ratio="11" data-fit-height-ratio="6.8">${config.quiz.title}</h1>
          </div>
          <div class="stat-row">
            <div class="stat-box"><span>Pitanje</span><strong>${state.quiz.index + 1}/${
      state.quiz.questions.length
    }</strong></div>
          </div>
        </header>

        <div class="progress-track" aria-hidden="true">
          <span class="progress-bar" style="width: ${progress}%"></span>
        </div>

        <div class="quiz-card">
          <p class="quiz-prompt" data-fit-text data-fit-min="24" data-fit-max="50" data-fit-ratio="22">${question.prompt}</p>
          <div class="quiz-options">
            ${question.options
              .map(
                (option, optionIndex) => `
                  <button
                    class="quiz-option"
                    data-action="answer-question"
                    data-index="${optionIndex}"
                    type="button"
                  >
                    ${option}
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="quiz-feedback-slot" aria-live="polite"></div>
        </div>

        <div class="screen-actions">
          <button class="ghost-button" data-action="restart-quiz" type="button">Igraj ponovno</button>
          <button class="ghost-button" data-action="home" type="button">Početni ekran</button>
        </div>
      </section>
    `);
  }

  function finishQuiz() {
    const total = state.quiz.questions.length;

    state.endPayload = {
      mode: "quiz",
      title: "Pitalica završena",
      summary: `Točno ste odgovorili na ${state.quiz.correctCount} od ${total} pitanja.`,
      metrics: [
        { label: "Točni odgovori", value: `${state.quiz.correctCount}/${total}` },
      ],
    };

    renderEndScreen();
  }

  function handleQuizAnswer(selectedIndex) {
    if (!state.quiz || state.quiz.answering) return;
    state.quiz.answering = true;

    const question = state.quiz.questions[state.quiz.index];
    const isCorrect = selectedIndex === question.correctIndex;

    state.quiz.answers.push({
      question: question.prompt,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect,
    });

    if (isCorrect) {
      state.quiz.correctCount += 1;
    }

    const buttons = app.querySelectorAll('[data-action="answer-question"]');
    buttons.forEach((button) => {
      const optionIndex = Number(button.dataset.index);
      button.disabled = true;
      if (optionIndex === question.correctIndex) {
        button.classList.add("is-correct");
      } else if (optionIndex === selectedIndex) {
        button.classList.add("is-wrong");
      }
    });

    const feedbackSlot = app.querySelector(".quiz-feedback-slot");
    if (feedbackSlot) {
      feedbackSlot.innerHTML = `<div class="quiz-feedback ${isCorrect ? "ok" : "bad"}"><strong>${isCorrect ? "Točno." : "Netočno."}</strong> ${question.explanation}</div>`;
    }

    window.setTimeout(() => {
      state.quiz.index += 1;
      state.quiz.answering = false;
      if (state.quiz.index >= state.quiz.questions.length) {
        finishQuiz();
      } else {
        renderQuiz();
      }
    }, 1300);
  }

  function renderEndScreen() {
    state.screen = "end";

    const payload = state.endPayload;

    renderLayout(`
      <section class="screen screen-end">
        <div class="end-summary">
          <h1 data-fit-text data-fit-min="52" data-fit-max="102" data-fit-ratio="7.2">${payload.title}</h1>
          <p class="lead">${payload.summary}</p>
          <div class="metric-grid">
            ${payload.metrics
              .map(
                (metric) => `
                  <div class="metric-card">
                    <span>${metric.label}</span>
                    <strong>${metric.value}</strong>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="cta-panel">
          <div>
            <div class="eyebrow">Nastavite digitalno</div>
            <h2 data-fit-text data-fit-min="34" data-fit-max="62" data-fit-ratio="11">Skenirajte QR kod</h2>
            <p class="support-text">
              Preuzmite PostBox aplikaciju ili se pridružite Viber botu Brze pošte 1323.
            </p>
          </div>

          <div class="qr-grid">
            ${config.qrCards
              .map(
                (card) => `
                  <article class="qr-card">
                    <img src="${card.image}" alt="${card.title}" />
                    <h3>${card.title}</h3>
                    <p>${card.caption}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="screen-actions">
          <button class="ghost-button" data-action="play-again" type="button">Igraj ponovno</button>
          <button class="ghost-button" data-action="home" type="button">Početni ekran</button>
        </div>
      </section>
    `);
  }

  function startMemory() {
    state.memory = createMemoryState();
    renderMemory();
  }

  function startQuiz() {
    state.quiz = {
      index: 0,
      correctCount: 0,
      answers: [],
      answering: false,
      questions: shuffle(config.quiz.questions).slice(0, 5),
    };
    renderQuiz();
  }

  function goHome() {
    clearTimeout(state.inactivityTimer);
    renderHome();
  }

  function playAgain() {
    if (state.endPayload && state.endPayload.mode === "memory") {
      startMemory();
      return;
    }
    startQuiz();
  }

  function bindScreenActions() {
    app.querySelectorAll("[data-action]").forEach((element) => {
      element.addEventListener("click", () => {
        const action = element.dataset.action;

        if (action === "start-memory") {
          startMemory();
        } else if (action === "start-quiz") {
          startQuiz();
        } else if (action === "flip-card") {
          handleMemoryCard(Number(element.dataset.index));
        } else if (action === "answer-question") {
          handleQuizAnswer(Number(element.dataset.index));
        } else if (action === "restart-memory") {
          startMemory();
        } else if (action === "restart-quiz") {
          startQuiz();
        } else if (action === "play-again") {
          playAgain();
        } else if (action === "home") {
          goHome();
        }
      });
    });
  }

  resetButton.addEventListener("click", goHome);

  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, registerActivity, { passive: true });
  });

  window.addEventListener("resize", scheduleFitText);
  window.addEventListener("resize", scheduleResponsiveLayouts);

  renderHome();
})();
