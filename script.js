const screens = Array.from(document.querySelectorAll("[data-screen]"));
const nextScreenButtons = Array.from(document.querySelectorAll("[data-next-screen]"));
const prevScreenButtons = Array.from(document.querySelectorAll("[data-prev-screen]"));
const openGuideButtons = Array.from(document.querySelectorAll("[data-open-guide]"));
const providerButtons = Array.from(document.querySelectorAll("[data-provider]"));
const platformButtons = Array.from(document.querySelectorAll("[data-platform]"));
const navButtons = Array.from(document.querySelectorAll("[data-nav]"));
const stepJumps = Array.from(document.querySelectorAll("[data-step-jump]"));
const homeLink = document.querySelector("[data-home-link]");

const guide = document.querySelector("#guide");
const steps = Array.from(document.querySelectorAll("[data-step]"));
const nextButton = document.querySelector("[data-next-step]");
const prevButton = document.querySelector("[data-prev-step]");
const currentStepLabel = document.querySelector("[data-current-step]");
const totalStepsLabel = document.querySelector("[data-total-steps]");
const progressBar = document.querySelector("[data-progress-bar]");
const termPopover = document.querySelector("[data-term-popover]");
const termTitle = document.querySelector("[data-term-title]");
const termBody = document.querySelector("[data-term-body]");
const termClose = document.querySelector("[data-term-close]");

let currentScreen = 0;
let currentStep = 0;
let provider = "chatgpt";
let platform = "windows";

const providerCopy = {
  claude: {
    label: "Claude",
    providerName: "Claude",
    codeTool: "Claude Code",
    planName: "Claude Pro",
    siteText: "claude.ai",
    siteHref: "https://claude.ai/",
    pricingText: "claude.ai/upgrade",
    pricingHref: "https://claude.ai/upgrade",
    downloads: {
      windows: "https://claude.ai/api/desktop/win32/x64/setup/latest/redirect",
      mac: "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect",
    },
  },
  chatgpt: {
    label: "ChatGPT",
    providerName: "ChatGPT",
    codeTool: "Codex",
    planName: "ChatGPT Plus",
    siteText: "chatgpt.com",
    siteHref: "https://chatgpt.com/",
    pricingText: "openai.com/chatgpt/pricing",
    pricingHref: "https://openai.com/chatgpt/pricing/",
    downloads: {
      windows: "https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi",
      mac: "https://persistent.oaistatic.com/codex-app-prod/Codex.dmg",
    },
  },
};

const platformCopy = {
  windows: { name: "Windows" },
  mac: { name: "macOS" },
};

const glossary = {
  github: {
    title: "GitHub",
    body: "Это как Google Drive для кода: там лежит проект, файлы и история изменений.",
  },
  "github-pages": {
    title: "GitHub Pages",
    body: "Это бесплатная витрина для сайта: GitHub берет ваши HTML/CSS/JS файлы и показывает их по ссылке.",
  },
  token: {
    title: "GitHub token",
    body: "Это временный ключ от GitHub. Он нужен инструменту, чтобы отправить код за вас. Его нельзя показывать другим.",
  },
  repository: {
    title: "Репозиторий",
    body: "Это отдельная папка проекта на GitHub: все файлы сайта лежат в одном месте.",
  },
  subscription: {
    title: "Подписка",
    body: "Это платный доступ к расширенным возможностям сервиса, как абонемент в приложение.",
  },
  "claude-code": {
    title: "Claude Code",
    body: "Это Claude, который умеет работать не только в чате, но и с файлами проекта: писать код, менять файлы и запускать команды.",
  },
  codex: {
    title: "Codex",
    body: "Это инструмент от OpenAI/ChatGPT для работы с кодом. Представьте помощника, который открывает проект и вносит изменения в файлы.",
  },
  "google-account": {
    title: "Google account",
    body: "Это вход через вашу Google-почту. Удобно, потому что не нужно запоминать отдельный пароль для каждого сервиса.",
  },
  captcha: {
    title: "Капча",
    body: "Это проверка, что вы настоящий человек. Обычно нужно выбрать картинки, ввести символы или нажать кнопку.",
  },
  git: {
    title: "Git",
    body: "Это система сохранений для проекта: она запоминает изменения и помогает отправить файлы на GitHub.",
  },
  terminal: {
    title: "Терминал",
    body: "Это окно, где компьютер выполняет текстовые команды. Представьте строку поиска, которая не ищет, а даёт компьютеру точное поручение.",
  },
  command: {
    title: "Команда",
    body: "Это одна строка-инструкция для компьютера. Её обычно копируют целиком, вставляют в Терминал и нажимают Enter.",
  },
  homebrew: {
    title: "Homebrew",
    body: "Это установщик программ для Mac. Он помогает поставить Git одной короткой командой.",
  },
  windows: {
    title: "Windows",
    body: "Операционная система Microsoft. Обычно на таком компьютере есть меню «Пуск».",
  },
  macos: {
    title: "macOS",
    body: "Операционная система компьютеров MacBook и iMac от Apple.",
  },
  email: {
    title: "Email",
    body: "Адрес электронной почты. На него GitHub отправит письмо со ссылкой для подтверждения аккаунта.",
  },
  "project-folder": {
    title: "Папка проекта",
    body: "Это обычная папка на компьютере, куда приложение будет складывать все файлы одного сайта.",
  },
  "chat-mode": {
    title: "Chat",
    body: "Обычный чат с Claude: подходит для вопросов, обсуждения идеи и подготовки плана. Сам по себе не работает с папкой проекта.",
  },
  "local-mode": {
    title: "Local",
    body: "Режим, в котором Codex работает прямо с папкой и файлами на вашем компьютере.",
  },
};

