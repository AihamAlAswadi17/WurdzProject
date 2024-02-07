let GAME_MODE = 5  // play game with x letter words
let TARGET_WORD = "apple";
let ROWS = []
let GUESSES = []

function startNewGame(columns = 5, rows = 6) {
    GAME_MODE = columns
    TARGET_WORD = generateRandomWord(GAME_MODE)
    ROWS = []
    GUESSES = []
    populateGrid(columns, rows)

    const inputField = document.getElementById("guess");
    inputField.disabled = false;
    inputField.value = ""
    inputField.maxLength = GAME_MODE;
    inputField.addEventListener("keydown", handleEnterKeyPress);
    inputField.focus();
}

function populateGrid(columns = 5, rows = 6) {
    let grid =  document.getElementById("grid-container")
    clearGrid(grid)
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("div")
        row.classList.add("guess-row")
        grid.append(row)
        ROWS.push(row)
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement("div");
            cell.classList.add("guess-cell")
            row.append(cell)
        }
    }
}

function clearGrid(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}

function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        submitGuess();
        document.getElementById("guess").focus();
    }
}

function showToast(message) {
    Toastify({
        text: message,
        duration: 5000, // Duration in milliseconds
        gravity: "top", // toast position
        position: 'right', // toast position
      }).showToast();
}

function submitGuess() {
    const guessInput = document.getElementById("guess");
    const guess = guessInput.value.trim().toUpperCase();

    if (!isAcceptableGuess(guess)) {
        return;
    }
    GUESSES.push(guess)

    let currentRow = ROWS[GUESSES.length - 1]
    const cells = currentRow.childNodes;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.innerText = guess[i];
        cell.style.backgroundColor = getCellColor(guess[i], i);
    }

    
    if (guess === TARGET_WORD.toUpperCase()) {
        showToast(`Congratulations! You guessed the word.`)
        guessInput.disabled = true;
    } else if (GUESSES.length === 6) {
        showToast(`You've used all your guesses. The word was: ${TARGET_WORD}`)
        guessInput.disabled = true;
    }
    
    guessInput.value = "";
    document.getElementById("guess").focus();

}

function isAcceptableGuess(guess) {
    if (guess.length !== GAME_MODE && !/^[A-Z]+$/.test(guess)) {
        showToast(`Please enter a ${GAME_MODE}-letter word containing only alphabets.`);
        return false
    } else if (guess.length !== GAME_MODE) {
        showToast(`Please enter a ${GAME_MODE}-letter word.`);
        return false
    } else if (!/^[A-Z]+$/.test(guess)) {
        showToast(`Please enter a word containing only alphabets.`);
        return false
    } else if (GUESSES.includes(guess)) {
        showToast(`Please enter a word which was not previously guessed.`);
        return false
    } else if (!isRealWord(guess)) {
        showToast(`Please enter a real word.`);
        return false
    } else {
        return true
    }
}

// TODO
function isRealWord(guess) {
    return true
}

function getCellColor(letter, position) {
    if (letter === TARGET_WORD[position].toUpperCase()) {
        return "#5cb85c"; // Dark green
    } else if (TARGET_WORD.toUpperCase().includes(letter)) {
        return "#f0ad4e"; // Dark yellow
    } else {
        return "#d9534f"; // Light red
    }
}

// TODO
function generateRandomWord(wordLength) {
    switch(wordLength) {
        case 3:
            return "cat"
        case 4:
            return "bear"
        case 5:
            return "apple"
        case 6:
            return "jacket"
        case 7:
            return "penguin"
    }
}

// TODO
function revealOptimalWord() {
    let optimalWord = "Apple"
    let expectedInformation = 3.14

    showToast(`Optimal word: ${optimalWord} \nExpected Information: ${expectedInformation}`)
    document.getElementById("guess").focus();
}

startNewGame()