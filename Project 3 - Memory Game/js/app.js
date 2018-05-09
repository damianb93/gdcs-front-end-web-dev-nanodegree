const mainContainer = document.querySelector('.main-container');
const summaryContainer = document.querySelector('.summary-container');
const gameboard = document.querySelector('.gameboard');
const restartBtn = document.querySelector('.restart');
const summaryRestartBtn = document.querySelector('.summary-container .restart');
const movesSpan = document.querySelector('.moves');
const timerSpan = document.querySelector('.time');
const finalMovesSpan = document.querySelector('.sum-moves');
const finalTimerSpan = document.querySelector('.sum-time');


let clickCount = 0;
let moves = 0;
let pickedCards = [];
let matchedCards = [];
let icons = ['car', 'car', 'bus', 'bus', 'bicycle', 'bicycle', 'motorcycle', 'motorcycle', 'ship', 'ship', 'rocket', 'rocket', 'truck', 'truck', 'ambulance', 'ambulance'];
let startTime = 0;
/** TODO fix interval not defined error */
let inverval;
let finalTime = 0;
let finalMoves = 0;
let finalScore = 0;

document.addEventListener('DOMContentLoaded', function () {
    randomizeCards();
});

gameboard.addEventListener('click', function(evt){

    if (clickCount >= 0 && clickCount <= 1 && evt.target.nodeName === 'LI' && !pickedCards.includes(evt.target) && !matchedCards.includes(evt.target)) {

        if (startTime === 0) {
            startTime = new Date();
            interval = setInterval(function(){
                timerSpan.textContent = calculateTimeElapsed(new Date());
            }, 1000);
        }

        const card = evt.target;
        clickCount++;
        pickedCards.push(card);

        card.classList.toggle('rotate');
        card.style.backgroundColor = 'rgba(0,0,0,0.5)';
        card.style.cursor = 'default';

        card.style

        if (clickCount === 2) {
            moves++;
            movesSpan.textContent = moves;
            checkIfEquals() ? markCardsAsMatched() : resetPickedCards();
        }
    }
});

restartBtn.addEventListener('click', function() {
    restartGame();
    // summaryGame(moves, 0); 
});

summaryRestartBtn.addEventListener('click', function() {
    if (mainContainer.style.display === 'none') {
        mainContainer.style.display = 'block';
        summaryContainer.style.display = 'none';
    }

    restartGame();
})

function checkIfEquals() {
    const firstCardIcon = pickedCards[0].lastElementChild.firstElementChild;
    const secondCardIcon = pickedCards[1].lastElementChild.firstElementChild;

    return firstCardIcon.classList.contains(secondCardIcon.classList.item(1));
}

function summaryGame(finalMoves, finalTime) {
    /** TODO come up with finalScore calculation method */
    /** TODO logic for stars */
    const finalScore = 100;
    mainContainer.style.display = 'none';
    summaryContainer.style.display = 'block';
    finalMovesSpan.textContent = finalMoves;
    finalTimerSpan.textContent = finalTime + 's';
}

function markCardsAsMatched() {

    pickedCards.forEach(e => {
        e.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
        matchedCards.push(e);
    })
    clickCount = 0;
    pickedCards = [];

    if (matchedCards.length === 16) {
        summaryGame(moves, calculateTimeElapsed(new Date()));
        console.log('Game over');
    }
}

function calculateTimeElapsed(endTime) {
    let timeDiff = (endTime - startTime)/1000;
    return Math.round(timeDiff);
}

function resetPickedCards() {
    pickedCards.forEach(e => {
        e.style.backgroundColor = 'rgba(255,0,0,0.8)';
    })
    window.setTimeout(function(){
        pickedCards.forEach(e => {
            e.classList.toggle('rotate');
            e.style.backgroundColor = 'rgba(0,0,0,0.8)';
            e.style.cursor = 'pointer';
            clickCount = 0;
            pickedCards = []; 
        })
    }, 600);
}

//Fisher–Yates Shuffle
function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {

        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];

        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function randomizeCards() {
    shuffle(icons);
    toggleCardsClasses();
}

function toggleCardsClasses() {
    let index = 0;
    document.querySelectorAll('.card i').forEach(e => {
        e.classList.toggle('fa-'+ icons[index]);
        index++;
    });
}

function restartGame() {
    document.querySelectorAll('.card').forEach(e => {
        if (e.classList.contains('rotate')) {
            e.classList.toggle('rotate');
            e.style.backgroundColor = 'rgba(0,0,0,0.8)';
            e.style.cursor = 'pointer';
        }
    })

    window.setTimeout(function() {    
        toggleCardsClasses(); //Delete existing classes
        randomizeCards(); //Randomize order of icon classes and adds them to the cards
    }, 600);

    moves = 0;
    movesSpan.textContent = moves;
    clickCount = 0;
    pickedCards = [];
    matchedCards = [];
    clearInterval(interval);
    startTime = 0;
    timerSpan.textContent = 0;
}

/** TODO add animation for correct/wrong attempt */
/** TODO Check rubric for details - check up if everything is done */
/** TODO refactor code */