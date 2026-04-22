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
const FINAL_ENTRY_UNLOCK_HOUR = 20;
const RACCOON_START_HEALTH = 1;
const RACCOON_MAX_HEALTH = 3;
const RACCOON_MIN_GRAPES_PER_RUN = 1;
const RACCOON_MAX_GRAPES_PER_RUN = 2;
const RACCOON_DAMAGE_EXIT_PADDING = 12;
const RACCOON_BOUNDARY_RECOVERY_INSET = 18;
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
    title: "Venus of Milo",
    artist: "Alexandros of Antioch",
    note: "A museum postcard right above Scippie's bed.",
    imageSrc: "images/venus.jpg",
    imageAlt: "The Venus de Milo sculpture displayed in a frame.",
  },
  {
    id: "icarus",
    title: "The fall of Icarus",
    artist: "Jacob Peter Gowy",
    note: "Pinned near the desk lamp where Scippie studies late.",
    imageSrc: "images/icarus.jpg",
    imageAlt: "A dramatic artwork showing a mythological scene.",
  },
  {
    id: "maria-teresa",
    title: "La infanta María Teresa de España",
    artist: "Diego Velazquez",
    note: "A formal portrait Scippie hung extra straight on the wall.",
    imageSrc: "images/Maria Theresa of Spain.jpeg",
    imageAlt: "A formal portrait painting of a royal woman.",
  },
  {
    id: "goya-work",
    title: "Witches' Sabbath",
    artist: "Francisco Goya",
    note: "One of the darker prints in the room's quiet corner.",
    imageSrc: "images/goya.jpg",
    imageAlt: "A painting associated with Goya.",
  },
  {
    id: "mona-lisa",
    title: "Mona Lisa",
    artist: "Leonardo Da Vinci",
    note: "A memento from Scippie's visit to the Louvre.",
    imageSrc: "images/monalisa.jpg",
    imageAlt: "The Mona Lisa painting displayed in a frame.",
  },
  {
    id: "degas-work",
    title: "The Ballet Class",
    artist: "Edgar Degas",
    note: "Hung low enough for Scippie to admire while lounging.",
    imageSrc: "images/degas.jpg",
    imageAlt: "An artwork associated with Degas.",
  },
  {
    id: "the-scream",
    title: "The Scream",
    artist: "Edvard Munch",
    note: "Tilted just a little, which somehow makes it perfect.",
    imageSrc: "images/schreeuw.jpg",
    imageAlt: "The Scream painting displayed in a frame.",
  },
]);
const GALLERY_WALL_LAYOUT = Object.freeze([
  { left: 8, top: 10, width: 15, rotate: -4, ratio: "4 / 5" },
  { left: 27, top: 7, width: 19, rotate: 3, ratio: "6 / 5" },
  { left: 51, top: 10, width: 14, rotate: -2, ratio: "4 / 5" },
  { left: 69, top: 8, width: 14, rotate: 4, ratio: "4 / 5" },
  { left: 16, top: 43, width: 15, rotate: 2, ratio: "4 / 5" },
  { left: 39, top: 40, width: 14, rotate: -3, ratio: "4 / 5" },
  { left: 61, top: 44, width: 15, rotate: 4, ratio: "1 / 1" },
]);
const RACCOON_GOAL_IMAGES = new Map(
  GALLERY_REWARD_POOL.map((painting) => {
    const image = new Image();
    image.decoding = "async";
    image.src = painting.imageSrc;
    return [painting.id, image];
  })
);
let raccoonObstacleIdCounter = 0;
let finalEntryAvailabilityTimer = 0;

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
      "Sexo, Violencia y Llantas",      
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
      "Despecha",
      "Hentai",
      "Bizcochito",
      "Delirio de Grandeza",
    ],
    correctOptions: ["Saoko", "La Fama", "Bizcochito"],
    verifiedPoints: 1,
  },
];

