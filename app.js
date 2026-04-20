const boardRows = 5;
const boardColumns = 3;
const expectedTileCount = boardRows * boardColumns;
const centerTileIndex = Math.floor(boardRows / 2) * boardColumns + Math.floor(boardColumns / 2);
const BIOMETRIC_CREDENTIAL_KEY = "lux-bingo.biometric-credential-id";
const BIOMETRIC_USER_ID_KEY = "lux-bingo.biometric-user-id";
const IOS_VERIFICATION_PIN_KEY = "lux-bingo.ios-verification-pin";
const DEFAULT_IOS_VERIFICATION_PIN = "2026";
const START_INTRO_READ_KEY = "lux-bingo.start-intro-read";
const START_RACCOON_CLEARED_KEY = "lux-bingo.start-raccoon-cleared";
const GALLERY_PAINTINGS_KEY = "lux-bingo.gallery-paintings";
const START_PANEL_STORY = "story";
const START_PANEL_GALLERY = "gallery";
const START_PANEL_RACCOON = "raccoon";
const STORY_BOTTOM_THRESHOLD = 24;
const RACCOON_TARGET_SCORE = 5;
const RACCOON_GAME_CONFIG = Object.freeze({
  width: 360,
  height: 640,
  gravity: 1480,
  flapVelocity: -460,
  horizontalSpeed: 180,
  spawnInterval: 1.5,
  obstacleWidth: 74,
  gapSize: 176,
  obstacleInset: 74,
});
const GALLERY_REWARD_POOL = Object.freeze([
  {
    id: "venus-de-milo",
    title: "Venus de Milo",
    artist: "Alexandros of Antioch",
    museum: "Louvre Museum, Paris",
    imageSrc: "images/venus.jpg",
    imageAlt: "The Venus de Milo sculpture displayed in a frame.",
  },
  {
    id: "mona-lisa",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    museum: "Louvre Museum, Paris",
    imageSrc: "images/monalisa.jpg",
    imageAlt: "The Mona Lisa painting displayed in a frame.",
  },
  {
    id: "the-scream",
    title: "The Scream",
    artist: "Edvard Munch",
    museum: "National Museum, Oslo",
    imageSrc: "images/schreeuw.jpg",
    imageAlt: "The Scream painting displayed in a frame.",
  },
]);

// Replace the label, question, and answers values below with your own box content.
const tileDefinitions = [
  {
    id: "tile-1",
    label: "Art",
    question: "Which work of art?",
    imageSrc: "images/venus.jpg",
    imageAlt: "A classical marble statue photographed up close.",
    manualVerification: true,
    answers: ["venus of milo", "venus de milo"],
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-2",
    label: "Myth",
    question: "Which mythological figure?",
    imageSrc: "images/icarus.jpg",
    imageAlt: "A dramatic artwork showing a mythological scene.",
    manualVerification: true,
    answers: ["icarus"],
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-3",
    label: "Painter",
    question: "Which painter?",
    imageSrc: "images/Maria Theresa of Spain.jpeg",
    imageAlt: "A formal portrait painting of a royal woman.",
    manualVerification: true,
    answers: ["diego velazquez", "velazquez", "velasquez"],
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-4",
    label: "Goya",
    question: "Which painter?",
    imageSrc: "images/goya.jpg",
    imageAlt: "A painting associated with Goya.",
    manualVerification: true,
    answers: ["francisco goya", "goya", "francisco jose de goya", "francisco de goya"],
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-5",
    label: "MonaLisa",
    question: "Which museum?",
    imageSrc: "images/monalisa.jpg",
    imageAlt: "The Mona Lisa painting.",
    manualVerification: true,
    answers: ["louvre", "the louvre", "musee du louvre", "musee de louvre", "musee du louvre paris"],
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-6",
    label: "Degas",
    question: "Which painter?",
    imageSrc: "images/degas.jpg",
    imageAlt: "An artwork associated with Degas.",
    manualVerification: true,
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-7",
    label: "Schreeuw",
    question: "Which painting?",
    imageSrc: "images/schreeuw.jpg",
    imageAlt: "An expressionist artwork associated with The Scream.",
    manualVerification: true,
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-8",
    label: "Japanese",
    question: "Japanese",
    imageSrc: "images/japanese.png",
    imageAlt: "A themed image for the Japanese prompt.",
    category: "language",
    inputMode: "verify-only",
    tileImageFit: "cover",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-9",
    label: "Ukrainian",
    question: "Ukrainian",
    imageSrc: "images/ukrainian.png",
    imageAlt: "A themed image for the Ukrainian prompt.",
    category: "language",
    inputMode: "verify-only",
    tileImageFit: "cover",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-11",
    label: "Italian",
    question: "Italian",
    imageSrc: "images/italian.png",
    imageAlt: "A themed image for the Italian prompt.",
    category: "language",
    inputMode: "verify-only",
    tileImageFit: "cover",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-12",
    label: "Arabic",
    question: "Arabic",
    imageSrc: "images/arabic.png",
    imageAlt: "A themed image for the Arabic prompt.",
    category: "language",
    inputMode: "verify-only",
    tileImageFit: "cover",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-13",
    label: "Latin",
    question: "Latin",
    imageSrc: "images/latin.png",
    imageAlt: "A themed image for the Latin prompt.",
    category: "language",
    inputMode: "verify-only",
    tileImageFit: "cover",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-14",
    label: "Mandarin",
    question: "Mandarin",
    imageSrc: "images/mandarin.png",
    imageAlt: "A themed image for the Mandarin prompt.",
    category: "language",
    inputMode: "verify-only",
    tileImageFit: "cover",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-15",
    label: "LUX",
    question: "Select three songs from LUX that have already been played.",
    imageSrc: "images/lux.jpg",
    imageAlt: "The album cover for LUX.",
    openingPlacement: "center",
    inputMode: "multi-select",
    manualVerification: true,
    selectionLimit: 3,
    options: [
      "Berghain",
      "La Perla",
      "Mundo Nuevo",
      "Porcelana",
      "Mio Cristo",
      "Magnolias",
      "Reliquia",
      "De Madruga",
    ],
    correctOptions: ["Berghain", "La Perla", "Magnolias"],
    verifiedPoints: 1,
  },
  {
    id: "tile-16",
    label: "MOTOMAMI",
    question: "Select three songs from MOTOMAMI that have already been played.",
    imageSrc: "images/motomami.jpg",
    imageAlt: "The album cover for MOTOMAMI.",
    inputMode: "multi-select",
    manualVerification: true,
    selectionLimit: 3,
    options: [
      "Saoko",
      "Candy",
      "La Fama",
      "Bulerias",
      "Chicken Teriyaki",
      "Hentai",
      "Bizcochito",
      "Delirio de Grandeza",
    ],
    correctOptions: ["Saoko", "La Fama", "Bizcochito"],
    verifiedPoints: 1,
  },
];

const lineDefinitions = buildLineDefinitions(boardRows, boardColumns);
const storedRaccoonCleared = getStoredValue(START_RACCOON_CLEARED_KEY) === "true";
const storedIntroRead = storedRaccoonCleared || getStoredValue(START_INTRO_READ_KEY) === "true";
const storedGalleryPaintingIds = reconcileUnlockedPaintings(getStoredPaintingIds(), storedRaccoonCleared);

