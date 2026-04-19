const boardSize = 4;
const expectedTileCount = boardSize * boardSize;

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
    answers: ["diego velazquez", "diego velázquez", "velazquez", "velázquez", "velasquez"],
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
};

const elements = {
  board: document.querySelector("#bingo-board"),
  scorePill: document.querySelector("#score-pill"),
  scoreValue: document.querySelector("#score-value"),
  modal: document.querySelector("#question-modal"),
  modalImage: document.querySelector("#modal-image"),
  modalPrompt: document.querySelector("#modal-prompt"),
  answerForm: document.querySelector("#answer-form"),
  answerInput: document.querySelector("#answer-input"),
  answerFeedback: document.querySelector("#answer-feedback"),
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
  elements.resetButton.addEventListener("click", resetGame);
  elements.closeModalButton.addEventListener("click", closeModal);
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

  const tileId = tileButton.dataset.tileId;
  const tile = state.tiles.find((item) => item.id === tileId);
  if (!tile || tile.solved) {
    return;
  }

  openModal(tile);
}

function openModal(tile) {
  state.activeTileId = tile.id;
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
  elements.answerInput.placeholder = "Answer";
  setFeedback("", "");
  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.requestAnimationFrame(() => {
    elements.answerInput.focus();
  });
}

function closeModal() {
  state.activeTileId = null;
  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  elements.answerInput.value = "";
  setFeedback("", "");
}

function handleAnswerSubmit(event) {
  event.preventDefault();

  const tile = state.tiles.find((item) => item.id === state.activeTileId);
  if (!tile) {
    return;
  }

  const submittedAnswer = elements.answerInput.value;
  const normalizedAnswer = normalizeText(submittedAnswer);

  if (!normalizedAnswer && !tile.blankPoints) {
    setFeedback("Type an answer first.", "is-error");
    return;
  }

  if (!normalizedAnswer && tile.blankPoints) {
    solveTile(tile, tile.blankPoints);
    return;
  }

  const isCorrect = tile.answers.some((answer) => normalizeText(answer) === normalizedAnswer);

  if (!isCorrect) {
    const feedbackMessage = tile.blankPoints
      ? "Not quite. Try again, or leave it blank for 1 point."
      : "Not quite. Try again.";
    setFeedback(feedbackMessage, "is-error");
    return;
  }

  solveTile(tile, tile.correctPoints || 1);
}

function solveTile(tile, basePoints) {
  tile.solved = true;
  state.score += basePoints;

  const newlyCompletedLines = collectNewlyCompletedLines(tile.index);
  if (newlyCompletedLines.length > 0) {
    state.score += newlyCompletedLines.length * 3;
  }

  renderBoard();
  renderScore();
  pulseScore();
  closeModal();
}

function setFeedback(message, typeClass) {
  elements.answerFeedback.textContent = message;
  elements.answerFeedback.className = "answer-feedback";
  if (typeClass) {
    elements.answerFeedback.classList.add(typeClass);
  }
}

function resetGame() {
  state.tiles = createTiles();
  state.score = 0;
  state.completedLines = new Set();
  state.activeTileId = null;
  render();
  closeModal();
}

function pulseScore() {
  elements.scorePill.classList.remove("is-bumping");
  void elements.scorePill.offsetWidth;
  elements.scorePill.classList.add("is-bumping");
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
