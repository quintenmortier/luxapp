const boardSize = 4;
const expectedTileCount = boardSize * boardSize;
const BIOMETRIC_CREDENTIAL_KEY = "lux-bingo.biometric-credential-id";
const BIOMETRIC_USER_ID_KEY = "lux-bingo.biometric-user-id";

// Replace the label, question, and answers values below with your own box content.
const tileDefinitions = [
  {
    id: "tile-1",
    label: "Art",
    question: "Which work of art?",
    imageSrc: "images/venus.jpg",
    imageAlt: "A classical marble statue photographed up close.",
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
    answers: ["diego velazquez", "velazquez", "velasquez"],
    blankPoints: 1,
    correctPoints: 2,
  },
  {
    id: "tile-4",
    label: "Ocean",
    question: "Which mammal is known for living in the ocean and using a blowhole?",
    answers: ["whale", "a whale"],
  },
  {
    id: "tile-5",
    label: "Winter",
    question: "What is frozen water falling from the sky called?",
    answers: ["snow"],
  },
  {
    id: "tile-6",
    label: "Fruit",
    question: "Which curved fruit is usually yellow when ripe?",
    answers: ["banana", "a banana"],
  },
  {
    id: "tile-7",
    label: "Orbit",
    question: "What star does Earth orbit?",
    answers: ["sun", "the sun"],
  },
  {
    id: "tile-8",
    label: "Shape",
    question: "Which shape has three sides?",
    answers: ["triangle", "a triangle"],
  },
  {
    id: "tile-9",
    label: "Office",
    question: "Which device do you usually type on: keyboard or speaker?",
    answers: ["keyboard", "a keyboard"],
  },
  {
    id: "tile-10",
    label: "Tree",
    question: "What part of a tree usually stays underground?",
    answers: ["roots", "root", "the roots"],
  },
  {
    id: "tile-11",
    label: "Storm",
    question: "What do clouds often bring when they get dark and heavy?",
    answers: ["rain"],
  },
  {
    id: "tile-12",
    label: "Multiply",
    question: "What is 4 times 2?",
    answers: ["8", "eight"],
  },
  {
    id: "tile-13",
    label: "Latin",
    question: "Latin",
    imageSrc: "images/latin.png",
    imageAlt: "A themed image for the Latin prompt.",
    inputMode: "verify-only",
    tileImageFit: "contain",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-14",
    label: "Mandarin",
    question: "Mandarin",
    imageSrc: "images/mandarin.png",
    imageAlt: "A themed image for the Mandarin prompt.",
    inputMode: "verify-only",
    tileImageFit: "contain",
    tileImagePosition: "center center",
    correctPoints: 1,
  },
  {
    id: "tile-15",
    label: "LUX",
    question: "Select three songs from LUX that have already been played.",
    imageSrc: "images/lux.jpg",
    imageAlt: "The album cover for LUX.",
    inputMode: "multi-select",
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
    correctPoints: 2,
  },
  {
    id: "tile-16",
    label: "MOTOMAMI",
    question: "Select three songs from MOTOMAMI that have already been played.",
    imageSrc: "images/motomami.jpg",
    imageAlt: "The album cover for MOTOMAMI.",
    inputMode: "multi-select",
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
    correctPoints: 2,
  },
];

const lineDefinitions = buildLineDefinitions(boardSize);

const state = {
  tiles: createTiles(),
  score: 0,
  completedLines: new Set(),
  activeTileId: null,
  selectedOptions: [],
  pointsBurstTimer: null,
  isSubmitting: false,
};

