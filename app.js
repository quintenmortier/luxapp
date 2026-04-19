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
    label: "Music",
    question: "What do you call a pattern of beats in music?",
    answers: ["rhythm", "beat"],
  },
  {
    id: "tile-14",
    label: "Sport",
    question: "Which sport is often played with goals, a ball, and feet?",
    answers: ["football", "soccer"],
  },
  {
    id: "tile-15",
    label: "Opposite",
    question: "What is the opposite of cold?",
    answers: ["hot", "warm"],
  },
  {
    id: "tile-16",
    label: "Travel",
    question: "What vehicle flies in the sky and carries passengers?",
    answers: ["plane", "airplane", "a plane", "an airplane"],
  },
];

const lineDefinitions = buildLineDefinitions(boardSize);

const state = {
  tiles: createTiles(),
  score: 0,
  completedLines: new Set(),
  activeTileId: null,
  modalMode: "answer",
  pendingAttempt: null,
  pointsBurstTimer: null,
};

const elements = {
  board: document.querySelector("#bingo-board"),
  scorePill: document.querySelector("#score-pill"),
  scoreValue: document.querySelector("#score-value"),
  pointsBurst: document.querySelector("#points-burst"),
  modal: document.querySelector("#question-modal"),
  modalImage: document.querySelector("#modal-image"),
  modalPrompt: document.querySelector("#modal-prompt"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  answerFeedback: document.querySelector("#answer-feedback"),
  verifyPanel: document.querySelector("#verify-panel"),
  verifyAnswer: document.querySelector("#verify-answer"),
  verifyFeedback: document.querySelector("#verify-feedback"),
  editAnswerButton: document.querySelector("#edit-answer-button"),
  verifyAnswerButton: document.querySelector("#verify-answer-button"),
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
  elements.answerForm.addEventListener("submit", handleAnswerSubmit);
  elements.editAnswerButton.addEventListener("click", returnToEditMode);
  elements.verifyAnswerButton.addEventListener("click", handleVerifyAttempt);
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
      const tileContent = tile.imageSrc
        ? `<img class="tile-image" src="${tile.imageSrc}" alt="${tile.imageAlt}" loading="lazy" decoding="async" />`
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

function openModal(tile) {
  state.activeTileId = tile.id;
  state.pendingAttempt = null;

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
  elements.answerInput.placeholder = tile.blankPoints ? "Answer or leave blank" : "Answer";
  elements.verifyAnswer.textContent = "";
  setFeedback("", "");
  setVerifyFeedback("", "");
  setVerifyBusy(false);
  setModalMode("answer");

  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  window.requestAnimationFrame(() => {
    elements.answerInput.focus();
  });
}

function closeModal(force = false) {
  if (!force && elements.verifyAnswerButton.disabled) {
    return;
  }

  state.activeTileId = null;
  state.pendingAttempt = null;
  state.modalMode = "answer";

  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  elements.answerInput.value = "";
  elements.verifyAnswer.textContent = "";
  setFeedback("", "");
  setVerifyFeedback("", "");
  setVerifyBusy(false);
  setModalMode("answer");
}

function handleAnswerSubmit(event) {
  event.preventDefault();

  const tile = getActiveTile();
  if (!tile) {
    return;
  }

  const attempt = evaluateAttempt(tile, elements.answerInput.value);
  if (!attempt) {
    return;
  }

  state.pendingAttempt = attempt;
  elements.verifyAnswer.textContent = attempt.answerDisplay;
  setVerifyFeedback("", "");
  setModalMode("confirm");
}

function evaluateAttempt(tile, rawAnswer) {
  const normalizedAnswer = normalizeText(rawAnswer);

  if (!normalizedAnswer && !tile.blankPoints) {
    setFeedback("Type an answer first.", "is-error");
    return null;
  }

  if (!normalizedAnswer && tile.blankPoints) {
    return {
      tileId: tile.id,
      rawAnswer,
      answerDisplay: "Blank",
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
    tileId: tile.id,
    rawAnswer,
    answerDisplay: rawAnswer.trim(),
    basePoints: tile.correctPoints || 1,
  };
}

function returnToEditMode() {
  if (!state.pendingAttempt) {
    return;
  }

  setVerifyFeedback("", "");
  setModalMode("answer");
  elements.answerInput.value = state.pendingAttempt.rawAnswer;

  window.requestAnimationFrame(() => {
    elements.answerInput.focus();
  });
}

async function handleVerifyAttempt() {
  const tile = getActiveTile();
  if (!tile || !state.pendingAttempt) {
    return;
  }

  setVerifyBusy(true);
  setVerifyFeedback("", "");

  try {
    await performBiometricVerification();
    const totalPoints = solveTile(tile, state.pendingAttempt.basePoints);
    closeModal(true);
    showPointsBurst(totalPoints);
  } catch (error) {
    setVerifyFeedback(getVerificationErrorMessage(error), "is-error");
  } finally {
    setVerifyBusy(false);
  }
}

function setModalMode(mode) {
  state.modalMode = mode;
  const isConfirming = mode === "confirm";
  elements.answerForm.hidden = isConfirming;
  elements.verifyPanel.hidden = !isConfirming;
}

function setFeedback(message, typeClass) {
  elements.answerFeedback.textContent = message;
  elements.answerFeedback.className = "answer-feedback";
  if (typeClass) {
    elements.answerFeedback.classList.add(typeClass);
  }
}

function setVerifyFeedback(message, typeClass) {
  elements.verifyFeedback.textContent = message;
  elements.verifyFeedback.className = "answer-feedback verify-feedback";
  if (typeClass) {
    elements.verifyFeedback.classList.add(typeClass);
  }
}

function setVerifyBusy(isBusy) {
  elements.verifyAnswerButton.disabled = isBusy;
  elements.editAnswerButton.disabled = isBusy;
  elements.closeModalButton.disabled = isBusy;
  elements.verifyAnswerButton.textContent = isBusy ? "..." : "Verify";
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
  state.pendingAttempt = null;
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
