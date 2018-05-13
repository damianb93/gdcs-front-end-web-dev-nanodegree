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
document.addEventListener('DOMContentLoaded', function() {
    initGameState();
    initStars();
});

gameboard.addEventListener('click', function(evt){
    /*  isBetween(clickCount, 0, 1) locks flipping more than 2 cards at a time
        isCard(evt.target.nodeName) checks if clicked element is a card (cards are <li> elements)
        !isPickedOrmatched checks if clicked card was already picked or matched if so then the click is ignored   
    */
    if (isBetween(clickCount, 0, 1) && isCard(evt.target.nodeName) && !isPickedOrMatched(evt.target)) {
        //Starts the timer at first card clicks
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

            if (moves === 15) {
                emptyStar(2);
            } else if (moves === 21) {
                emptyStar(1);
            }
            
            arePickedCardsEqual() ? markPickedCardsAsMatched() : resetPickedCards();
        }
    }
});

restartBtn.addEventListener('click', function() {
    restartGame();
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

function initStars() {
    starsContainers.forEach(e => {
        for (star of e.children) {
            setFullStar(star);
        }
    })
}

function removeStars() {
    starsContainers.forEach(e => {
        for (star of e.children) {
            removeStarClass(star);
        }
    })
}

function emptyStar(index) {
    starsContainers.forEach(e => {
        if (index >= 0 && index <= e.children.length) {
            const star = e.children.item(index);
            removeStarClass(star);
            setEmptyStar(star);
        }
    })
}

function setFullStar(star) {
    star.classList.add('fas', 'fa-star');
}

function setEmptyStar(star) {
    star.classList.add('far', 'fa-star');
}

function removeStarClass(star) {
    star.removeAttribute('class');  
}

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

function resetPickedCards() {
    pickedCards.forEach(e => {
        e.classList.add('shake');
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
            e.classList.remove('shake');
        })
    }, 650);
}

function summaryGame(finalMoves, finalTime) {
    mainContainer.style.display = 'none';
    summaryContainer.style.display = 'block';
    
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

        if (e.classList.contains('match')) {
            e.classList.remove('match');
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
    removeStars();
    initStars();
}