const elements = {
  board: document.querySelector("#bingo-board"),
  scorePill: document.querySelector("#score-pill"),
  scoreValue: document.querySelector("#score-value"),
  pointsBurst: document.querySelector("#points-burst"),
  modal: document.querySelector("#question-modal"),
  modalImage: document.querySelector("#modal-image"),
  modalPrompt: document.querySelector("#modal-prompt"),
  optionGrid: document.querySelector("#option-grid"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  selectionSummary: document.querySelector("#selection-summary"),
  answerFeedback: document.querySelector("#answer-feedback"),
  submitButton: document.querySelector("#answer-form .submit-button"),
  closeModalButton: document.querySelector("#close-modal-button"),
  resetButton: document.querySelector("#reset-button"),
};

render();
bindEvents();

function createTiles() {
  const tiles = tileDefinitions.slice(0, expectedTileCount).map((tile, index) => ({
    ...tile,
    index,
    solved: false,
  }));

  if (tiles.length !== expectedTileCount) {
    console.warn(`Expected ${expectedTileCount} tiles for a ${boardSize}x${boardSize} board.`);
  }

  return tiles;
}

function bindEvents() {
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function render() {
  renderBoard();
  renderScore();
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

  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (getTileInputMode(tile) === "text") {
    window.requestAnimationFrame(() => {
      elements.answerInput.focus();
    });
  }
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
    await handleMultiSelectSubmit(tile);
    return;
  }

  if (getTileInputMode(tile) === "verify-only") {
    await handleVerifyOnlySubmit(tile);
    return;
  }

  const attempt = evaluateTextAttempt(tile, elements.answerInput.value);
  if (!attempt) {
    return;
  }

  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performBiometricVerification();
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
    await performBiometricVerification();

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

async function handleVerifyOnlySubmit(tile) {
  setSubmitBusy(true);
  setFeedback("", "");

  try {
    await performBiometricVerification();
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
  elements.answerInput.hidden = isMultiSelect || isVerifyOnly;
  elements.answerInput.disabled = isVerifyOnly;
  elements.selectionSummary.hidden = !isMultiSelect;
  elements.answerInput.style.display = isMultiSelect || isVerifyOnly ? "none" : "";
  elements.selectionSummary.style.display = isMultiSelect ? "grid" : "none";

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
  const totalPoints = basePoints + newlyCompletedLines.length * 3;

  state.score += totalPoints;

  renderBoard();
  renderScore();
  pulseScore();

  return totalPoints;
}

function resetGame() {
  state.tiles = createTiles();
  state.score = 0;
  state.completedLines = new Set();
  state.activeTileId = null;
  state.selectedOptions = [];
  render();
  closeModal(true);
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

function collectNewlyCompletedLines(tileIndex) {
  const relevantLines = lineDefinitions.filter((line) => line.indices.includes(tileIndex));
  const completedNow = [];

  relevantLines.forEach((line) => {
    const isSolved = line.indices.every((index) => state.tiles[index]?.solved);
    if (isSolved && !state.completedLines.has(line.id)) {
      state.completedLines.add(line.id);
      completedNow.push(line.id);
    }
  });

  return completedNow;
}

function buildLineDefinitions(size) {
  const lines = [];

  for (let row = 0; row < size; row += 1) {
    const indices = [];
    for (let column = 0; column < size; column += 1) {
      indices.push(row * size + column);
    }
    lines.push({
      id: `row-${row}`,
      indices,
    });
  }

  for (let column = 0; column < size; column += 1) {
    const indices = [];
    for (let row = 0; row < size; row += 1) {
      indices.push(row * size + column);
    }
    lines.push({
      id: `column-${column}`,
      indices,
    });
  }

  const diagonalOne = [];
  const diagonalTwo = [];

  for (let index = 0; index < size; index += 1) {
    diagonalOne.push(index * size + index);
    diagonalTwo.push(index * size + (size - 1 - index));
  }

  lines.push({
    id: "diagonal-main",
    indices: diagonalOne,
  });
  lines.push({
    id: "diagonal-anti",
    indices: diagonalTwo,
  });

  return lines;
}

function getActiveTile() {
  return state.tiles.find((tile) => tile.id === state.activeTileId) || null;
}

function getTileInputMode(tile) {
  return tile.inputMode || "text";
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
    rp: { name: "Lux Bingo" },
    user: {
      id: getOrCreateBiometricUserId(),
      name: "lux-bingo-player",
      displayName: "Lux Bingo Player",
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

  return "Verification failed. Try again.";
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