const lineDefinitions = buildLineDefinitions(boardRows, boardColumns);
const storedRaccoonClearedFlag = getStoredValue(START_RACCOON_CLEARED_KEY) === "true";
const storedGalleryPaintingIds = reconcileUnlockedPaintings(getStoredPaintingIds(), storedRaccoonClearedFlag);
const storedRaccoonCleared = storedRaccoonClearedFlag || storedGalleryPaintingIds.length > 0;
const storedIntroRead = storedRaccoonCleared || getStoredValue(START_INTRO_READ_KEY) === "true";

const state = {
  hasStarted: false,
  introRead: storedIntroRead,
  storyInteracted: false,
  raccoonCleared: storedRaccoonCleared,
  activeStartPanel: null,
  raccoonGame: createRaccoonGameState("idle"),
  unlockedPaintingIds: storedGalleryPaintingIds,
  selectedPaintingId: storedGalleryPaintingIds[storedGalleryPaintingIds.length - 1] || null,
  galleryModalPaintingId: null,
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
  startOverlayCard: document.querySelector("#start-overlay-card"),
  startOverlayTitle: document.querySelector("#start-overlay-title"),
  startOverlayCloseButton: document.querySelector("#start-overlay-close-button"),
  storyPanel: document.querySelector("#story-panel"),
  storyScroll: document.querySelector("#story-scroll"),
  galleryPanel: document.querySelector("#gallery-panel"),
  galleryWallGrid: document.querySelector("#gallery-wall-grid"),
  galleryArtModal: document.querySelector("#gallery-art-modal"),
  galleryArtModalBackdrop: document.querySelector("#gallery-art-modal-backdrop"),
  galleryArtModalCloseButton: document.querySelector("#gallery-art-modal-close-button"),
  galleryArtModalImage: document.querySelector("#gallery-art-modal-image"),
  galleryArtModalTitle: document.querySelector("#gallery-art-modal-title"),
  galleryArtModalArtist: document.querySelector("#gallery-art-modal-artist"),
  galleryArtModalNote: document.querySelector("#gallery-art-modal-note"),
  galleryRaccoonButton: document.querySelector("#gallery-raccoon-button"),
  raccoonPanel: document.querySelector("#raccoon-panel"),
  raccoonCanvas: document.querySelector("#raccoon-canvas"),
  board: document.querySelector("#bingo-board"),
  scorePill: document.querySelector("#score-pill"),
  scoreValue: document.querySelector("#score-value"),
  bingoCloseButton: document.querySelector("#bingo-close-button"),
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
  elements.storyScroll.addEventListener("pointerdown", handleStoryInteraction);
  elements.storyScroll.addEventListener("wheel", handleStoryInteraction, { passive: true });
  elements.storyScroll.addEventListener("keydown", handleStoryInteraction);
  elements.galleryWallGrid.addEventListener("click", handleGalleryWallClick);
  elements.galleryArtModalBackdrop.addEventListener("click", closeGalleryArtModal);
  elements.galleryArtModalCloseButton.addEventListener("click", closeGalleryArtModal);
  elements.galleryRaccoonButton.addEventListener("click", feedGalleryRaccoon);
  elements.raccoonCanvas.addEventListener("pointerdown", handleRaccoonPointerDown);
  elements.board.addEventListener("click", handleBoardClick);
  elements.optionGrid.addEventListener("click", handleOptionGridClick);
  elements.answerForm.addEventListener("submit", handleAnswerSubmit);
  elements.resetButton.addEventListener("click", resetGame);
  elements.bingoCloseButton.addEventListener("click", returnToStartMenu);
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
  if (state.hasStarted || !isMainGameUnlocked()) {
    return;
  }

  closeStartOverlay(true);
  state.hasStarted = true;
  render();
}

function returnToStartMenu() {
  if (!state.hasStarted || state.isSubmitting) {
    return;
  }

  closeModal(true);
  clearCelebrationBursts();
  state.activeStartPanel = null;
  state.hasStarted = false;
  render();
}

