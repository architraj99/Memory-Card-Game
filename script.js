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