const state = {
  hasStarted: false,
  introRead: storedIntroRead,
  raccoonCleared: storedRaccoonCleared,
  activeStartPanel: null,
  raccoonGame: createRaccoonGameState("idle"),
  unlockedPaintingIds: storedGalleryPaintingIds,
  selectedPaintingId: storedGalleryPaintingIds[storedGalleryPaintingIds.length - 1] || null,
  latestPaintingRewardId: null,
  galleryRaccoonMood: "idle",
  galleryFeedTimer: null,
  tiles: createTiles({ useOpeningLayout: true }),
  score: 0,
  completedLines: new Set(),
  activeTileId: null,
  selectedOptions: [],
  pointsBurstTimer: null,
  bingoBurstTimer: null,
  isSubmitting: false,
};

const elements = {
  appShell: document.querySelector("#app-shell"),
  startScreen: document.querySelector("#start-screen"),
  introButton: document.querySelector("#intro-button"),
  galleryButton: document.querySelector("#gallery-button"),
  raccoonButton: document.querySelector("#raccoon-button"),
  bingoButton: document.querySelector("#bingo-button"),
  startOverlay: document.querySelector("#start-overlay"),
  startOverlayTitle: document.querySelector("#start-overlay-title"),
  startOverlayCloseButton: document.querySelector("#start-overlay-close-button"),
  storyPanel: document.querySelector("#story-panel"),
  storyScroll: document.querySelector("#story-scroll"),
  storyStatus: document.querySelector("#story-status"),
  galleryPanel: document.querySelector("#gallery-panel"),
  galleryWallGrid: document.querySelector("#gallery-wall-grid"),
  galleryStatus: document.querySelector("#gallery-status"),
  galleryDetailTitle: document.querySelector("#gallery-detail-title"),
  galleryDetailArtist: document.querySelector("#gallery-detail-artist"),
  galleryDetailMuseum: document.querySelector("#gallery-detail-museum"),
  galleryRaccoonButton: document.querySelector("#gallery-raccoon-button"),
  raccoonPanel: document.querySelector("#raccoon-panel"),
  raccoonCanvas: document.querySelector("#raccoon-canvas"),
  raccoonScore: document.querySelector("#raccoon-score"),
  raccoonTarget: document.querySelector("#raccoon-target"),
  raccoonStatus: document.querySelector("#raccoon-status"),
  raccoonStartButton: document.querySelector("#raccoon-start-button"),
  raccoonExitButton: document.querySelector("#raccoon-exit-button"),
  board: document.querySelector("#bingo-board"),
  scorePill: document.querySelector("#score-pill"),
  scoreValue: document.querySelector("#score-value"),
  pointsBurst: document.querySelector("#points-burst"),
  bingoBurst: document.querySelector("#bingo-burst"),
  modal: document.querySelector("#question-modal"),
  modalImage: document.querySelector("#modal-image"),
  modalPrompt: document.querySelector("#modal-prompt"),
  optionGrid: document.querySelector("#option-grid"),
  reviewPanel: document.querySelector("#review-panel"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  selectionSummary: document.querySelector("#selection-summary"),
  answerFeedback: document.querySelector("#answer-feedback"),
  submitButton: document.querySelector("#answer-form .submit-button"),
  closeModalButton: document.querySelector("#close-modal-button"),
  resetButton: document.querySelector("#reset-button"),
};

setStoredPaintingIds(state.unlockedPaintingIds);

render();
bindEvents();

function createTiles(options = {}) {
  const boardDefinitions = tileDefinitions.slice(0, expectedTileCount);
  const arrangedDefinitions = options.useOpeningLayout
    ? buildOpeningLayout(boardDefinitions)
    : shuffleArray(boardDefinitions);
  const shuffledDefinitions = arrangedDefinitions.slice(0, expectedTileCount);
  const tiles = shuffledDefinitions.map((tile, index) => ({
    ...tile,
    index,
    solved: false,
  }));

  if (tiles.length !== expectedTileCount) {
    console.warn(`Expected ${expectedTileCount} tiles for a ${boardRows}x${boardColumns} board.`);
  }

  return tiles;
}

function bindEvents() {
  elements.introButton.addEventListener("click", openIntroStory);
  elements.galleryButton.addEventListener("click", openGallery);
  elements.raccoonButton.addEventListener("click", openRaccoonGame);
  elements.bingoButton.addEventListener("click", startGame);
  elements.startOverlayCloseButton.addEventListener("click", () => closeStartOverlay());
  elements.startOverlay.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeStartOverlay === "true") {
      closeStartOverlay();
    }
  });
  elements.storyScroll.addEventListener("scroll", handleStoryScroll);
  elements.galleryWallGrid.addEventListener("click", handleGalleryWallClick);
  elements.galleryRaccoonButton.addEventListener("click", feedGalleryRaccoon);
  elements.raccoonStartButton.addEventListener("click", startRaccoonRun);
  elements.raccoonExitButton.addEventListener("click", () => closeStartOverlay());
  elements.raccoonCanvas.addEventListener("pointerdown", handleRaccoonPointerDown);
  elements.board.addEventListener("click", handleBoardClick);
  elements.optionGrid.addEventListener("click", handleOptionGridClick);
  elements.answerForm.addEventListener("submit", handleAnswerSubmit);
  elements.resetButton.addEventListener("click", resetGame);
  elements.closeModalButton.addEventListener("click", () => closeModal());
  elements.modal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
      closeModal();
    }
  });
  elements.scorePill.addEventListener("animationend", () => {
    elements.scorePill.classList.remove("is-bumping");
  });
  document.addEventListener("keydown", handleDocumentKeyDown);
}

function render() {
  renderGameVisibility();
  renderStartScreen();
  renderBoard();
  renderScore();
}

function renderGameVisibility() {
  elements.startScreen.hidden = state.hasStarted;
  elements.appShell.hidden = !state.hasStarted;
}

function startGame() {
  if (state.hasStarted || !state.raccoonCleared) {
    return;
  }

  closeStartOverlay(true);
  state.hasStarted = true;
  render();
}

function renderStartScreen() {
  const overlayOpen = !state.hasStarted && Boolean(state.activeStartPanel);

  elements.galleryButton.disabled = !state.introRead;
  elements.raccoonButton.disabled = !state.introRead;
  elements.bingoButton.disabled = !state.raccoonCleared;

  elements.startOverlay.hidden = !overlayOpen;
  elements.storyPanel.hidden = state.activeStartPanel !== START_PANEL_STORY;
  elements.galleryPanel.hidden = state.activeStartPanel !== START_PANEL_GALLERY;
  elements.raccoonPanel.hidden = state.activeStartPanel !== START_PANEL_RACCOON;
  elements.startOverlayTitle.textContent = getStartOverlayTitle();

  elements.storyStatus.textContent = state.introRead
    ? "Intro read. Gallery and Fat Raccoon Flight are unlocked."
    : "Scroll to the bottom to continue.";

  elements.galleryStatus.textContent = getGalleryStatusText();
  elements.galleryRaccoonButton.classList.toggle("is-fed", state.galleryRaccoonMood === "fed");
  elements.raccoonScore.textContent = `Score ${state.raccoonGame.score}`;
  elements.raccoonTarget.textContent = `Target ${RACCOON_TARGET_SCORE}`;
  elements.raccoonStatus.textContent = getRaccoonStatusText();
  elements.raccoonStartButton.textContent = getRaccoonStartLabel();
  elements.raccoonStartButton.disabled = state.raccoonGame.status === "running";

  document.body.classList.toggle("start-overlay-open", overlayOpen);

  if (overlayOpen && state.activeStartPanel === START_PANEL_GALLERY) {
    renderGallery();
  }

  if (overlayOpen && state.activeStartPanel === START_PANEL_RACCOON) {
    drawRaccoonGame();
  }
}