function renderStartScreen() {
  const overlayOpen = !state.hasStarted && Boolean(state.activeStartPanel);
  const galleryUnlocked = hasUnlockedGallery();

  elements.galleryButton.disabled = !galleryUnlocked;
  elements.raccoonButton.disabled = !state.introRead;
  elements.bingoButton.disabled = !isMainGameUnlocked();

  elements.startOverlay.hidden = !overlayOpen;
  elements.startOverlay.classList.toggle("is-raccoon-panel", state.activeStartPanel === START_PANEL_RACCOON);
  elements.startOverlayCard.classList.toggle("is-intro-panel", state.activeStartPanel === START_PANEL_STORY);
  elements.startOverlayCard.classList.toggle("is-gallery-panel", state.activeStartPanel === START_PANEL_GALLERY);
  elements.startOverlayCard.classList.toggle("is-raccoon-panel", state.activeStartPanel === START_PANEL_RACCOON);
  elements.storyPanel.hidden = state.activeStartPanel !== START_PANEL_STORY;
  elements.galleryPanel.hidden = state.activeStartPanel !== START_PANEL_GALLERY;
  elements.raccoonPanel.hidden = state.activeStartPanel !== START_PANEL_RACCOON;
  elements.startOverlayTitle.textContent = getStartOverlayTitle();

  elements.galleryRaccoonButton.classList.toggle("is-fed", state.galleryRaccoonMood === "fed");

  document.body.classList.toggle("start-overlay-open", overlayOpen);

  if (overlayOpen && state.activeStartPanel === START_PANEL_GALLERY) {
    renderGallery();
    renderGalleryArtModal();
  }

  if (overlayOpen && state.activeStartPanel === START_PANEL_RACCOON) {
    drawRaccoonGame();
  }

  scheduleFinalEntryAvailabilityRefresh();
}

function getStartOverlayTitle() {
  if (state.activeStartPanel === START_PANEL_GALLERY) {
    return "Scippie's Gallery";
  }

  if (state.activeStartPanel === START_PANEL_RACCOON) {
    return "Art/grape hunt";
  }

  return "Intro";
}

function hasUnlockedGallery() {
  return state.unlockedPaintingIds.length > 0;
}

function isAfterFinalEntryHour(now = new Date()) {
  return now.getHours() >= FINAL_ENTRY_UNLOCK_HOUR;
}

function isMainGameUnlocked(now = new Date()) {
  return hasUnlockedGallery() && isAfterFinalEntryHour(now);
}

function getNextFinalEntryAvailabilityTransition(now = new Date()) {
  const nextTransition = new Date(now);

  if (isAfterFinalEntryHour(now)) {
    nextTransition.setDate(nextTransition.getDate() + 1);
    nextTransition.setHours(0, 0, 0, 0);
    return nextTransition;
  }

  nextTransition.setHours(FINAL_ENTRY_UNLOCK_HOUR, 0, 0, 0);
  return nextTransition;
}

function scheduleFinalEntryAvailabilityRefresh() {
  window.clearTimeout(finalEntryAvailabilityTimer);

  const now = new Date();
  const nextTransition = getNextFinalEntryAvailabilityTransition(now);
  const delay = Math.max(250, nextTransition.getTime() - now.getTime() + 250);

  finalEntryAvailabilityTimer = window.setTimeout(() => {
    finalEntryAvailabilityTimer = 0;
    renderStartScreen();
  }, delay);
}

function openIntroStory() {
  if (state.hasStarted) {
    return;
  }

  clearGalleryFeedState();
  state.storyInteracted = false;
  state.activeStartPanel = START_PANEL_STORY;
  stopRaccoonAnimation();
  renderStartScreen();

  elements.storyScroll.scrollTop = 0;
  elements.storyScroll.focus();
}

