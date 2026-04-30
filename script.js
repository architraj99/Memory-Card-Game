let step = 0;

function nextStep() {

    let title = document.getElementById("popupTitle");
    let text = document.getElementById("popupText");
    let button = document.querySelector("#popup button");

    step++;

    if (step === 1) {
        title.innerText = "How To Play";
        text.innerText = "Flip two cards and try to find matching pairs";
    }

    else if (step === 2) {
        title.innerText = "Game Rules";
        text.innerText = "If cards match they stay open, otherwise they flip back";
    }

    else if (step === 3) {
        title.innerText = "Levels";
        text.innerText = "Game has multiple levels with increasing difficulty";
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


let cardValues = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝", "🍍", "🥥"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

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

    let pairCount = 4;

    if (currentLevel === "Medium") {
        pairCount = 6;
    }

    if(currentLevel === "Hard") {
        pairCount = 8;
    }

    let selectedCards = cardValues.slice(0, pairCount);
    let gameCards = selectedCards.concat(selectedCards);

    shuffle(gameCards);

    let board = document.getElementById("gameBoard");
    
    board.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    for (let i = 0; i < gameCards.length; i++) {
        let card = document.createElement("div");

        card.className = "card";
        card.innerText = "?";

        card.dataset.value = gameCards[i];

        card.dataset.id = i;

        board.appendChild(card);
    }

}