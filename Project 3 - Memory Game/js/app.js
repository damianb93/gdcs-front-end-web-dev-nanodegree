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
let cards = ['car', 'car', 'bus', 'bus', 'bicycle', 'bicycle', 'motorcycle', 'motorcycle', 'ship', 'ship', 'rocket', 'rocket', 'truck', 'truck', 'ambulance', 'ambulance'];
let startTime = 0;
let inverval;

/*-----LISTENERS-----*/

document.addEventListener('DOMContentLoaded', function() {
    initGameState();
});

gameboard.addEventListener('click', function(evt){
    /*  isBetween(clickCount, 0, 1) locks flipping more than 2 cards at a time
        isCard(evt.target.nodeName) checks if clicked element is a card (cards are <li> elements)
        !isPickedOrmatched checks if clicked card was already picked or matched if so then the click is ignored   
    */
    if (isBetween(clickCount, 0, 1) && isCard(evt.target.nodeName) && !isPickedOrMatched(evt.target)) {

        //Starts the timer at first card click
        if (startTime === 0) {
            startTime = new Date();
            interval = setInterval(function(){
                timerSpan.textContent = calculateElapsedTime(new Date());
            }, 1000);
        }

        const card = evt.target;
        pickedCards.push(card);
        clickCount++;

        card.classList.toggle('rotate');
        card.style.backgroundColor = 'rgba(0,0,0,0.5)';
        card.style.cursor = 'default';

        if (clickCount === 2) {
            moves++;
            movesSpan.textContent = moves;
            
            arePickedCardsEqual() ? markPickedCardsAsMatched() : resetPickedCards();
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

/*-----FUNCTIONS-----*/

function initGameState() {
    randomizeCards(cards);
    setOrRemoveCards();
}

//Fisher–Yates Shuffle
function randomizeCards(array) {
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

function isBetween(value, min, max) {
    return value >= min && value <= max;
}

function isCard(elem) {
    return elem === 'LI';
}

function isPickedOrMatched(card) {
    return pickedCards.includes(card) || matchedCards.includes(card);
}

function arePickedCardsEqual() {
    const firstCard = pickedCards[0].lastElementChild.firstElementChild;
    const secondCard = pickedCards[1].lastElementChild.firstElementChild;

    return firstCard.classList.contains(secondCard.classList.item(1));
}

function calculateElapsedTime(endTime) {
    const timeDiff = (endTime - startTime)/1000;
    return Math.round(timeDiff);
}

// Sets/removes icon classes for cards
function setOrRemoveCards() {
    let index = 0;
    document.querySelectorAll('.card i').forEach(e => {
        e.classList.toggle('fa-'+ cards[index]);
        index++;
    });
}

function markPickedCardsAsMatched() {
    pickedCards.forEach(e => {
        e.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Sets cards background to green (correct attempt)
        matchedCards.push(e);
    })
    clickCount = 0;
    pickedCards = [];

    // if all cards are matched
    if (matchedCards.length === 16) {
        summaryGame(moves, calculateElapsedTime(new Date()));
    }
}

function resetPickedCards() {
    pickedCards.forEach(e => {
        e.style.backgroundColor = 'rgba(255,0,0,0.8)'; // Sets cards background to red (wrong attempt)
    })

    // Flips cards back to initial position, resets clickCount and pickedCards array
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

function summaryGame(finalMoves, finalTime) {
    /** TODO come up with finalScore calculation method */
    /** TODO logic for stars */
    mainContainer.style.display = 'none';
    summaryContainer.style.display = 'block';

    const finalScore = 100;
    finalMovesSpan.textContent = finalMoves;
    finalTimerSpan.textContent = finalTime + 's';
}

function restartGame() {
    // Sets intial position of all cards on board
    document.querySelectorAll('.card').forEach(e => {
        if (e.classList.contains('rotate')) {
            e.classList.toggle('rotate');
            e.style.backgroundColor = 'rgba(0,0,0,0.8)';
            e.style.cursor = 'pointer';
        }
    })

    window.setTimeout(function() {    
        setOrRemoveCards(); // Remove existing cards
        initGameState();
    }, 600);

    moves = 0;
    movesSpan.textContent = moves;
    startTime = 0;
    timerSpan.textContent = 0;

    clickCount = 0;
    pickedCards = [];
    matchedCards = [];
    clearInterval(interval);
}

/** TODO add animation for correct/wrong attempt */
/** TODO Check rubric for details - check up if everything is done */