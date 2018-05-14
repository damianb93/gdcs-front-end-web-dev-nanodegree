const mainContainer = document.querySelector('.main-container');
const summaryContainer = document.querySelector('.summary-container');
const gameboard = document.querySelector('.gameboard');
const restartBtn = document.querySelector('.restart');
const summaryRestartBtn = document.querySelector('.summary-container .restart');
const movesSpan = document.querySelector('.moves');
const timerSpan = document.querySelector('.time');
const finalMovesSpan = document.querySelector('.sum-moves');
const finalTimerSpan = document.querySelector('.sum-time');
const firstStar = document.querySelector('#star1');
const secondStar = document.querySelector('#star2');
const thirdStar = document.querySelector('#star3');
const starsContainers = document.querySelectorAll('.stars');

let clickCount = 0;
let moves = 0;
let pickedCards = [];
let matchedCards = [];
let cards = ['car', 'car', 'bus', 'bus', 'bicycle', 'bicycle', 'motorcycle', 'motorcycle', 'ship', 'ship', 'rocket', 'rocket', 'truck', 'truck', 'ambulance', 'ambulance'];
let startTime = 0;
let interval;

/*-----LISTENERS-----*/

/* Intialazing game state after document load*/
document.addEventListener('DOMContentLoaded', function() {
    initGameState();
    initStars();
});

/* Main listener of the game, reacts on users click and handles main game logic */
gameboard.addEventListener('click', function(evt){
    /*  isBetween(clickCount, 0, 1) locks flipping more than 2 cards at a time
        isCard(evt.target.nodeName) checks if clicked element is a card (cards are <li> elements)
        !isPickedOrmatched checks if clicked card was already picked or matched if so then the click is ignored   
    */
    if (isBetween(clickCount, 0, 1) && isCard(evt.target.nodeName) && !isPickedOrMatched(evt.target)) {
        /* Starts the timer at first card click */
        if (startTime === 0) {
            startTime = new Date();
            interval = setInterval(function(){
                timerSpan.textContent = calculateElapsedTime(new Date());
            }, 1000);
        }

        const card = evt.target;
        pickedCards.push(card);
        clickCount++;

        
        card.classList.toggle('rotate'); // Rotates card to the front
        card.style.backgroundColor = 'rgba(0,0,0,0.5)';
        card.style.cursor = 'default';

        // If pair of cards is selected
        if (clickCount === 2) {
            moves++;
            movesSpan.textContent = moves;

            /* Rating logic */
            if (moves === 15) {
                emptyStar(2);
            } else if (moves === 21) {
                emptyStar(1);
            }

            arePickedCardsEqual() ? markPickedCardsAsMatched() : resetPickedCards();
        }
    }
});

/* Main screen reset button click listener */
restartBtn.addEventListener('click', function() {
    restartGame();
});

/* Summary screen reset button click listener */
summaryRestartBtn.addEventListener('click', function() {
    /* Changes current view from summary to game */
    if (mainContainer.style.display === 'none') {
        mainContainer.style.display = 'block';
        summaryContainer.style.display = 'none';
    }

    restartGame();
})

/*-----FUNCTIONS-----*/

/* Randomizes and sets cards on board */
function initGameState() {
    randomizeCards(cards);
    setOrRemoveCards();
}

// Fisher–Yates Shuffle
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

/* Checks if the given value is between given min and max */
function isBetween(value, min, max) {
    return value >= min && value <= max;
}

/* Checks if the given element is a card (li element) */
function isCard(elem) {
    return elem === 'LI';
}

/* Checks if the card was already picked or already has a match */
function isPickedOrMatched(card) {
    return pickedCards.includes(card) || matchedCards.includes(card);
}

/* Checks if the currently picked pair of card is equal */
function arePickedCardsEqual() {
    const firstCard = pickedCards[0].lastElementChild.firstElementChild;
    const secondCard = pickedCards[1].lastElementChild.firstElementChild;

    return firstCard.classList.contains(secondCard.classList.item(1));
}

/* Calculates elapsed time in seconds since the begining of the game */
function calculateElapsedTime(endTime) {
    const timeDiff = (endTime - startTime)/1000;
    return Math.round(timeDiff);
}

// Sets/removes icon classes for/from cards
function setOrRemoveCards() {
    let index = 0;
    document.querySelectorAll('.card i').forEach(e => {
        e.classList.toggle('fa-'+ cards[index]);
        index++;
    });
}

/* Intializes scoreboard with full star icons */
function initStars() {
    starsContainers.forEach(e => {
        for (star of e.children) {
            setFullStar(star);
        }
    })
}

/* Removes stars icons from scoreboard */
function removeStars() {
    starsContainers.forEach(e => {
        for (star of e.children) {
            removeStarClass(star);
        }
    })
}

/* Removes full star and sets in its place empty one */
function emptyStar(index) {
    starsContainers.forEach(e => {
        if (index >= 0 && index <= e.children.length) {
            const star = e.children.item(index);
            removeStarClass(star);
            setEmptyStar(star);
        }
    })
}

/* Sets full star icon for given element */
function setFullStar(star) {
    star.classList.add('fas', 'fa-star');
}

/* Sets empty star icon for given element */
function setEmptyStar(star) {
    star.classList.add('far', 'fa-star');
}

/* Removes class attribute from given element */
function removeStarClass(star) {
    star.removeAttribute('class');  
}

/* Pushes currently picked cards to matchedCards array and resets clickCount and pickedCards array
   If the game is over (all pairs are matched) invokes summaryGame method */
function markPickedCardsAsMatched() {
    pickedCards.forEach(e => {
        e.classList.add('match');
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

/* Informs the user of incorrect attempt by shaking card and changing background color to red
   Resets selected cards state */
function resetPickedCards() {
    pickedCards.forEach(e => {
        e.classList.add('shake');
        e.style.backgroundColor = 'rgba(255,0,0,0.8)'; // Sets cards background to red (wrong attempt)
    })

    // Flips cards back to initial position, resets background color, clickCount variable and pickedCards array
    window.setTimeout(function(){
        pickedCards.forEach(e => {
            e.classList.toggle('rotate');
            e.style.backgroundColor = 'rgba(0,0,0,0.8)';
            e.style.cursor = 'pointer';

            clickCount = 0;
            pickedCards = []; 
            e.classList.remove('shake');
        })
    }, 650);
}

/* Changes view from game to summary */
function summaryGame(finalMoves, finalTime) {
    if (interval) {
        clearInterval(interval);
    }
    mainContainer.style.display = 'none';
    summaryContainer.style.display = 'block';
    
    finalMovesSpan.textContent = finalMoves;
    finalTimerSpan.textContent = finalTime + 's';
}

/* Resets game state to initial */
function restartGame() {
    // Flips back all cards on board
    document.querySelectorAll('.card').forEach(e => {
        if (e.classList.contains('rotate')) {
            e.classList.toggle('rotate');
            e.style.backgroundColor = 'rgba(0,0,0,0.8)';
            e.style.cursor = 'pointer';
        }

        if (e.classList.contains('match')) {
            e.classList.remove('match');
        }
    })

    window.setTimeout(function() {    
        setOrRemoveCards(); // Removes existing cards
        initGameState(); // Randomizes and sets cards on board
    }, 600);

    moves = 0;
    movesSpan.textContent = moves;
    startTime = 0;
    timerSpan.textContent = 0;

    /* Resets game state variables */
    clickCount = 0;
    pickedCards = [];
    matchedCards = [];
    clearInterval(interval);
    removeStars();
    initStars();
}
