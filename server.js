const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));  // static render of public dir
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS to enable local debugging

const colors = ['Grey', 'Orange', 'Green'];
let possiblePatterns = []
let allWords = []
let allRemainingWords = []
let gameMode = 5    // word size for current game

// cached optimal words for first guess stored for performance gains.
// this can be done as optimal first guess always remains the same for a given word list.
const optimalWords = {
    optimal3Word: {
        word: "sat",
        expectedInformation: 2.8938931688673115
    },
    optimal4Word: {
        word: "sale",
        expectedInformation: 4.5564789923977
    },
    optimal5Word: {
        word: "tears",
        expectedInformation: 6.131458532814413
    },
    optimal6Word: {
        word: "sorted",
        expectedInformation: 7.225450466348137
    },
    optimal7Word: {
        word: "parties",
        expectedInformation: 8.39806412514156
    }
};

// Function to generate a random word of a specified length
function generateRandomWord(wordLength) {
    let filepath = `data/${wordLength}_letter_words.txt`
    allWords = fs.readFileSync(filepath, 'utf8').split('\n');
    allRemainingWords = [...allWords]  // copy
    const randomIndex = Math.floor(Math.random() * allWords.length);
    return allWords[randomIndex];
}

// Endpoint to generate a random word of a specified length
app.get('/random-word', (req, res) => {
    const wordLength = req.query.wordLength; // Get the value of the 'wordLength' query parameter
    if (!wordLength || isNaN(wordLength)) {
        res.status(400).send('Invalid word length');
    } else {
        gameMode = parseInt(wordLength)
        possiblePatterns = permutationsWithRepetition(colors, gameMode);
        const randomWord = generateRandomWord(gameMode);
        res.send(randomWord); // Send the random word as the response
    }
});




// Endpoint to check if a word exists in a text file
app.get('/check-word', (req, res) => {
    let wordToCheck = req.query.word;
    wordToCheck = wordToCheck.toLowerCase()

    if (allWords.includes(wordToCheck.toLowerCase())){
        res.send({ exists: true })
    } else {
        res.send({ exists: false })
    }
});

app.post('/send-guess', (req, res) => {
    const { guess, colors } = req.body;

    reduceWordList(guess, colors)
});

function reduceWordList(guess, colors) {
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i].toLowerCase();  // guess is recieved in uppercase
        const color = colors[i];
        
        if (color === "#5cb85c") { // Green color
            allRemainingWords = allRemainingWords.filter(word => word[i] === letter);
        } else if (color === "#f0ad4e") { // Orange color
            allRemainingWords = allRemainingWords.filter(word => word.includes(letter) && word[i] !== letter);
        } else if (color === "#d9534f") { // Red color
            allRemainingWords = allRemainingWords.filter(word => !word.includes(letter));
        }
    }

    // for debugging. View all possible words left in console
    console.log(`Number of possible words left: ${allRemainingWords.length}`);
    console.log(allRemainingWords);
}

// Endpoint to check if a word exists in a text file
app.get('/get-optimal-word', (req, res) => {
    let optimal = {}
    // if it is first guess, used cached words, as these will always be the same
    if (allRemainingWords.length === allWords.length) {
        optimal = getCachedOptimal() 
    } else {
        optimal = calculateMaxEntropyWord()
    }
    res.send({ optimalWord: optimal.word , expectedInformation: optimal.expectedInformation })
});

function getCachedOptimal() {
    let optimal = {}
    switch (gameMode) {
        case 3:
            optimal = optimalWords.optimal3Word
            break;
        case 4:
            optimal = optimalWords.optimal4Word
            break;
        case 5:
            optimal = optimalWords.optimal5Word
            break;
        case 6:
            optimal = optimalWords.optimal6Word
            break;
        case 7:
            optimal = optimalWords.optimal7Word
            break;
        default:
            break;
    }
    return optimal
}

function calculateMaxEntropyWord() {
    let maxEntropy = 0
    let maxEntropyWord = ""
    allRemainingWords.forEach((word,i) => {
        let entropy = calculateExpectedInformation(word)
        if (entropy>=maxEntropy) {
            maxEntropyWord = word
            maxEntropy = entropy
        }
        // for debugging, and seeing progress
        if (i % 100 === 0) {
            console.log(i);
        }
    });

    console.log(maxEntropy);
    console.log(maxEntropyWord);
    return {word: maxEntropyWord, expectedInformation: maxEntropy}
}

/*
    Information formula is: 
    Math.log2(1/probability).

    To find the expected information, we sum over all probabilities 
    multiplied by their Information value.
*/
function calculateExpectedInformation(word) {
    let patternProbabilitiesForWord = [];
    for (let possiblePattern of possiblePatterns) {
        let patternProb = calculateProbOfPattern(possiblePattern, word);
        patternProbabilitiesForWord.push(patternProb);
    }

    let expectedInfo = -patternProbabilitiesForWord.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
    return expectedInfo;
}

function checkPatternMatches(pattern, word, possibleWord) {
    for (let i = 0; i < word.length; i++) {
        if (!checkLetterMatches(pattern, word, possibleWord, i)) {
            return false;
        }
    }
    return true;
}


function checkLetterMatches(pattern, word, possibleWord, i) {
    return (
        (pattern[i] === 'Grey' && !possibleWord.includes(word[i])) ||
        (pattern[i] === 'Orange' && (possibleWord.includes(word[i]) && word[i] !== possibleWord[i])) ||
        (pattern[i] === 'Green' && word[i] === possibleWord[i])
    );
}

function calculateProbOfPattern(pattern, word) {
    let wordsMatched = 0;
    let patternProbability = 0;

    for (let possibleWord of allRemainingWords) {
        if (checkPatternMatches(pattern, word, possibleWord)) {
            wordsMatched++;
        }
    }

    patternProbability = wordsMatched / allRemainingWords.length;
    return patternProbability;
}

// helper function to get all possible patterns
function permutationsWithRepetition(arr, length) {
    const result = [];

    function permute(current, depth) {
        if (depth === length) {
            result.push(current.slice());
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            current.push(arr[i]);
            permute(current, depth + 1);
            current.pop();
        }
    }

    permute([], 0);
    return result;
}


// Export the app object as the default export
module.exports = app;

// Export the permutationsWithRepetition function as a named export
module.exports.permutationsWithRepetition = permutationsWithRepetition;
