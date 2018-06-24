// Enemies our player must avoid
class Enemy {
        // Set intial enemy's properties
        constructor() {
            this.sprite = 'images/enemy-bug.png';
            this.collisionRows = [63, 146, 229];
            this.initialSpeed = 150;

            this.resetState();
        }
    
        // Update the enemy's position and hitbox
        // Parameter: dt, a time delta between ticks
        // Reset enemy's position when they go offscreen
        update(dt) {
            this.x += (dt * this.speed);

            if (this.x >= 505) { this.resetState(); }

            this.hitbox = {
                xMin: this.x,
                xMax: this.x + 101,
                y: this.y
            }
        }
    
        // Draw the enemy on the screen, required method for game
        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        // Set enemy object's position to intial one with random starting row and movement speed
        resetState() {
            this.x = -101;
            this.y = this.collisionRows[Math.floor(Math.random() * (this.collisionRows.length))];
            this.speed = this.initialSpeed * (Math.random() * 2 + 1);
        }
    }
    
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.scoreRecord = 0;
        this.scoreboard = document.querySelector('.scoreboard');

        this.resetPosition();
        this.resetScore();
        this.updateScoreboard();
    }

    // Update player's state
    update() {
        // Player wins the game
        if (this.y <= -30) { 
            this.score++;
            if (this.scoreRecord < this.score) {
                this.scoreRecord = this.score;
            }

            this.updateScoreboard();
            this.resetPosition();
        }

        this.hitbox = {
            xMin: this.x + 28,
            xMax: this.x + 73,
            y: this.y + 10
        }
    }

    // Draw the player on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Translate player's keyboard input to character's movement
    handleInput(keyPressed) {
        switch (keyPressed) {
            case 'up':
                if (this.y > -30) { this.y -= 83 }
                break;
            case 'down':
                if (this.y < 385) { this.y += 83 }
                break;
            case 'left':
                if (this.x > 0) { this.x -= 101 }
                break;
            case 'right':
                if (this.x < 404) { this.x += 101 }
                break;
        }
    }

    // Reset player's current position to initial one
    resetPosition() {
        this.x = 202;
        this.y = 385;
    }

    resetScore() {
        this.score = 0;
    }

    updateScoreboard() {
        this.scoreboard.innerText = `Score: ${this.score} Record: ${this.scoreRecord}`;
    }
}

// Instantiate player and enemies objects
const allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