const routeSteps = [
  { number: 0, name: "Общий план", screen: "plan" },
  { number: 0, name: "Инструмент", screen: "choice" },
  { number: 1, name: "Аккаунт", guideIndex: 0 },
  { number: 2, name: "Подписка", guideIndex: 1 },
  { number: 3, name: "Система", guideIndex: 2 },
  { number: 4, name: "Git", guideIndex: 3 },
  { number: 5, name: "Приложение", guideIndex: 4 },
  { number: 6, name: "GitHub", guideIndex: 5 },
  { number: 7, name: "Токен", guideIndex: 6 },
  { number: 8, name: "Папка", guideIndex: 7 },
];

const quizQuestions = [
  { question: "Для чего нужен Git?", answers: ["Для сохранения истории изменений проекта", "Для оплаты подписки", "Для создания паролей"], correct: 0 },
  { question: "Что точнее всего описывает GitHub token?", answers: ["Временный ключ доступа к GitHub", "Название аккаунта", "Архив проекта"], correct: 0 },
  { question: "Почему GitHub token нельзя отправлять другим людям?", answers: ["С его помощью могут получить доступ к вашим проектам", "Он перестанет подходить к Windows", "Он занимает место в репозитории"], correct: 0 },
  { question: "Что такое репозиторий?", answers: ["Папка проекта на GitHub вместе с историей изменений", "Программа для оплаты подписки", "Вид операционной системы"], correct: 0 },
  { question: "Что нужно сделать сразу после создания token?", answers: ["Скопировать и безопасно сохранить", "Опубликовать в чате", "Переименовать компьютер"], correct: 0 },
  { question: "Для чего нужна папка проекта?", answers: ["В ней приложение создаёт и меняет файлы сайта", "Она хранит пароль от Google", "Она заменяет GitHub"], correct: 0 },
  { question: "Что делает GitHub Pages?", answers: ["Публикует сайт из файлов репозитория", "Устанавливает Git", "Создаёт подписку ChatGPT"], correct: 0 },
  { question: "Что означает Expiration при создании token?", answers: ["Срок действия ключа", "Имя репозитория", "Язык интерфейса"], correct: 0 },
  { question: "Для чего разрешение workflow у GitHub token?", answers: ["Для работы с автоматическими процессами GitHub", "Для смены email", "Для загрузки Windows"], correct: 0 },
  { question: "Что означает разрешение repo?", answers: ["Доступ к репозиториям", "Доступ к микрофону", "Оплату тарифа"], correct: 0 },
  { question: "Что такое терминал?", answers: ["Окно для выполнения текстовых команд", "Корзина удалённых файлов", "Страница регистрации"], correct: 0 },
  { question: "Что такое Homebrew?", answers: ["Установщик программ для macOS", "Браузер GitHub", "Режим Claude"], correct: 0 },
  { question: "Чем Claude Code и Codex отличаются от обычного чата?", answers: ["Они могут работать с файлами выбранного проекта", "Они не используют интернет", "Они работают только на телефоне"], correct: 0 },
  { question: "Что означает Local в Codex?", answers: ["Работа с папкой и файлами на компьютере", "Публичная публикация сайта", "Локальный язык интерфейса"], correct: 0 },
  { question: "Зачем подтверждать email в GitHub?", answers: ["Чтобы подтвердить доступ к адресу и завершить настройку", "Чтобы установить Git", "Чтобы создать папку на компьютере"], correct: 0 },
  { question: "Что такое капча?", answers: ["Проверка, что действие выполняет человек", "Ключ от репозитория", "Команда для терминала"], correct: 0 },
  { question: "Как безопаснее войти в сервис на разных устройствах?", answers: ["Через свой подтверждённый Google-аккаунт", "Через чужой token", "Без пароля и почты"], correct: 0 },
  { question: "Как понять, что папка подключена к Codex?", answers: ["Её название отображается рядом с полем задания", "Открывается GitHub Pages", "Исчезает кнопка входа"], correct: 0 },
];

