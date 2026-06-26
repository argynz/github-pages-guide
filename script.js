const screens = Array.from(document.querySelectorAll("[data-screen]"));
const nextScreenButtons = Array.from(document.querySelectorAll("[data-next-screen]"));
const prevScreenButtons = Array.from(document.querySelectorAll("[data-prev-screen]"));
const openGuideButtons = Array.from(document.querySelectorAll("[data-open-guide]"));
const providerButtons = Array.from(document.querySelectorAll("[data-provider]"));

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
let provider = "claude";

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
  },
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
};

function renderScreen() {
  screens.forEach((screen, index) => {
    screen.classList.toggle("is-screen-active", index === currentScreen);
  });
}

function goToScreen(index) {
  currentScreen = Math.max(0, Math.min(index, screens.length - 1));
  renderScreen();
}

function renderStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStep);
  });

  currentStepLabel.textContent = String(currentStep + 1);
  totalStepsLabel.textContent = String(steps.length);
  progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

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
}

function hideTermPopover() {
  termPopover.hidden = true;
}

function showTermPopover(button) {
  const item = glossary[button.dataset.term];
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
  renderStep();
  goToScreen(screens.findIndex((screen) => screen.dataset.screen === "guide"));
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
renderScreen();
renderStep();