function getStartOverlayTitle() {
  if (state.activeStartPanel === START_PANEL_GALLERY) {
    return "Raccoon Gallery";
  }

  if (state.activeStartPanel === START_PANEL_RACCOON) {
    return "Fat Raccoon Flight";
  }

  return "Intro Story";
}

function getGalleryStatusText() {
  if (state.galleryRaccoonMood === "fed") {
    return "Nom nom. The raccoon did a tiny delighted hop.";
  }

  if (state.unlockedPaintingIds.length === 0) {
    return "Beat Fat Raccoon Flight to hang the first artwork.";
  }

  if (state.unlockedPaintingIds.length < GALLERY_REWARD_POOL.length) {
    return `Paintings hung: ${state.unlockedPaintingIds.length} / ${GALLERY_REWARD_POOL.length}. Clear another run for the next frame.`;
  }

  return "All gallery frames are full. The raccoon approves.";
}

function getRaccoonStatusText() {
  if (state.raccoonGame.status === "running") {
    return `Flying... ${state.raccoonGame.score} / ${RACCOON_TARGET_SCORE} points.`;
  }

  if (state.raccoonGame.status === "crashed") {
    return `Bonk. You reached ${state.raccoonGame.score}. Tap the canvas or retry.`;
  }

  if (state.raccoonGame.status === "won") {
    const earnedPainting = getPaintingById(state.latestPaintingRewardId);
    if (earnedPainting) {
      return `Unlocked. You earned ${earnedPainting.title} for the gallery.`;
    }

    if (state.unlockedPaintingIds.length >= GALLERY_REWARD_POOL.length) {
      return "Unlocked. Scippie goes LUX is live and the gallery wall is already full.";
    }

    return "Unlocked. The Scippie goes LUX button is now live.";
  }

  if (state.raccoonCleared) {
    return "Board unlocked. Replay the run to earn another gallery piece.";
  }

  return "Tap start, then keep the fat raccoon in the air.";
}

function getRaccoonStartLabel() {
  if (state.raccoonGame.status === "running") {
    return "Flying...";
  }

  if (state.raccoonGame.status === "crashed") {
    return "Retry run";
  }

  if (state.raccoonCleared) {
    return "Run again";
  }

  return "Start run";
}

function openIntroStory() {
  if (state.hasStarted) {
    return;
  }

  clearGalleryFeedState();
  state.activeStartPanel = START_PANEL_STORY;
  stopRaccoonAnimation();
  renderStartScreen();

  elements.storyScroll.scrollTop = 0;
  elements.storyScroll.focus();
  window.requestAnimationFrame(() => {
    handleStoryScroll();
  });
}

function openGallery() {
  if (state.hasStarted || !state.introRead) {
    return;
  }

  stopRaccoonAnimation();
  state.activeStartPanel = START_PANEL_GALLERY;
  renderStartScreen();
}

function openRaccoonGame() {
  if (state.hasStarted || !state.introRead) {
    return;
  }

  state.activeStartPanel = START_PANEL_RACCOON;
  clearGalleryFeedState();
  resetRaccoonGame("idle");
  renderStartScreen();
  elements.raccoonCanvas.focus();
}

function renderGallery() {
  const activeSelectionId = getActiveGallerySelectionId();
  const unlockedPaintingIds = new Set(state.unlockedPaintingIds);

  elements.galleryWallGrid.innerHTML = GALLERY_REWARD_POOL.map((painting) => {
    const isUnlocked = unlockedPaintingIds.has(painting.id);
    const isActive = activeSelectionId === painting.id;
    const slotClass = isUnlocked ? "is-unlocked" : "is-empty";
    const activeClass = isActive ? "is-active" : "";
    const ariaLabel = isUnlocked
      ? `View ${painting.title} by ${painting.artist}`
      : "Empty frame";
    const surfaceMarkup = isUnlocked
      ? `
        <span class="gallery-art-surface">
          <img src="${painting.imageSrc}" alt="${escapeHtml(painting.imageAlt)}" loading="lazy" decoding="async" />
        </span>
      `
      : '<span class="gallery-art-placeholder">Empty frame</span>';
    const plaqueTitle = isUnlocked ? painting.title : "Empty frame";
    const plaqueSubtitle = isUnlocked ? painting.artist : "Win a raccoon run";

    return `
      <button
        class="gallery-slot ${slotClass} ${activeClass}"
        type="button"
        data-gallery-painting-id="${painting.id}"
        aria-pressed="${isActive ? "true" : "false"}"
        aria-label="${escapeHtml(ariaLabel)}"
      >
        <span class="gallery-frame">
          ${surfaceMarkup}
        </span>
        <span class="gallery-plaque">
          <span class="gallery-plaque-title">${escapeHtml(plaqueTitle)}</span>
          <span class="gallery-plaque-subtitle">${escapeHtml(plaqueSubtitle)}</span>
        </span>
      </button>
    `;
  }).join("");

  const selectedPainting = getPaintingById(activeSelectionId);
  if (!selectedPainting || !unlockedPaintingIds.has(activeSelectionId)) {
    elements.galleryDetailTitle.textContent = "Empty wall";
    elements.galleryDetailArtist.textContent = "No painting has been earned for this frame yet.";
    elements.galleryDetailMuseum.textContent =
      state.unlockedPaintingIds.length === 0
        ? "Clear the raccoon run to add the first piece to the living room."
        : "Beat Fat Raccoon Flight again to hang the next work here.";
    return;
  }

  elements.galleryDetailTitle.textContent = selectedPainting.title;
  elements.galleryDetailArtist.textContent = `Artist: ${selectedPainting.artist}`;
  elements.galleryDetailMuseum.textContent = `Museum: ${selectedPainting.museum}`;
}

function getActiveGallerySelectionId() {
  if (state.selectedPaintingId) {
    return state.selectedPaintingId;
  }

  return state.unlockedPaintingIds[state.unlockedPaintingIds.length - 1] || GALLERY_REWARD_POOL[0]?.id || null;
}

function handleGalleryWallClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const slotButton = target.closest("[data-gallery-painting-id]");
  if (!(slotButton instanceof HTMLButtonElement)) {
    return;
  }

  const paintingId = slotButton.dataset.galleryPaintingId;
  if (!paintingId) {
    return;
  }

  state.selectedPaintingId = paintingId;
  renderStartScreen();
}

function feedGalleryRaccoon() {
  if (state.activeStartPanel !== START_PANEL_GALLERY) {
    return;
  }

  clearGalleryFeedState();
  state.galleryRaccoonMood = "fed";
  renderStartScreen();

  state.galleryFeedTimer = window.setTimeout(() => {
    state.galleryFeedTimer = null;
    state.galleryRaccoonMood = "idle";
    renderStartScreen();
  }, 1300);
}

function clearGalleryFeedState() {
  clearTimeout(state.galleryFeedTimer);
  state.galleryFeedTimer = null;
  state.galleryRaccoonMood = "idle";
}

function getPaintingById(paintingId) {
  return GALLERY_REWARD_POOL.find((painting) => painting.id === paintingId) || null;
}

function awardNextPainting() {
  const unlockedPaintingIds = new Set(state.unlockedPaintingIds);
  const nextPainting = GALLERY_REWARD_POOL.find((painting) => !unlockedPaintingIds.has(painting.id)) || null;

  if (!nextPainting) {
    setStoredPaintingIds(state.unlockedPaintingIds);
    return null;
  }

  state.unlockedPaintingIds = [...state.unlockedPaintingIds, nextPainting.id];
  state.selectedPaintingId = nextPainting.id;
  setStoredPaintingIds(state.unlockedPaintingIds);
  return nextPainting;
}

