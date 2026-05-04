let step = 0;

function nextStep() {
    let title = document.getElementById("popupTitle");
    let text = document.getElementById("popupText");
    let button = document.querySelector("#popup button");

    step++;

    if (step === 1) {
        title.innerText = "How To Play";
        text.innerText = "Flip Two Cards And Try Finding Matching Pairs";
    }
    else if (step === 2) {
        title.innerText = "Game Rules";
        text.innerText = "If cards match they stay open, otherwise they flip back.";
    }
    else if (step === 3) {
        title.innerText = "Levels";
        text.innerText = "Game has multiple levels with increasing difficulty.";
        button.innerText = "Start Game";
    }
    else {
        document.getElementById("popup").style.display = "none";
    }
}

let currentLevel = "";

function setLevel(level) {
    currentLevel = level;
    document.getElementById("level").innerText = level;
    document.getElementById("popupText").innerText = "Level " + level + " Selected";
    document.getElementById("popupTitle").innerText = "Level Selected";
    document.getElementById("popup").style.display = "flex";
}

let cardValues = ["🍎","🍌","🍇","🍉","🍒","🥝","🍍","🥥"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;

let timeTaken = 0;
let timer = null;
let flipTimeout = null;
let gameActive = false;

function playSound(type) {
    let sound = new Audio();

    if (type === "match") {
        sound.src = "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
    }
    else if (type === "wrong") {
        sound.src = "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg";
    }
    else if (type === "win") {
        sound.src = "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg";
    }

    sound.play();
}

function startTimer() {
    clearInterval(timer);
    timeTaken = 0;
    document.getElementById("time").innerText = timeTaken;

    timer = setInterval(function () {
        timeTaken++;
        document.getElementById("time").innerText = timeTaken;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function calculateRating() {
    let moves = Number(document.getElementById("moves").innerText);

    if (moves <= 10) return "⭐⭐⭐";
    else if (moves <= 14) return "⭐⭐";
    else return "⭐";
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function startGame() {
    if (currentLevel === "") {
        document.getElementById("level").innerText = "Please Select A Level";
        return;
    }

    if (flipTimeout) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
    }

    gameActive = true;

    let pairCount = 4;
    if (currentLevel === "Medium") pairCount = 6;
    if (currentLevel === "Hard") pairCount = 8;

    let selectedCards = cardValues.slice(0, pairCount);
    let gameCards = selectedCards.concat(selectedCards);

    shuffle(gameCards);

    let board = document.getElementById("gameBoard");
    board.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedCount = 0;

    document.getElementById("moves").innerText = "0";
    document.getElementById("time").innerText = "0";
    document.getElementById("gameStatus").innerText =
        " Find all matching pairs!";

    document.getElementById("rating").innerText = "Rating: ⭐⭐⭐";

    startTimer();

    for (let i = 0; i < gameCards.length; i++) {
        let card = document.createElement("div");

        card.className = "card";
        card.innerText = "?";
        card.dataset.value = gameCards[i];

        card.onclick = function () {
            flipCard(card);
        };

        board.appendChild(card);
    }
}

function flipCard(card) {
    if (!gameActive) return;
    if (lockBoard) return;
    if (card.classList.contains("flipped")) return;

    card.innerText = card.dataset.value;
    card.classList.add("flipped");
    card.classList.add("flip-anim");

    if (firstCard === null) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    document.getElementById("moves").innerText =
        Number(document.getElementById("moves").innerText) + 1;

    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        playSound("match");

        matchedCount += 2;

        document.getElementById("gameStatus").innerText =
            "Nice! Cards matched";

        checkWin();
        resetSelection();
    }
    else {
        playSound("wrong");

        document.getElementById("gameStatus").innerText =
            "Not a match, try again";

        firstCard.classList.add("wrong");
        secondCard.classList.add("wrong");

        flipTimeout = setTimeout(function () {
            firstCard.classList.remove("wrong");
            secondCard.classList.remove("wrong");

            firstCard.innerText = "?";
            secondCard.innerText = "?";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.classList.remove("flip-anim");
            secondCard.classList.remove("flip-anim");

            resetSelection();

            flipTimeout = null;
        }, 800);
    }
}

function resetSelection() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function checkWin() {
    let totalCards = document.querySelectorAll(".card").length;

    if (matchedCount === totalCards) {
        gameActive = false;

        if (flipTimeout) {
            clearTimeout(flipTimeout);
            flipTimeout = null;
        }

        stopTimer();
        playSound("win");

        document.getElementById("finalMoves").innerText =
            "Moves: " + document.getElementById("moves").innerText;

        document.getElementById("finalTime").innerText =
            "Time: " + timeTaken + " seconds";

        document.getElementById("rating").innerText =
            "Rating: " + calculateRating();

        document.getElementById("winPopup").style.display = "flex";

        document.getElementById("gameStatus").innerText =
            "Level completed!";
    }
}

function restartGame() {
    document.getElementById("winPopup").style.display = "none";

    stopTimer();

    if (flipTimeout) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
    }

    gameActive = true;

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedCount = 0;

    document.getElementById("moves").innerText = "0";
    document.getElementById("time").innerText = "0";
    document.getElementById("rating").innerText = "Rating: ⭐⭐⭐";

    startGame();
}

function nextLevel() {
    if (currentLevel === "Easy") setLevel("Medium");
    else if (currentLevel === "Medium") setLevel("Hard");
    else setLevel("Easy");

    document.getElementById("winPopup").style.display = "none";

    startGame();
}