const glossaryIcons = {
  github: "GH", "github-pages": "↗", token: "🔑", repository: "▣", subscription: "★",
  "claude-code": "CC", codex: "CX", "google-account": "G", captcha: "✓", git: "⑂",
  terminal: ">_", command: "/", homebrew: "⌘", windows: "⊞", macos: "●",
  email: "@", "project-folder": "▰", "chat-mode": "◌", "local-mode": "⌂",
};

function renderScreen() {
  screens.forEach((screen, index) => {
    screen.classList.toggle("is-screen-active", index === currentScreen);
  });
}

function goToScreen(index) {
  currentScreen = Math.max(0, Math.min(index, screens.length - 1));
  renderScreen();
  navButtons.forEach((button) => {
    const activeScreen = screens[currentScreen]?.dataset.screen;
    button.classList.toggle("is-active", button.dataset.nav === activeScreen || (button.dataset.nav === "guide" && ["home", "plan", "choice"].includes(activeScreen)));
  });
  renderStep();
}

function renderStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStep);
  });

  currentStepLabel.textContent = String(currentStep + 1);
  totalStepsLabel.textContent = String(steps.length);
  progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

  stepJumps.forEach((jump) => jump.querySelectorAll("button").forEach((button) => {
    const activeScreen = screens[currentScreen]?.dataset.screen;
    const target = Number(button.dataset.stepTarget);
    const routeScreen = button.dataset.routeScreen;
    const isActive = (activeScreen === routeScreen) ||
      (activeScreen === "guide" && !routeScreen && target === currentStep + 1);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "step" : "false");
  }));

  prevButton.disabled = false;
  nextButton.textContent =
    currentStep === steps.length - 1 ? "Завершить" : "Следующий шаг";
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((item) => {
    item.textContent = value;
  });
}

function setLink(selector, text, href) {
  document.querySelectorAll(selector).forEach((item) => {
    item.textContent = text;
    item.href = href;
  });
}

function applyProvider(nextProvider) {
  provider = nextProvider;
  const copy = providerCopy[provider];
  setText("[data-provider-label]", copy.label);
  setText("[data-provider-name]", copy.providerName);
  setText("[data-code-tool]", copy.codeTool);
  setText("[data-plan-name]", copy.planName);
  setLink("[data-provider-site]", copy.siteText, copy.siteHref);
  setLink("[data-pricing-site]", copy.pricingText, copy.pricingHref);
  document.querySelectorAll("[data-provider-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.providerPanel !== provider;
  });
  renderInstallChoice();
}

function renderInstallChoice() {
  const platformData = platformCopy[platform];
  const providerData = providerCopy[provider];

  setText("[data-platform-name]", platformData.name);
  document.querySelectorAll("[data-platform-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.platformPanel !== platform;
  });
  platformButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.platform === platform);
  });

  document.querySelectorAll("[data-tool-download]").forEach((link) => {
    link.href = providerData.downloads[platform];
    link.textContent = `Скачать ${providerData.codeTool} для ${platformData.name}`;
    link.target = "_blank";
    link.rel = "noreferrer";
  });
  setText(
    "[data-tool-help]",
    `Официальный установщик ${providerData.codeTool} для ${platformData.name}.`,
  );
}

function hideTermPopover() {
  termPopover.hidden = true;
}

function showTermPopover(button) {
  const termKey = button.dataset.term === "code-tool" ? (provider === "claude" ? "claude-code" : "codex") : button.dataset.term;
  const item = glossary[termKey];
  if (!item) return;

  termTitle.textContent = item.title;
  termBody.textContent = item.body;
  termPopover.hidden = false;

  const rect = button.getBoundingClientRect();
  const margin = 12;
  const popoverRect = termPopover.getBoundingClientRect();
  const left = Math.min(
    Math.max(margin, rect.left),
    window.innerWidth - popoverRect.width - margin,
  );
  const below = rect.bottom + margin;
  const top =
    below + popoverRect.height < window.innerHeight
      ? below
      : Math.max(margin, rect.top - popoverRect.height - margin);

  termPopover.style.left = `${left}px`;
  termPopover.style.top = `${top}px`;
}

nextScreenButtons.forEach((button) => {
  button.addEventListener("click", () => goToScreen(currentScreen + 1));
});

prevScreenButtons.forEach((button) => {
  button.addEventListener("click", () => goToScreen(currentScreen - 1));
});

function openGuide() {
  currentStep = 0;
  applyProvider(provider);
  goToScreen(screens.findIndex((screen) => screen.dataset.screen === "guide"));
  renderStep();
}