function closeStartOverlay(force = false) {
  if (!force && state.isSubmitting) {
    return;
  }

  clearGalleryFeedState();
  stopRaccoonAnimation();
  state.activeStartPanel = null;
  renderStartScreen();
}

function handleStoryScroll() {
  if (state.activeStartPanel !== START_PANEL_STORY || state.introRead) {
    return;
  }

  const scrollDistance =
    elements.storyScroll.scrollHeight - elements.storyScroll.clientHeight - elements.storyScroll.scrollTop;

  if (scrollDistance <= STORY_BOTTOM_THRESHOLD) {
    state.introRead = true;
    setStoredValue(START_INTRO_READ_KEY, "true");
    renderStartScreen();
  }
}

function handleDocumentKeyDown(event) {
  if (event.key === "Escape") {
    if (elements.modal.classList.contains("is-open")) {
      closeModal();
      return;
    }

    if (state.activeStartPanel) {
      closeStartOverlay();
    }
    return;
  }

  const isRaccoonKey = event.code === "Space" || event.key === " " || event.key === "ArrowUp";
  if (isRaccoonKey && state.activeStartPanel === START_PANEL_RACCOON) {
    event.preventDefault();
    handleRaccoonInput();
  }
}

function handleRaccoonPointerDown(event) {
  event.preventDefault();

  if (state.activeStartPanel !== START_PANEL_RACCOON) {
    return;
  }

  elements.raccoonCanvas.focus();
  handleRaccoonInput();
}

function handleRaccoonInput() {
  if (state.activeStartPanel !== START_PANEL_RACCOON) {
    return;
  }

  if (state.raccoonGame.status !== "running") {
    startRaccoonRun();
    return;
  }

  state.raccoonGame.raccoon.velocityY = RACCOON_GAME_CONFIG.flapVelocity;
  drawRaccoonGame();
}

function startRaccoonRun() {
  if (state.activeStartPanel !== START_PANEL_RACCOON) {
    return;
  }

  state.latestPaintingRewardId = null;
  resetRaccoonGame("running");
  renderStartScreen();
  handleRaccoonInput();
  state.raccoonGame.frameId = window.requestAnimationFrame(stepRaccoonGame);
}

function createRaccoonGameState(status = "idle") {
  return {
    status,
    frameId: null,
    lastTimestamp: 0,
    score: status === "won" ? RACCOON_TARGET_SCORE : 0,
    raccoon: {
      x: 116,
      y: RACCOON_GAME_CONFIG.height / 2,
      velocityY: 0,
      radius: 28,
      rotation: 0,
    },
    obstacles: [createRaccoonObstacle(RACCOON_GAME_CONFIG.width + 120)],
    obstacleTimer: 0,
  };
}

function resetRaccoonGame(status = "idle") {
  stopRaccoonAnimation();
  state.raccoonGame = createRaccoonGameState(status);
}

function createRaccoonObstacle(x = RACCOON_GAME_CONFIG.width + 96) {
  const minimumCenter = RACCOON_GAME_CONFIG.obstacleInset + RACCOON_GAME_CONFIG.gapSize / 2;
  const maximumCenter =
    RACCOON_GAME_CONFIG.height - RACCOON_GAME_CONFIG.obstacleInset - RACCOON_GAME_CONFIG.gapSize / 2;
  const gapCenter = minimumCenter + Math.random() * (maximumCenter - minimumCenter);

  return {
    x,
    gapCenter,
    passed: false,
  };
}

function stepRaccoonGame(timestamp) {
  if (state.raccoonGame.status !== "running") {
    stopRaccoonAnimation();
    return;
  }

  if (!state.raccoonGame.lastTimestamp) {
    state.raccoonGame.lastTimestamp = timestamp;
  }

  const deltaSeconds = Math.min((timestamp - state.raccoonGame.lastTimestamp) / 1000, 0.032);
  state.raccoonGame.lastTimestamp = timestamp;

  updateRaccoonGame(deltaSeconds);
  drawRaccoonGame();

  if (state.raccoonGame.status === "running") {
    state.raccoonGame.frameId = window.requestAnimationFrame(stepRaccoonGame);
  } else {
    state.raccoonGame.frameId = null;
    renderStartScreen();
  }
}

function updateRaccoonGame(deltaSeconds) {
  const { raccoon } = state.raccoonGame;

  raccoon.velocityY += RACCOON_GAME_CONFIG.gravity * deltaSeconds;
  raccoon.y += raccoon.velocityY * deltaSeconds;
  raccoon.rotation = Math.max(-0.55, Math.min(0.8, raccoon.velocityY / 720));

  state.raccoonGame.obstacleTimer += deltaSeconds;
  if (state.raccoonGame.obstacleTimer >= RACCOON_GAME_CONFIG.spawnInterval) {
    state.raccoonGame.obstacleTimer -= RACCOON_GAME_CONFIG.spawnInterval;
    state.raccoonGame.obstacles.push(createRaccoonObstacle());
  }

  state.raccoonGame.obstacles.forEach((obstacle) => {
    obstacle.x -= RACCOON_GAME_CONFIG.horizontalSpeed * deltaSeconds;

    if (!obstacle.passed && obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth < raccoon.x - raccoon.radius) {
      obstacle.passed = true;
      state.raccoonGame.score += 1;

      if (state.raccoonGame.score >= RACCOON_TARGET_SCORE) {
        completeRaccoonRun();
        return;
      }

      renderStartScreen();
    }
  });

  state.raccoonGame.obstacles = state.raccoonGame.obstacles.filter(
    (obstacle) => obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth > -80
  );

  if (
    raccoon.y - raccoon.radius <= 0 ||
    raccoon.y + raccoon.radius >= RACCOON_GAME_CONFIG.height ||
    state.raccoonGame.obstacles.some((obstacle) => doesRaccoonHitObstacle(raccoon, obstacle))
  ) {
    crashRaccoonRun();
  }
}

function doesRaccoonHitObstacle(raccoon, obstacle) {
  const gapTop = obstacle.gapCenter - RACCOON_GAME_CONFIG.gapSize / 2;
  const gapBottom = obstacle.gapCenter + RACCOON_GAME_CONFIG.gapSize / 2;
  const overlapsHorizontally =
    raccoon.x + raccoon.radius > obstacle.x &&
    raccoon.x - raccoon.radius < obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth;

  if (!overlapsHorizontally) {
    return false;
  }

  return raccoon.y - raccoon.radius < gapTop || raccoon.y + raccoon.radius > gapBottom;
}

function crashRaccoonRun() {
  if (state.raccoonGame.status !== "running") {
    return;
  }

  stopRaccoonAnimation();
  state.raccoonGame.status = "crashed";
}

function completeRaccoonRun() {
  const earnedPainting = awardNextPainting();
  stopRaccoonAnimation();
  state.raccoonGame.status = "won";
  state.raccoonGame.score = RACCOON_TARGET_SCORE;
  state.introRead = true;
  state.raccoonCleared = true;
  state.latestPaintingRewardId = earnedPainting ? earnedPainting.id : null;
  setStoredValue(START_INTRO_READ_KEY, "true");
  setStoredValue(START_RACCOON_CLEARED_KEY, "true");
}

function stopRaccoonAnimation() {
  if (state.raccoonGame.frameId) {
    window.cancelAnimationFrame(state.raccoonGame.frameId);
  }

  state.raccoonGame.frameId = null;
  state.raccoonGame.lastTimestamp = 0;
}