function openGallery() {
  if (state.hasStarted || !hasUnlockedGallery()) {
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
  const unlockedPaintingIds = new Set(state.unlockedPaintingIds);

  elements.galleryWallGrid.innerHTML = GALLERY_REWARD_POOL.map((painting, index) => {
    const isUnlocked = unlockedPaintingIds.has(painting.id);
    const slotClass = isUnlocked ? "is-unlocked" : "is-empty";
    const layout = GALLERY_WALL_LAYOUT[index] || GALLERY_WALL_LAYOUT[GALLERY_WALL_LAYOUT.length - 1];
    const ariaLabel = isUnlocked
      ? `View ${painting.title} by ${painting.artist}`
      : "Empty frame";
    const surfaceMarkup = isUnlocked
      ? `
        <span class="gallery-art-surface">
          <img src="${painting.imageSrc}" alt="${escapeHtml(painting.imageAlt)}" loading="lazy" decoding="async" />
        </span>
      `
      : '<span class="gallery-art-placeholder" aria-hidden="true"></span>';

    return `
      <button
        class="gallery-slot ${slotClass}"
        type="button"
        data-gallery-painting-id="${painting.id}"
        aria-label="${escapeHtml(ariaLabel)}"
        style="${escapeHtml(buildGallerySlotStyle(layout))}"
        ${isUnlocked ? "" : "disabled"}
      >
        <span class="gallery-frame">
          ${surfaceMarkup}
        </span>
      </button>
    `;
  }).join("");
}

function renderGalleryArtModal() {
  const painting = getPaintingById(state.galleryModalPaintingId);
  const isUnlocked = Boolean(painting && state.unlockedPaintingIds.includes(painting.id));

  elements.galleryArtModal.hidden = !isUnlocked;

  if (!painting || !isUnlocked) {
    return;
  }

  elements.galleryArtModalImage.src = painting.imageSrc;
  elements.galleryArtModalImage.alt = painting.imageAlt;
  elements.galleryArtModalTitle.textContent = painting.title;
  elements.galleryArtModalArtist.textContent = painting.artist;
  elements.galleryArtModalNote.textContent = painting.note;
}

function closeGalleryArtModal() {
  if (state.galleryModalPaintingId === null) {
    return;
  }

  state.galleryModalPaintingId = null;
  renderStartScreen();
}

function buildGallerySlotStyle(layout) {
  return [
    `--gallery-slot-left: ${layout.left}%`,
    `--gallery-slot-top: ${layout.top}%`,
    `--gallery-slot-width: ${layout.width}%`,
    `--gallery-slot-rotate: ${layout.rotate}deg`,
    `--gallery-slot-ratio: ${layout.ratio}`,
  ].join("; ");
}

function getRaccoonTargetPainting() {
  if (state.raccoonGame.status === "won" && state.latestPaintingRewardId) {
    return getPaintingById(state.latestPaintingRewardId);
  }

  const unlockedPaintingIds = new Set(state.unlockedPaintingIds);
  const nextPainting = GALLERY_REWARD_POOL.find((painting) => !unlockedPaintingIds.has(painting.id));
  return nextPainting || null;
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

  if (!state.unlockedPaintingIds.includes(paintingId)) {
    return;
  }

  state.selectedPaintingId = paintingId;
  state.galleryModalPaintingId = paintingId;
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
  state.galleryModalPaintingId = null;
  stopRaccoonAnimation();
  state.activeStartPanel = null;
  renderStartScreen();
}

function handleStoryScroll() {
  if (state.activeStartPanel !== START_PANEL_STORY || state.introRead) {
    return;
  }

  state.storyInteracted = true;

  if (!storyNeedsScrolling()) {
    unlockIntroStory();
    return;
  }

  const scrollDistance =
    elements.storyScroll.scrollHeight - elements.storyScroll.clientHeight - elements.storyScroll.scrollTop;

  if (scrollDistance <= STORY_BOTTOM_THRESHOLD) {
    unlockIntroStory();
  }
}

function handleStoryInteraction() {
  if (state.activeStartPanel !== START_PANEL_STORY || state.introRead) {
    return;
  }

  state.storyInteracted = true;

  if (!storyNeedsScrolling()) {
    unlockIntroStory();
  }
}

function storyNeedsScrolling() {
  return elements.storyScroll.scrollHeight - elements.storyScroll.clientHeight > STORY_BOTTOM_THRESHOLD;
}

function unlockIntroStory() {
  if (!state.storyInteracted || state.introRead) {
    return;
  }

  state.introRead = true;
  setStoredValue(START_INTRO_READ_KEY, "true");
  renderStartScreen();
}

function handleDocumentKeyDown(event) {
  if (event.key === "Escape") {
    if (!elements.galleryArtModal.hidden) {
      closeGalleryArtModal();
      return;
    }

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
  const gameState = {
    status,
    frameId: null,
    lastTimestamp: 0,
    score: status === "won" ? RACCOON_TARGET_SCORE : 0,
    health: RACCOON_START_HEALTH,
    damageRecovery: null,
    raccoon: {
      x: 116,
      y: RACCOON_GAME_CONFIG.height / 2,
      velocityY: 0,
      radius: 28,
      rotation: 0,
    },
    grapeSpawnSlots: new Set(buildRaccoonGrapeSpawnSlots()),
    nextObstacleIndex: 0,
    obstacles: [],
    obstacleTimer: 0,
    goal: null,
  };

  gameState.obstacles = [createRaccoonObstacle(gameState, RACCOON_GAME_CONFIG.width + 120)];
  return gameState;
}

function resetRaccoonGame(status = "idle") {
  stopRaccoonAnimation();
  state.raccoonGame = createRaccoonGameState(status);
}

function createRaccoonObstacle(gameState, x = RACCOON_GAME_CONFIG.width + 96) {
  const minimumCenter = RACCOON_GAME_CONFIG.obstacleInset + RACCOON_GAME_CONFIG.gapSize / 2;
  const maximumCenter =
    RACCOON_GAME_CONFIG.height - RACCOON_GAME_CONFIG.obstacleInset - RACCOON_GAME_CONFIG.gapSize / 2;
  const gapCenter = minimumCenter + Math.random() * (maximumCenter - minimumCenter);
  const obstacleIndex = gameState.nextObstacleIndex + 1;
  gameState.nextObstacleIndex = obstacleIndex;

  return {
    id: ++raccoonObstacleIdCounter,
    x,
    gapCenter,
    passed: false,
    grape: createRaccoonGrape(gameState, gapCenter, obstacleIndex),
  };
}

function buildRaccoonGrapeSpawnSlots() {
  const grapeCount =
    RACCOON_MIN_GRAPES_PER_RUN +
    Math.floor(Math.random() * (RACCOON_MAX_GRAPES_PER_RUN - RACCOON_MIN_GRAPES_PER_RUN + 1));

  return shuffleArray(Array.from({ length: RACCOON_TARGET_SCORE }, (_, index) => index + 1)).slice(0, grapeCount);
}

function createRaccoonGrape(gameState, gapCenter, obstacleIndex) {
  if (!gameState.grapeSpawnSlots.has(obstacleIndex)) {
    return null;
  }

  const safeInset = 38;
  const maxOffset = Math.max(0, RACCOON_GAME_CONFIG.gapSize / 2 - safeInset);
  const yOffset = (Math.random() * 2 - 1) * maxOffset;

  return {
    y: gapCenter + yOffset,
    radius: 13,
    collected: false,
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
  updateRaccoonDamageRecovery();

  if (!state.raccoonGame.goal) {
    state.raccoonGame.obstacleTimer += deltaSeconds;
    if (state.raccoonGame.obstacleTimer >= RACCOON_GAME_CONFIG.spawnInterval) {
      state.raccoonGame.obstacleTimer -= RACCOON_GAME_CONFIG.spawnInterval;
      state.raccoonGame.obstacles.push(createRaccoonObstacle(state.raccoonGame));
    }
  }

  state.raccoonGame.obstacles.forEach((obstacle) => {
    obstacle.x -= RACCOON_GAME_CONFIG.horizontalSpeed * deltaSeconds;

    if (obstacle.grape && !obstacle.grape.collected && doesRaccoonCollectGrape(raccoon, obstacle)) {
      obstacle.grape.collected = true;
      state.raccoonGame.health = Math.min(RACCOON_MAX_HEALTH, state.raccoonGame.health + 1);
    }

    if (!obstacle.passed && obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth < raccoon.x - raccoon.radius) {
      obstacle.passed = true;
      if (!state.raccoonGame.goal) {
        state.raccoonGame.score += 1;

        if (state.raccoonGame.score >= RACCOON_TARGET_SCORE) {
          state.raccoonGame.goal = createRaccoonGoal(raccoon.y);
        }
      }
    }
  });

  state.raccoonGame.obstacles = state.raccoonGame.obstacles.filter(
    (obstacle) => obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth > -80
  );

  if (state.raccoonGame.goal) {
    state.raccoonGame.goal.x -= RACCOON_GAME_CONFIG.horizontalSpeed * deltaSeconds;

    if (doesRaccoonReachGoal(raccoon, state.raccoonGame.goal)) {
      completeRaccoonRun();
      return;
    }

    if (state.raccoonGame.goal.x + state.raccoonGame.goal.width < raccoon.x - raccoon.radius) {
      crashRaccoonRun();
      return;
    }
  }

  if (!state.raccoonGame.damageRecovery) {
    const collidingObstacle = state.raccoonGame.obstacles.find((obstacle) => doesRaccoonHitObstacle(raccoon, obstacle));
    if (collidingObstacle) {
      applyRaccoonDamage({ type: "obstacle", obstacleId: collidingObstacle.id });
      return;
    }

    if (raccoon.y - raccoon.radius <= 0 || raccoon.y + raccoon.radius >= RACCOON_GAME_CONFIG.height) {
      applyRaccoonDamage({ type: "boundary" });
    }
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

function doesRaccoonCollectGrape(raccoon, obstacle) {
  if (!obstacle.grape || obstacle.grape.collected) {
    return false;
  }

  const grapeX = obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth / 2;
  const grapeY = obstacle.grape.y;
  const deltaX = raccoon.x - grapeX;
  const deltaY = raccoon.y - grapeY;
  const pickupDistance = raccoon.radius + obstacle.grape.radius + 4;

  return deltaX * deltaX + deltaY * deltaY <= pickupDistance * pickupDistance;
}

function updateRaccoonDamageRecovery() {
  const recovery = state.raccoonGame.damageRecovery;
  if (!recovery) {
    return;
  }

  if (recovery.type === "obstacle") {
    const obstacle = state.raccoonGame.obstacles.find((entry) => entry.id === recovery.obstacleId);
    if (
      !obstacle ||
      obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth <
        state.raccoonGame.raccoon.x - state.raccoonGame.raccoon.radius - RACCOON_DAMAGE_EXIT_PADDING
    ) {
      state.raccoonGame.damageRecovery = null;
    }
    return;
  }

  if (
    state.raccoonGame.raccoon.y - state.raccoonGame.raccoon.radius > RACCOON_BOUNDARY_RECOVERY_INSET &&
    state.raccoonGame.raccoon.y + state.raccoonGame.raccoon.radius <
      RACCOON_GAME_CONFIG.height - RACCOON_BOUNDARY_RECOVERY_INSET
  ) {
    state.raccoonGame.damageRecovery = null;
  }
}

function applyRaccoonDamage(source) {
  const { raccoon } = state.raccoonGame;
  state.raccoonGame.health -= 1;

  if (source.type === "obstacle") {
    const obstacle = state.raccoonGame.obstacles.find((entry) => entry.id === source.obstacleId);
    if (obstacle) {
      raccoon.velocityY = raccoon.y < obstacle.gapCenter ? 220 : -220;
    }
  } else {
    if (raccoon.y - raccoon.radius <= 0) {
      raccoon.y = raccoon.radius + 2;
      raccoon.velocityY = Math.max(180, Math.abs(raccoon.velocityY) * 0.45);
    } else {
      raccoon.y = RACCOON_GAME_CONFIG.height - raccoon.radius - 2;
      raccoon.velocityY = -Math.max(220, Math.abs(raccoon.velocityY) * 0.5);
    }
  }

  if (state.raccoonGame.health <= 0) {
    crashRaccoonRun();
    return;
  }

  state.raccoonGame.damageRecovery = source;
}

function createRaccoonGoal(preferredY) {
  const targetPainting = getRaccoonTargetPainting();
  const width = 94;
  const height = 118;
  const minY = 72;
  const maxY = RACCOON_GAME_CONFIG.height - height - 72;
  const y = Math.max(minY, Math.min(maxY, preferredY - height / 2));

  return {
    rewardType: targetPainting ? "painting" : "grapes",
    paintingId: targetPainting?.id || null,
    x: RACCOON_GAME_CONFIG.width + 150,
    y,
    width,
    height,
  };
}

function doesRaccoonReachGoal(raccoon, goal) {
  const closestX = Math.max(goal.x, Math.min(raccoon.x, goal.x + goal.width));
  const closestY = Math.max(goal.y, Math.min(raccoon.y, goal.y + goal.height));
  const deltaX = raccoon.x - closestX;
  const deltaY = raccoon.y - closestY;

  return deltaX * deltaX + deltaY * deltaY <= raccoon.radius * raccoon.radius;
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
  state.raccoonCleared = state.unlockedPaintingIds.length > 0;
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
    drawRaccoonGrape(context, obstacle);
  });

  if (state.raccoonGame.goal) {
    drawRaccoonGoal(context, state.raccoonGame.goal);
  }

  drawFatRaccoon(context, state.raccoonGame.raccoon);
  drawRaccoonHealthOverlay(context);

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
  context.globalAlpha = state.raccoonGame.damageRecovery ? 0.72 : 1;

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

function drawRaccoonGrape(context, obstacle) {
  if (!obstacle.grape || obstacle.grape.collected) {
    return;
  }

  const x = obstacle.x + RACCOON_GAME_CONFIG.obstacleWidth / 2;
  const y = obstacle.grape.y;

  drawRaccoonGrapeCluster(context, x, y, 1);
}

function drawRaccoonGrapeCluster(context, x, y, scale = 1) {
  context.save();
  context.shadowColor = "rgba(70, 26, 108, 0.28)";
  context.shadowBlur = 16 * scale;
  [
    { x: -9, y: -4, r: 6.2 },
    { x: 0, y: -7, r: 6.8 },
    { x: 9, y: -4, r: 6.2 },
    { x: -5, y: 6, r: 6.5 },
    { x: 5, y: 6, r: 6.5 },
  ].forEach((grape) => {
    const gradient = context.createRadialGradient(
      x + (grape.x - 2) * scale,
      y + (grape.y - 2) * scale,
      1,
      x + grape.x * scale,
      y + grape.y * scale,
      grape.r * scale
    );
    gradient.addColorStop(0, "#b885ee");
    gradient.addColorStop(0.7, "#7b4bb9");
    gradient.addColorStop(1, "#55258b");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x + grape.x * scale, y + grape.y * scale, grape.r * scale, 0, Math.PI * 2);
    context.fill();
  });
  context.shadowBlur = 0;

  context.strokeStyle = "#4f8e63";
  context.lineWidth = 2.2 * scale;
  context.beginPath();
  context.moveTo(x, y - 10 * scale);
  context.lineTo(x + 4 * scale, y - 18 * scale);
  context.stroke();

  context.fillStyle = "#6db071";
  context.beginPath();
  context.ellipse(x + 10 * scale, y - 16 * scale, 7 * scale, 4 * scale, -0.45, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawRaccoonGoal(context, goal) {
  context.save();
  context.shadowColor = "rgba(255, 224, 173, 0.42)";
  context.shadowBlur = 24;
  context.fillStyle = "#6a452f";
  drawRoundedRect(context, goal.x, goal.y, goal.width, goal.height, 20);
  context.fill();
  context.shadowBlur = 0;

  context.fillStyle = "#a87549";
  drawRoundedRect(context, goal.x + 5, goal.y + 5, goal.width - 10, goal.height - 10, 16);
  context.fill();

  const imageInset = 12;
  const imageX = goal.x + imageInset;
  const imageY = goal.y + imageInset;
  const imageWidth = goal.width - imageInset * 2;
  const imageHeight = goal.height - imageInset * 2;

  context.save();
  drawRoundedRect(context, imageX, imageY, imageWidth, imageHeight, 12);
  context.clip();

  const goalImage = goal.paintingId ? RACCOON_GOAL_IMAGES.get(goal.paintingId) : null;
  if (goalImage && goalImage.complete && goalImage.naturalWidth > 0) {
    context.drawImage(goalImage, imageX, imageY, imageWidth, imageHeight);
  } else if (goal.rewardType === "grapes") {
    context.fillStyle = "rgba(16, 25, 23, 0.92)";
    context.fillRect(imageX, imageY, imageWidth, imageHeight);
    drawRaccoonGrapeCluster(context, imageX + imageWidth / 2 - 2, imageY + imageHeight / 2 + 6, 2.3);
  } else {
    context.fillStyle = "rgba(16, 25, 23, 0.92)";
    context.fillRect(imageX, imageY, imageWidth, imageHeight);
    context.fillStyle = "rgba(255, 245, 232, 0.76)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = '700 14px "Space Grotesk", sans-serif';
    context.fillText("Goal", imageX + imageWidth / 2, imageY + imageHeight / 2);
  }
  context.restore();
  context.restore();
}

function drawRaccoonHealthOverlay(context) {
  const heartSize = 22;
  const heartGap = 9;
  const heartsWidth = RACCOON_MAX_HEALTH * heartSize + (RACCOON_MAX_HEALTH - 1) * heartGap;
  const startX = context.canvas.width - heartsWidth - 80;
  const y = 38;

  context.save();
  for (let index = 0; index < RACCOON_MAX_HEALTH; index += 1) {
    drawRaccoonHeart(context, startX + index * (heartSize + heartGap), y, heartSize, index < state.raccoonGame.health);
  }
  context.restore();
}

function drawRaccoonHeart(context, x, y, size, filled) {
  const radius = size * 0.28;
  const bottomY = y + size * 0.72;

  context.save();
  context.beginPath();
  context.moveTo(x, y + size * 0.28);
  context.bezierCurveTo(x, y, x + size * 0.08, y - radius, x + size * 0.26, y - radius);
  context.bezierCurveTo(x + size * 0.44, y - radius, x + size * 0.5, y + size * 0.06, x + size * 0.5, y + size * 0.18);
  context.bezierCurveTo(x + size * 0.5, y + size * 0.06, x + size * 0.56, y - radius, x + size * 0.74, y - radius);
  context.bezierCurveTo(x + size * 0.92, y - radius, x + size, y, x + size, y + size * 0.28);
  context.lineTo(x + size * 0.5, bottomY);
  context.closePath();

  context.fillStyle = filled ? "#ff8aa5" : "rgba(255, 248, 239, 0.18)";
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = filled ? "rgba(255, 241, 245, 0.95)" : "rgba(255, 248, 239, 0.42)";
  context.stroke();
  context.restore();
}

function drawRaccoonOverlayMessage(context, width, height) {
  let title = "Ready";
  let subtitle = "Tap or press space to launch.";
  let cardWidth = 248;
  let cardHeight = 78;

  if (state.raccoonGame.status === "crashed") {
    title = "Bonk";
    subtitle = "Tap to retry the run.";
  } else if (state.raccoonGame.status === "won") {
    if (state.latestPaintingRewardId) {
      title = "UNLOCKED";
      subtitle = "Check this out in Scippie's Gallery!";
      cardWidth = 308;
      cardHeight = 82;
    } else {
      title = "GRAPES";
      subtitle = "Scippie snagged a grape prize.";
      cardWidth = 278;
      cardHeight = 82;
    }
  }

  drawRoundedRect(context, width / 2 - cardWidth / 2, 42, cardWidth, cardHeight, 22);
  context.fillStyle = "rgba(8, 20, 18, 0.78)";
  context.fill();

  context.fillStyle = "#fff8ef";
  context.textAlign = "center";
  context.font = '700 28px "Space Grotesk", sans-serif';
  context.fillText(title, width / 2, 76);
  context.font = state.raccoonGame.status === "won"
    ? '500 15px "Space Grotesk", sans-serif'
    : '500 16px "Space Grotesk", sans-serif';
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
