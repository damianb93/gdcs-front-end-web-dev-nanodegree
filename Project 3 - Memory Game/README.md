# Project: Memory Game
Project created for Google Developer Challange Scholarship: Front-End Web Developer Nanodegree Program 2018.
## Description
Memory game is an web app playable both on desktop and mobile devices. The core functionality of game is based on memorizing and matching figures. In order to win Player needs to match all of 8 pairs of cards placed on gameboard. Player's rating depends on number of moves needed to complete the task.

## Project structure

```
--Project 3: Memory Game
  |-- README.md
  |-- index.html
  |-- js
  |   `-- app.js
  `-- css
      |-- animation.css
      |-- main.css
      `-- responsive.css
```

**index.html** - Main html file divided into two containers. First container `<div class="main-container">` includes basic view of the game, containing gameboard with cards and scoreboard (number of moves and time). Second container `<div class="summary-container">` includes summary view of player's performance and a restart button.

**js/app.js** - Includes logic for the game written in pure js.

**css/animation.css** - Includes classes with animations for correct and incorrect guess.  
**css/main.css** - Includes core styling for elements.  
**css/responsive.css** - Includes css for responsive design of the game.

## Rating

★★★ - Tree star rating is reachedd when number of moves doesn't exceed 14.  
★★☆- Two star rating is reached when number of moves excee 14 but doesn't exceed 20.  
★☆☆ - One star rating is reached when number of moves exceed 20.  