function drawRaccoonGame() {
  const context = elements.raccoonCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const { width, height } = elements.raccoonCanvas;
  const backgroundGradient = context.createLinearGradient(0, 0, 0, height);
  backgroundGradient.addColorStop(0, "#b8e1d6");
  backgroundGradient.addColorStop(0.55, "#5a9d8c");
  backgroundGradient.addColorStop(1, "#173833");

  context.clearRect(0, 0, width, height);
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 251, 245, 0.38)";
  drawCloud(context, 82, 96, 0.95);
  drawCloud(context, 258, 148, 0.72);
  drawCloud(context, 204, 78, 0.58);

  context.fillStyle = "rgba(15, 45, 40, 0.24)";
  context.beginPath();
  context.arc(82, height + 24, 140, Math.PI, Math.PI * 2);
  context.arc(278, height + 18, 156, Math.PI, Math.PI * 2);
  context.fill();

  state.raccoonGame.obstacles.forEach((obstacle) => {
    drawRaccoonObstacle(context, obstacle, height);
  });

  drawFatRaccoon(context, state.raccoonGame.raccoon);

  if (state.raccoonGame.status !== "running") {
    drawRaccoonOverlayMessage(context, width, height);
  }
}

function drawCloud(context, x, y, scale) {
  context.beginPath();
  context.arc(x, y, 22 * scale, Math.PI, Math.PI * 2);
  context.arc(x + 24 * scale, y - 8 * scale, 16 * scale, Math.PI, Math.PI * 2);
  context.arc(x + 46 * scale, y, 20 * scale, Math.PI, Math.PI * 2);
  context.fill();
}

function drawRaccoonObstacle(context, obstacle, canvasHeight) {
  const gapTop = obstacle.gapCenter - RACCOON_GAME_CONFIG.gapSize / 2;
  const gapBottom = obstacle.gapCenter + RACCOON_GAME_CONFIG.gapSize / 2;
  const topHeight = gapTop - 18;
  const bottomY = gapBottom + 18;
  const bottomHeight = canvasHeight - bottomY;

  context.fillStyle = "#684734";
  context.fillRect(obstacle.x, 0, RACCOON_GAME_CONFIG.obstacleWidth, topHeight);
  context.fillRect(obstacle.x, bottomY, RACCOON_GAME_CONFIG.obstacleWidth, bottomHeight);

  context.fillStyle = "#9e6948";
  context.fillRect(obstacle.x - 6, topHeight - 18, RACCOON_GAME_CONFIG.obstacleWidth + 12, 18);
  context.fillRect(obstacle.x - 6, gapBottom, RACCOON_GAME_CONFIG.obstacleWidth + 12, 18);

  context.fillStyle = "rgba(255, 219, 185, 0.18)";
  context.fillRect(obstacle.x + 10, 0, 8, topHeight);
  context.fillRect(obstacle.x + 10, bottomY, 8, bottomHeight);

  context.fillStyle = "#315f4d";
  context.beginPath();
  context.arc(obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth / 2, topHeight - 14, 16, 0, Math.PI * 2);
  context.arc(obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth / 2, gapBottom + 14, 16, 0, Math.PI * 2);
  context.fill();
}

