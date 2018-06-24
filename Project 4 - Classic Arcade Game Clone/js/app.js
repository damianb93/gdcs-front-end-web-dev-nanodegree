// Enemies our player must avoid
class Enemy {
    
        constructor() {
            this.sprite = 'images/enemy-bug.png';
            this.x = 0;
            this.y = 63;
        }
    
        // Update the enemy's position, required method for game
        // Parameter: dt, a time delta between ticks
        update(dt) {
    
        }
    
        // Draw the enemy on the screen, required method for game
        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
    
class Player {

    constructor() {
        this.sprite = 'images/char-boy.png';
        this.resetPosition();
    }

    // Update player's state
    update() {
        if (this.y <= -30) { this.resetPosition(); }
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