openGuideButtons.forEach((button) => {
  button.addEventListener("click", openGuide);
});

providerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyProvider(button.dataset.provider);
    openGuide();
  });
});

platformButtons.forEach((button) => {
  button.addEventListener("click", () => {
    platform = button.dataset.platform;
    renderInstallChoice();
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    renderStep();
    guide.scrollTo({ top: 0, behavior: "smooth" });
  });
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.nav;
    if (target === "guide") {
      openGuide();
      return;
    }
    goToScreen(screens.findIndex((screen) => screen.dataset.screen === target));
  });
});

stepJumps.forEach((jump) => {
  routeSteps.forEach((routeStep) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.stepTarget = String(routeStep.number);
    if (routeStep.screen) button.dataset.routeScreen = routeStep.screen;
    button.innerHTML = `<span>${routeStep.number}</span>${routeStep.name}`;
    button.addEventListener("click", () => {
      if (routeStep.screen) {
        goToScreen(screens.findIndex((screen) => screen.dataset.screen === routeStep.screen));
        renderStep();
        return;
      }
      currentStep = routeStep.guideIndex;
      goToScreen(screens.findIndex((screen) => screen.dataset.screen === "guide"));
      renderStep();
      guide.scrollTo({ top: 0, behavior: "smooth" });
    });
    jump.append(button);
  });
});

homeLink.addEventListener("click", (event) => {
  event.preventDefault();
  currentStep = 0;
  goToScreen(screens.findIndex((screen) => screen.dataset.screen === "home"));
});

const glossaryList = document.querySelector("[data-glossary-list]");
const glossarySearch = document.querySelector("[data-glossary-search]");
const glossaryEmpty = document.querySelector("[data-glossary-empty]");

function renderGlossary(query = "") {
  const normalized = query.trim().toLowerCase();
  const entries = Object.entries(glossary).filter(([, item]) => `${item.title} ${item.body}`.toLowerCase().includes(normalized));
  glossaryList.innerHTML = entries.map(([key, item]) => `<article class="glossary-card"><div class="glossary-icon" aria-hidden="true">${glossaryIcons[key] || "?"}</div><div><h3>${item.title}</h3><p>${item.body}</p></div></article>`).join("");
  glossaryEmpty.hidden = entries.length > 0;
}

glossarySearch.addEventListener("input", () => renderGlossary(glossarySearch.value));
renderGlossary();

const quizList = document.querySelector("[data-quiz-list]");
const quizForm = document.querySelector("[data-quiz-form]");
const quizResult = document.querySelector("[data-quiz-result]");

let activeQuiz = [];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function renderQuiz() {
  activeQuiz = shuffle(quizQuestions).slice(0, 10).map((item) => {
    const correctAnswer = item.answers[item.correct];
    const answers = shuffle(item.answers);
    return { ...item, answers, correct: answers.indexOf(correctAnswer) };
  });

  quizList.innerHTML = activeQuiz.map((item, questionIndex) => `
    <fieldset class="quiz-question">
      <legend><span>${questionIndex + 1}</span>${item.question}</legend>
      ${item.answers.map((answer, answerIndex) => `<label><input type="radio" name="question-${questionIndex}" value="${answerIndex}" required><span>${answer}</span></label>`).join("")}
    </fieldset>`).join("");
}

renderQuiz();

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quizForm);
  const score = activeQuiz.reduce((total, item, index) => total + (Number(data.get(`question-${index}`)) === item.correct ? 1 : 0), 0);
  quizResult.hidden = false;
  quizResult.innerHTML = `<strong>${score} из ${activeQuiz.length}</strong><p>${score === activeQuiz.length ? "Отлично! Всё готово к практике." : score >= 7 ? "Хороший результат. Ошибки можно быстро проверить в глоссарии." : "Стоит ещё раз пройти гайд и заглянуть в глоссарий."}</p>`;
});

quizForm.addEventListener("reset", () => {
  quizResult.hidden = true;
  window.setTimeout(renderQuiz, 0);
});

document.addEventListener("click", (event) => {
  const termButton = event.target.closest("[data-term]");
  if (termButton) {
    event.preventDefault();
    showTermPopover(termButton);
    return;
  }

  if (!event.target.closest("[data-term-popover]")) {
    hideTermPopover();
  }
});

termClose.addEventListener("click", hideTermPopover);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideTermPopover();
  }
});

nextButton.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep += 1;
    renderStep();
    guide.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  goToScreen(0);
});

prevButton.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    renderStep();
    guide.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  goToScreen(screens.findIndex((screen) => screen.dataset.screen === "choice"));
});

applyProvider(provider);
renderInstallChoice();
renderScreen();
renderStep();