function drawFatRaccoon(context, raccoon) {
  context.save();
  context.translate(raccoon.x, raccoon.y);
  context.rotate(raccoon.rotation);

  context.fillStyle = "#8d837d";
  context.beginPath();
  context.ellipse(-34, 8, 28, 16, -0.18, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#5e5754";
  context.lineWidth = 4;
  [-46, -36, -26].forEach((stripeX) => {
    context.beginPath();
    context.moveTo(stripeX, -3);
    context.lineTo(stripeX + 10, 18);
    context.stroke();
  });

  context.fillStyle = "#7f7773";
  context.beginPath();
  context.ellipse(2, 4, 34, 26, 0.08, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#d4cbc4";
  context.beginPath();
  context.ellipse(10, 8, 16, 13, 0.1, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#7f7773";
  context.beginPath();
  context.arc(28, -11, 16, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.moveTo(16, -18);
  context.lineTo(20, -34);
  context.lineTo(31, -18);
  context.closePath();
  context.fill();

  context.beginPath();
  context.moveTo(32, -18);
  context.lineTo(39, -34);
  context.lineTo(46, -16);
  context.closePath();
  context.fill();

  context.fillStyle = "#d6b6b4";
  context.beginPath();
  context.moveTo(21, -19);
  context.lineTo(23, -29);
  context.lineTo(30, -18);
  context.closePath();
  context.fill();

  context.beginPath();
  context.moveTo(35, -18);
  context.lineTo(39, -29);
  context.lineTo(43, -17);
  context.closePath();
  context.fill();

  context.fillStyle = "#453d41";
  context.beginPath();
  context.ellipse(28, -11, 16, 10, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(23, -12, 3.2, 0, Math.PI * 2);
  context.arc(33, -12, 3.2, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#121212";
  context.beginPath();
  context.arc(23, -12, 1.3, 0, Math.PI * 2);
  context.arc(33, -12, 1.3, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f6ece2";
  context.beginPath();
  context.ellipse(28, -5, 8.5, 6.5, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#2f2626";
  context.beginPath();
  context.moveTo(28, -8);
  context.lineTo(24, -3);
  context.lineTo(32, -3);
  context.closePath();
  context.fill();

  context.restore();
}

function drawRaccoonOverlayMessage(context, width, height) {
  let title = "Ready";
  let subtitle = "Tap or press space to launch.";

  if (state.raccoonGame.status === "crashed") {
    title = "Bonk";
    subtitle = "Tap to retry the run.";
  } else if (state.raccoonGame.status === "won") {
    title = "Unlocked";
    subtitle = "Scippie goes LUX is ready.";
  }

  drawRoundedRect(context, width / 2 - 124, 42, 248, 78, 22);
  context.fillStyle = "rgba(8, 20, 18, 0.78)";
  context.fill();

  context.fillStyle = "#fff8ef";
  context.textAlign = "center";
  context.font = '700 28px "Space Grotesk", sans-serif';
  context.fillText(title, width / 2, 76);
  context.font = '500 16px "Space Grotesk", sans-serif';
  context.fillText(subtitle, width / 2, 102);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const clampedRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + clampedRadius, y);
  context.lineTo(x + width - clampedRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + clampedRadius);
  context.lineTo(x + width, y + height - clampedRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - clampedRadius, y + height);
  context.lineTo(x + clampedRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - clampedRadius);
  context.lineTo(x, y + clampedRadius);
  context.quadraticCurveTo(x, y, x + clampedRadius, y);
  context.closePath();
}

function renderBoard() {
  elements.board.innerHTML = state.tiles
    .map((tile) => {
      const solvedClass = tile.solved ? "is-solved" : "";
      const imageClass = tile.imageSrc ? "is-image" : "";
      const ariaLabel = tile.solved
        ? `${tile.label} solved`
        : `Open the question for ${tile.label}`;
      const tileImageStyle = buildTileImageStyle(tile);
      const tileContent = tile.imageSrc
        ? `<img class="tile-image" src="${tile.imageSrc}" alt="${tile.imageAlt}" loading="lazy" decoding="async" ${
            tileImageStyle ? `style="${escapeHtml(tileImageStyle)}"` : ""
          } />`
        : `<span class="tile-label">${tile.label}</span>`;

      return `
        <button class="bingo-tile ${solvedClass} ${imageClass}" data-tile-id="${tile.id}" type="button" ${
          tile.solved ? "disabled" : ""
        } aria-label="${ariaLabel}">
          ${tileContent}
          <span class="tile-check" aria-hidden="true">OK</span>
        </button>
      `;
    })
    .join("");
}

function renderScore() {
  elements.scoreValue.textContent = String(state.score);
}

function handleBoardClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const tileButton = target.closest("[data-tile-id]");
  if (!(tileButton instanceof HTMLButtonElement)) {
    return;
  }

  const tile = state.tiles.find((item) => item.id === tileButton.dataset.tileId);
  if (!tile || tile.solved) {
    return;
  }

  openModal(tile);
}

function handleOptionGridClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const optionButton = target.closest("[data-option-value]");
  if (!(optionButton instanceof HTMLButtonElement)) {
    return;
  }

  if (state.isSubmitting) {
    return;
  }

  const tile = getActiveTile();
  if (!tile || getTileInputMode(tile) !== "multi-select") {
    return;
  }

  const optionValue = optionButton.dataset.optionValue;
  if (!optionValue) {
    return;
  }

  const currentSelection = new Set(state.selectedOptions);
  if (currentSelection.has(optionValue)) {
    currentSelection.delete(optionValue);
  } else if (currentSelection.size < (tile.selectionLimit || 3)) {
    currentSelection.add(optionValue);
  }

  state.selectedOptions = Array.from(currentSelection);
  renderOptionGrid(tile);
  updateAnswerControls(tile);
  setFeedback("", "");
}

function openModal(tile) {
  state.activeTileId = tile.id;
  state.selectedOptions = [];

  if (tile.imageSrc) {
    elements.modalImage.src = tile.imageSrc;
    elements.modalImage.alt = tile.imageAlt;
    elements.modalImage.hidden = false;
  } else {
    elements.modalImage.removeAttribute("src");
    elements.modalImage.alt = "";
    elements.modalImage.hidden = true;
  }

  elements.modalPrompt.textContent = tile.question;
  elements.answerInput.value = "";
  setFeedback("", "");
  setSubmitBusy(false);
  renderOptionGrid(tile);
  updateAnswerControls(tile);
  elements.reviewPanel.hidden = true;
  elements.reviewPanel.innerHTML = "";

  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(force = false) {
  if (!force && state.isSubmitting) {
    return;
  }

  state.activeTileId = null;
  state.selectedOptions = [];

  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  elements.answerInput.value = "";
  elements.optionGrid.innerHTML = "";
  elements.optionGrid.hidden = true;
  elements.reviewPanel.hidden = true;
  elements.reviewPanel.innerHTML = "";
  setFeedback("", "");
  setSubmitBusy(false);
}

async function handleAnswerSubmit(event) {
  event.preventDefault();

  const tile = getActiveTile();
  if (!tile) {
    return;
  }

  if (getTileInputMode(tile) === "multi-select") {
    if (usesManualVerification(tile)) {
      await handleManualMultiSelectSubmit(tile);
      return;
    }
    await handleMultiSelectSubmit(tile);
    return;
  }

  if (getTileInputMode(tile) === "verify-only") {
    await handleVerifyOnlySubmit(tile);
    return;
  }

  if (usesManualVerification(tile)) {
    await handleManualTextSubmit(tile);
    return;
  }

  const attempt = evaluateTextAttempt(tile, elements.answerInput.value);
  if (!attempt) {
    return;
  }

  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performVerification();
    const totalPoints = solveTile(tile, attempt.basePoints);
    closeModal(true);
    showPointsBurst(totalPoints);
  } catch (error) {
    setFeedback(getVerificationErrorMessage(error), "is-error");
  } finally {
    setSubmitBusy(false);
    updateAnswerControls(tile);
  }
}

async function handleManualTextSubmit(tile) {
  const attempt = evaluateManualTextAttempt(tile, elements.answerInput.value);
  if (!attempt) {
    return;
  }

  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performVerification();
    const totalPoints = solveTile(tile, attempt.basePoints);
    closeModal(true);
    showPointsBurst(totalPoints);
  } catch (error) {
    setFeedback(getVerificationErrorMessage(error), "is-error");
  } finally {
    setSubmitBusy(false);
    updateAnswerControls(tile);
  }
}

async function handleMultiSelectSubmit(tile) {
  const requiredSelections = tile.selectionLimit || 3;
  if (state.selectedOptions.length !== requiredSelections) {
    setFeedback(`Select ${requiredSelections} songs first.`, "is-error");
    return;
  }

  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performVerification();

    const attempt = evaluateMultiSelectAttempt(tile);
    if (!attempt) {
      return;
    }

    const totalPoints = solveTile(tile, attempt.basePoints);
    closeModal(true);
    showPointsBurst(totalPoints);
  } catch (error) {
    setFeedback(getVerificationErrorMessage(error), "is-error");
  } finally {
    setSubmitBusy(false);
    updateAnswerControls(tile);
  }
}

async function handleManualMultiSelectSubmit(tile) {
  const requiredSelections = tile.selectionLimit || 3;
  if (state.selectedOptions.length !== requiredSelections) {
    setFeedback(`Select ${requiredSelections} songs first.`, "is-error");
    return;
  }

  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performVerification();
    const totalPoints = solveTile(tile, tile.verifiedPoints || 1);
    closeModal(true);
    showPointsBurst(totalPoints);
  } catch (error) {
    setFeedback(getVerificationErrorMessage(error), "is-error");
  } finally {
    setSubmitBusy(false);
    updateAnswerControls(tile);
  }
}

async function handleVerifyOnlySubmit(tile) {
  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performVerification();
    const totalPoints = solveTile(tile, tile.correctPoints || 1);
    closeModal(true);
    showPointsBurst(totalPoints);
  } catch (error) {
    setFeedback(getVerificationErrorMessage(error), "is-error");
  } finally {
    setSubmitBusy(false);
    updateAnswerControls(tile);
  }
}

function evaluateTextAttempt(tile, rawAnswer) {
  const normalizedAnswer = normalizeText(rawAnswer);

  if (!normalizedAnswer && !tile.blankPoints) {
    setFeedback("Type an answer first.", "is-error");
    return null;
  }

  if (!normalizedAnswer && tile.blankPoints) {
    return {
      basePoints: tile.blankPoints,
    };
  }

  const isCorrect = tile.answers.some((answer) => normalizeText(answer) === normalizedAnswer);
  if (!isCorrect) {
    const feedbackMessage = tile.blankPoints
      ? "Not quite. Try again, or leave it blank for 1 point."
      : "Not quite. Try again.";
    setFeedback(feedbackMessage, "is-error");
    return null;
  }

  return {
    basePoints: tile.correctPoints || 1,
  };
}

function evaluateMultiSelectAttempt(tile) {
  const selected = state.selectedOptions.map(normalizeText).sort();
  const correct = tile.correctOptions.map(normalizeText).sort();
  const isCorrect =
    selected.length === correct.length &&
    selected.every((value, index) => value === correct[index]);

  if (!isCorrect) {
    setFeedback("Not quite. Try again.", "is-error");
    return null;
  }

  return {
    basePoints: tile.correctPoints || 2,
  };
}

function evaluateManualTextAttempt(tile, rawAnswer) {
  const hasAnswer = rawAnswer.trim().length > 0;
  return {
    basePoints: hasAnswer ? tile.correctPoints || 2 : tile.blankPoints || 1,
  };
}

function renderOptionGrid(tile) {
  const isMultiSelect = getTileInputMode(tile) === "multi-select";
  elements.optionGrid.hidden = !isMultiSelect;

  if (!isMultiSelect) {
    elements.optionGrid.innerHTML = "";
    return;
  }

  const selectedOptions = new Set(state.selectedOptions);
  elements.optionGrid.innerHTML = tile.options
    .map((option) => {
      const isSelected = selectedOptions.has(option);
      const selectedClass = isSelected ? "is-selected" : "";
      return `
        <button
          class="option-chip ${selectedClass}"
          type="button"
          data-option-value="${escapeHtml(option)}"
          aria-pressed="${isSelected ? "true" : "false"}"
        >
          ${escapeHtml(option)}
        </button>
      `;
    })
    .join("");
}

function updateAnswerControls(tile) {
  const inputMode = getTileInputMode(tile);
  const isMultiSelect = inputMode === "multi-select";
  const isVerifyOnly = inputMode === "verify-only";

  elements.answerForm.classList.toggle("is-verify-only", isVerifyOnly);
  elements.answerForm.classList.remove("is-reviewing");
  elements.answerInput.hidden = isMultiSelect || isVerifyOnly;
  elements.answerInput.disabled = isVerifyOnly;
  elements.selectionSummary.hidden = !isMultiSelect;
  elements.answerInput.style.display = isMultiSelect || isVerifyOnly ? "none" : "";
  elements.selectionSummary.style.display = isMultiSelect ? "grid" : "none";
  elements.optionGrid.hidden = !isMultiSelect;
  elements.reviewPanel.hidden = true;
  elements.reviewPanel.innerHTML = "";

  if (isMultiSelect) {
    const requiredSelections = tile.selectionLimit || 3;
    const selectedCount = state.selectedOptions.length;
    elements.selectionSummary.textContent = `${selectedCount} / ${requiredSelections} selected`;
    elements.submitButton.disabled = selectedCount !== requiredSelections;
  } else {
    elements.answerInput.placeholder = tile.blankPoints ? "Answer or leave blank" : "Answer";
    elements.submitButton.disabled = false;
  }
}

function setFeedback(message, typeClass) {
  elements.answerFeedback.textContent = message;
  elements.answerFeedback.className = "answer-feedback";
  if (typeClass) {
    elements.answerFeedback.classList.add(typeClass);
  }
}

function setSubmitBusy(isBusy) {
  state.isSubmitting = isBusy;

  const tile = getActiveTile();
  const inputMode = tile ? getTileInputMode(tile) : "text";

  elements.closeModalButton.disabled = isBusy;
  elements.submitButton.textContent = isBusy ? "..." : "OK";

  if (inputMode === "multi-select") {
    elements.submitButton.disabled = isBusy || state.selectedOptions.length !== (tile.selectionLimit || 3);
    const optionButtons = elements.optionGrid.querySelectorAll(".option-chip");
    optionButtons.forEach((button) => {
      button.disabled = isBusy;
    });
  } else {
    elements.answerInput.disabled = isBusy || inputMode === "verify-only";
    elements.submitButton.disabled = isBusy;
  }
}

function solveTile(tile, basePoints) {
  tile.solved = true;

  const newlyCompletedLines = collectNewlyCompletedLines(tile.index);
  const bingoPoints = newlyCompletedLines.reduce((total, line) => total + line.points, 0);
  const totalPoints = basePoints + bingoPoints;

  state.score += totalPoints;

  renderBoard();
  renderScore();
  pulseScore();

  if (newlyCompletedLines.length > 0) {
    showBingoBurst(newlyCompletedLines.length);
  }

  return totalPoints;
}

function resetGame() {
  closeModal(true);
  clearCelebrationBursts();
  state.tiles = state.tiles.map((tile) => ({
    ...tile,
    solved: false,
  }));
  state.score = 0;
  state.completedLines = new Set();
  state.activeTileId = null;
  state.selectedOptions = [];
  render();
}

function clearCelebrationBursts() {
  clearTimeout(state.pointsBurstTimer);
  clearTimeout(state.bingoBurstTimer);
  state.pointsBurstTimer = null;
  state.bingoBurstTimer = null;
  elements.pointsBurst.classList.remove("is-visible");
  elements.bingoBurst.classList.remove("is-visible");
}

function pulseScore() {
  elements.scorePill.classList.remove("is-bumping");
  void elements.scorePill.offsetWidth;
  elements.scorePill.classList.add("is-bumping");
}

function showPointsBurst(points) {
  clearTimeout(state.pointsBurstTimer);
  elements.pointsBurst.textContent = `+${points}`;
  elements.pointsBurst.classList.remove("is-visible");
  void elements.pointsBurst.offsetWidth;
  elements.pointsBurst.classList.add("is-visible");

  state.pointsBurstTimer = window.setTimeout(() => {
    elements.pointsBurst.classList.remove("is-visible");
  }, 1100);
}

function showBingoBurst(completedLineCount) {
  clearTimeout(state.bingoBurstTimer);
  elements.bingoBurst.textContent = completedLineCount > 1 ? `BINGO x${completedLineCount}!` : "BINGO!";
  elements.bingoBurst.classList.remove("is-visible");
  void elements.bingoBurst.offsetWidth;
  elements.bingoBurst.classList.add("is-visible");

  state.bingoBurstTimer = window.setTimeout(() => {
    elements.bingoBurst.classList.remove("is-visible");
  }, 1400);
}

function collectNewlyCompletedLines(tileIndex) {
  const relevantLines = lineDefinitions.filter((line) => line.indices.includes(tileIndex));
  const completedNow = [];

  relevantLines.forEach((line) => {
    const isSolved = line.indices.every((index) => state.tiles[index]?.solved);
    if (isSolved && !state.completedLines.has(line.id)) {
      state.completedLines.add(line.id);
      completedNow.push(line);
    }
  });

  return completedNow;
}

function buildLineDefinitions(rows, columns) {
  const lines = [];

  for (let row = 0; row < rows; row += 1) {
    const indices = [];
    for (let column = 0; column < columns; column += 1) {
      indices.push(row * columns + column);
    }
    lines.push({
      id: `row-${row}`,
      indices,
      points: 1,
    });
  }

  for (let column = 0; column < columns; column += 1) {
    const indices = [];
    for (let row = 0; row < rows; row += 1) {
      indices.push(row * columns + column);
    }
    lines.push({
      id: `column-${column}`,
      indices,
      points: 3,
    });
  }

  return lines;
}

function getActiveTile() {
  return state.tiles.find((tile) => tile.id === state.activeTileId) || null;
}

function getTileInputMode(tile) {
  return tile.inputMode || "text";
}

function usesManualVerification(tile) {
  return tile.manualVerification === true;
}

function buildOpeningLayout(definitions) {
  const luxTile = definitions.find((tile) => tile.openingPlacement === "center");
  const languageTiles = shuffleArray(definitions.filter((tile) => tile.category === "language"));

  if (!luxTile) {
    return shuffleArray(definitions);
  }

  const languagePositions = getOptimalLanguagePositions(languageTiles.length, [centerTileIndex]);
  if (languagePositions.length !== languageTiles.length) {
    return shuffleArray(definitions);
  }

  const arrangedDefinitions = Array(expectedTileCount).fill(null);
  arrangedDefinitions[centerTileIndex] = luxTile;

  languagePositions.forEach((position, index) => {
    arrangedDefinitions[position] = languageTiles[index];
  });

  const remainingTiles = shuffleArray(
    definitions.filter((tile) => tile !== luxTile && tile.category !== "language")
  );
  let remainingIndex = 0;

  for (let index = 0; index < arrangedDefinitions.length; index += 1) {
    if (!arrangedDefinitions[index]) {
      arrangedDefinitions[index] = remainingTiles[remainingIndex];
      remainingIndex += 1;
    }
  }

  return arrangedDefinitions;
}

function getOptimalLanguagePositions(languageCount, blockedIndices = []) {
  const blockedIndexSet = new Set(blockedIndices);
  const availableIndices = [];

  for (let index = 0; index < expectedTileCount; index += 1) {
    if (!blockedIndexSet.has(index)) {
      availableIndices.push(index);
    }
  }

  let bestAdjacencyCount = Number.POSITIVE_INFINITY;
  const bestCombinations = [];

  function search(startIndex, currentCombination) {
    if (currentCombination.length === languageCount) {
      const adjacencyCount = countOrthogonalAdjacencies(currentCombination);

      if (adjacencyCount < bestAdjacencyCount) {
        bestAdjacencyCount = adjacencyCount;
        bestCombinations.length = 0;
        bestCombinations.push([...currentCombination]);
      } else if (adjacencyCount === bestAdjacencyCount) {
        bestCombinations.push([...currentCombination]);
      }

      return;
    }

    const needed = languageCount - currentCombination.length;

    for (let index = startIndex; index <= availableIndices.length - needed; index += 1) {
      currentCombination.push(availableIndices[index]);
      search(index + 1, currentCombination);
      currentCombination.pop();
    }
  }

  search(0, []);

  if (bestCombinations.length === 0) {
    return [];
  }

  return shuffleArray(bestCombinations)[0];
}

function countOrthogonalAdjacencies(indices) {
  const indexSet = new Set(indices);
  let adjacencyCount = 0;

  indices.forEach((index) => {
    const row = Math.floor(index / boardColumns);
    const column = index % boardColumns;
    const rightNeighbor = index + 1;
    const bottomNeighbor = index + boardColumns;

    if (column + 1 < boardColumns && indexSet.has(rightNeighbor)) {
      adjacencyCount += 1;
    }

    if (row + 1 < boardRows && indexSet.has(bottomNeighbor)) {
      adjacencyCount += 1;
    }
  });

  return adjacencyCount;
}

function shuffleArray(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function buildTileImageStyle(tile) {
  const styles = [];

  if (tile.tileImageFit) {
    styles.push(`object-fit: ${tile.tileImageFit}`);
  }

  if (tile.tileImagePosition) {
    styles.push(`object-position: ${tile.tileImagePosition}`);
  }

  return styles.join("; ");
}

async function performVerification() {
  if (shouldUsePinVerification()) {
    await performPinVerification();
    return;
  }

  await performBiometricVerification();
}

function shouldUsePinVerification() {
  return isIOSDevice();
}

function isIOSDevice() {
  const userAgent = window.navigator.userAgent || "";
  const platform = window.navigator.platform || "";

  return (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (platform === "MacIntel" && window.navigator.maxTouchPoints > 1)
  );
}

async function performPinVerification() {
  const enteredPin = window.prompt("Enter verifier PIN", "");

  if (enteredPin === null) {
    throw new Error("pin-cancelled");
  }

  if (enteredPin.trim() !== getIosVerificationPin()) {
    throw new Error("pin-incorrect");
  }
}

async function performBiometricVerification() {
  if (!window.isSecureContext) {
    throw new Error("secure-context-required");
  }

  if (
    typeof window.PublicKeyCredential === "undefined" ||
    !navigator.credentials ||
    typeof navigator.credentials.create !== "function" ||
    typeof navigator.credentials.get !== "function" ||
    typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function"
  ) {
    throw new Error("biometric-unavailable");
  }

  const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (!available) {
    throw new Error("biometric-unavailable");
  }

  const storedCredentialId = getStoredValue(BIOMETRIC_CREDENTIAL_KEY);

  if (!storedCredentialId) {
    await registerBiometricCredential();
    return;
  }

  try {
    const assertion = await navigator.credentials.get({
      publicKey: buildAssertionOptions(storedCredentialId),
    });

    if (!assertion) {
      throw new Error("verification-cancelled");
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "InvalidStateError") {
      clearStoredValue(BIOMETRIC_CREDENTIAL_KEY);
      await registerBiometricCredential();
      return;
    }

    throw error;
  }
}

async function registerBiometricCredential() {
  const credential = await navigator.credentials.create({
    publicKey: buildCredentialOptions(),
  });

  if (!credential || !("rawId" in credential)) {
    throw new Error("verification-cancelled");
  }

  setStoredValue(BIOMETRIC_CREDENTIAL_KEY, bufferToBase64Url(credential.rawId));
}

function buildCredentialOptions() {
  return {
    challenge: randomBytes(32),
    rp: { name: "Scippie goes LUX" },
    user: {
      id: getOrCreateBiometricUserId(),
      name: "lux-bingo-player",
      displayName: "Scippie goes LUX Player",
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      residentKey: "preferred",
      userVerification: "required",
    },
    timeout: 60000,
    attestation: "none",
  };
}

function buildAssertionOptions(credentialId) {
  return {
    challenge: randomBytes(32),
    allowCredentials: [
      {
        type: "public-key",
        id: base64UrlToUint8Array(credentialId),
      },
    ],
    timeout: 60000,
    userVerification: "required",
  };
}

function getOrCreateBiometricUserId() {
  const storedUserId = getStoredValue(BIOMETRIC_USER_ID_KEY);
  if (storedUserId) {
    return base64UrlToUint8Array(storedUserId);
  }

  const newUserId = randomBytes(32);
  setStoredValue(BIOMETRIC_USER_ID_KEY, bufferToBase64Url(newUserId));
  return newUserId;
}

function getVerificationErrorMessage(error) {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Verification was cancelled.";
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return "Verification was interrupted.";
  }

  if (error instanceof Error && error.message === "secure-context-required") {
    return "Use the installed HTTPS app to verify on this device.";
  }

  if (error instanceof Error && error.message === "biometric-unavailable") {
    return "Biometric verification is not available here.";
  }

  if (error instanceof Error && error.message === "pin-cancelled") {
    return "PIN entry was cancelled.";
  }

  if (error instanceof Error && error.message === "pin-incorrect") {
    return "Incorrect PIN. Try again.";
  }

  return "Verification failed. Try again.";
}

function getIosVerificationPin() {
  return getStoredValue(IOS_VERIFICATION_PIN_KEY) || DEFAULT_IOS_VERIFICATION_PIN;
}

function getStoredPaintingIds() {
  const rawValue = getStoredValue(GALLERY_PAINTINGS_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const validPaintingIds = new Set(GALLERY_REWARD_POOL.map((painting) => painting.id));
    const normalizedPaintingIds = [];

    parsedValue.forEach((paintingId) => {
      if (
        typeof paintingId === "string" &&
        validPaintingIds.has(paintingId) &&
        !normalizedPaintingIds.includes(paintingId)
      ) {
        normalizedPaintingIds.push(paintingId);
      }
    });

    return normalizedPaintingIds;
  } catch (error) {
    console.error("Painting storage parse failed:", error);
    return [];
  }
}

function setStoredPaintingIds(paintingIds) {
  try {
    window.localStorage.setItem(GALLERY_PAINTINGS_KEY, JSON.stringify(paintingIds));
  } catch (error) {
    console.error("Painting storage write failed:", error);
  }
}

function reconcileUnlockedPaintings(storedPaintingIds, raccoonCleared) {
  if (storedPaintingIds.length > 0 || !raccoonCleared) {
    return storedPaintingIds;
  }

  return GALLERY_REWARD_POOL[0] ? [GALLERY_REWARD_POOL[0].id] : [];
}

function getStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error("Storage read failed:", error);
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error("Storage write failed:", error);
  }
}

function clearStoredValue(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Storage remove failed:", error);
  }
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function bufferToBase64Url(value) {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToUint8Array(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function normalizeText(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
