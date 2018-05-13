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

function markPickedCardsAsMatched() {
    pickedCards.forEach(e => {
        e.classList.add('match');
        e.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Sets cards background to green (correct attempt)
        matchedCards.push(e);
    })

    window.setTimeout(function() {
        pickedCards.forEach(e => {
            e.classList.remove('match');
        });
        clickCount = 0;
        pickedCards = [];
    }, 650);

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

/* 3 STARS TO GET OVERALL, 1,5 STAR FOR MOVES AND 1,5 STAR FOR TIME */
function calculateFinalScore(finalMoves, finalTime) {
    let finalScore = 0;

    if (finalMoves <= 13) {
        finalScore += 1.5;
    } else if (finalMoves <= 18) {
        finalScore += 1;
    } else if (finalMoves <= 22) {
        finalScore += 0.5;
    }

    if (finalTime <= 20) {
        finalScore += 1.5;
    } else if (finalTime <= 27) {
        finalScore += 1;
    } else if (finalTime <= 32) {
        finalScore += 0.5;
    }

    return finalScore;
}

function setPlayerRating(finalScore) {

    switch(finalScore) {
        case 3: 
            setStars(1, 1, 1);
            break;
        case 2.5:
            setStars(1, 1, 0.5);
            break;
        case 2:
            setStars(1, 1, 0);
            break;
        case 1.5:
            setStars(1, 0.5, 0);
            break;
        case 1:
            setStars(1, 0, 0);
            break;
        case 0.5:
            setStars(0.5, 0, 0);
            break;
        default: 
            setStars(0, 0, 0);
    }
}

function setStars(firstStarVal, secondStarVal, thirdStarVal) {
    setStarClasses(firstStar, firstStarVal);
    setStarClasses(secondStar, secondStarVal);
    setStarClasses(thirdStar, thirdStarVal);
}

function setStarClasses(star, value) {

    switch(value) {
        case 1: 
            star.classList.add('fas', 'fa-star');
            break;
        case 0.5:
            star.classList.add('fas', 'fa-star-half');
            break;
        default:
            star.classList.add('far', 'fa-star');
    }
}

function summaryGame(finalMoves, finalTime) {
    const finalScore = calculateFinalScore(finalMoves, finalTime);

    setPlayerRating(finalScore);

    mainContainer.style.display = 'none';
    summaryContainer.style.display = 'block';
    
    finalMovesSpan.textContent = finalMoves;
    finalTimerSpan.textContent = finalTime + 's';
}

function removeStars() {
    firstStar.removeAttribute('class');
    secondStar.removeAttribute('class');
    thirdStar.removeAttribute('class');    
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
    removeStars();
}

/** TODO add animation for correct/wrong attempt */
/** TODO Check rubric for details - check up if everything is done */