const cell = {
    dimensions: {x: 101, y: 83} // For easier count of the position
}

const MAX_LIVES = 5;
const BONUS_LIVE_ROUND = 10;
const BONUS_VISIBLE_TIME = 5;

let lives = 3;

let round = 0;

let scores = 0;

let gameOver = false;

let controlsBlocked = false;// To prevent player from moving when game is over

// ENEMIES OBJECTS
let Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.reset();
    this.speed;
};

Enemy.prototype.reset = function () {
    this.x = cell.dimensions.x * -1;
    this.y = cell.dimensions.y * (Math.round(Math.random() * 2) + 0.5);
    this.speed = Math.round(Math.random() * 200) + 150;
};

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > cell.dimensions.x * 5) this.reset(); // Resets the speed and the beginning position of enemy who disappeared on the right side 
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// PLAYER OBJECT
let Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = cell.dimensions.x * 2;
    this.y = cell.dimensions.y * 4.5;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.goUp = function() {
    if (controlsBlocked) return;
    if (this.y < cell.dimensions.y) { // User goes to the next round when passing the last stone ground, also doesn't come out of the fields
        this.x = cell.dimensions.x * 2;
        this.y = cell.dimensions.y * 4.5;
        if (round >= BONUS_LIVE_ROUND) { // If user goes to the round extra without taking extra heart, it will disappear
            heart.hide();
        }
        if (round < BONUS_LIVE_ROUND) { // Increasing round till bonus live round when heart appears, then resets
            round += 1;
        }
    } else {
        this.y -= cell.dimensions.y; // User goes up
    }
}

Player.prototype.goDown = function() {
    if (controlsBlocked) return;
    if (this.y > 4 * cell.dimensions.y) return; // Prevents the player to go out of the field
    this.y += cell.dimensions.y;
}

Player.prototype.goLeft = function() {
    if (controlsBlocked) return;
    if (this.x == 0) return; // Prevents the player to go out of the field
    this.x -= cell.dimensions.x; // User goes down
}

Player.prototype.goRight = function() {
    if (controlsBlocked) return;
    if (this.x == 4 * cell.dimensions.x) return; // Prevents the player to go out of the field
    this.x += cell.dimensions.x; // User goes down
}

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
        this.goLeft();
        break;
        case 'right':
        this.goRight();
        break;
        case 'up':
        this.goUp();
        break;
        case 'down':
        this.goDown();
        break;
    }
};

function checkCollisions() {
    allEnemies.forEach(function (enemy){
        let diff = enemy.x - player.x; 
        if (diff < cell.dimensions.x / 2 && diff > cell.dimensions.x / -2 && enemy.y == player.y) { // Checks if the user is close to the enemy for a half of the cell (before and after) on X line and exact match with Y column
            player.x = cell.dimensions.x * 2;
            player.y = cell.dimensions.y * 4.5;
            // Resets to standard position
            allHearts.pop();
            lives -= 1;
            round = 0;
            heart.hide();
            if (lives == 0) {
                gameOver = true;
                popup.x = cell.dimensions.x * 0.2;
                popup.y = cell.dimensions.y * 3;
                popup.reset();
            }
        }
    });
    if (blueGem.x == player.x && blueGem.y == player.y) { // When Player picks up a blue gem
        blueGem.x = cell.dimensions.x * -1;
        scores += 100;
    }
    if (heart.x == player.x && heart.y == player.y) { // When Player picks up a heart
        lives += 1;
        heart.hide();
        allHearts.push(new Heart);
        heart.livesCalc();
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() and Popup.handleInput() methods.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };    
    player.handleInput(allowedKeys[e.keyCode]);
    popup.handleInput(allowedKeys[e.keyCode]);
});


let allEnemies = [];
for (let i = 0; i < 3; i++) {
    allEnemies.push(new Enemy);
}

let player = new Player;

// GEM OBJECT
let BlueGem = function() {
    this.sprite = 'images/Gem-blue.png';
    this.x;
    this.y;
    this.timeElapsed = 5; // Gem starts to show up from the very beginning of the game ** see update function
};

BlueGem.prototype.generatePosition = function () {
    this.x = cell.dimensions.x * (Math.round(Math.random() * 4));
    this.y = cell.dimensions.y * (Math.round(Math.random() * 2) + 0.5);
}

BlueGem.prototype.update = function(dt) {
    if (controlsBlocked) return;
    this.timeElapsed += dt;
    if (this.timeElapsed > BONUS_VISIBLE_TIME) { // Gem changes the position/is being generated every 5 sec
        this.generatePosition();
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.timeElapsed = 0;
    }
};

BlueGem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

let blueGem = new BlueGem;

//HEARTS OBJECTS

let Heart = function () {
    this.sprite = 'images/Heart.png';
    this.x = cell.dimensions.x * 4.5;
    this.y = -1000;
    this.timeElapsed = 0;
    this.isHeartVisible = 0;
}

Heart.prototype.generatePosition = function () {
    this.x = cell.dimensions.x * (Math.round(Math.random() * 4));
    this.y = cell.dimensions.y * (Math.round(Math.random() * 2) + 0.5);
}

Heart.prototype.hide = function() {
    round = 0;
    this.y = -1000;
    this.isHeartVisible = 0;
    this.timeElapsed = 0;
}

Heart.prototype.update = function(dt) {
    if (round == BONUS_LIVE_ROUND  && lives < MAX_LIVES) { //Additional heart which can be picked up by the Player is generated on Bonus level if Player doesn't already have maximum lives.
        this.timeElapsed += dt;
        if (this.timeElapsed > BONUS_VISIBLE_TIME) { // Heart disappears after 5 sec if not picked
            this.hide();
            return;
        }
        if (this.isHeartVisible) return;
        this.generatePosition();
        this.isHeartVisible = 1;
    }
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Heart.prototype.renderLive = function() {
    this.sprite = 'images/HeartBig.png';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Heart.prototype.livesCalc = function() {
    for (i = 0; i < lives; i++) { // Generates a location of the actual lives Player has next to each other
        allHearts[i].x = cell.dimensions.x * 4.5;
        allHearts[i].x -= 48 * i;
        allHearts[i].y = cell.dimensions.y * -0.15;
    }
}

let allHearts = [];
for (let i = 0; i < lives; i++) {
    allHearts.push(new Heart);
}

let heart = new Heart;
heart.livesCalc();

//SCORE OBJECT

let Score = function () {
    this.x = cell.dimensions.x * 0.1;
    this.y = cell.dimensions.y * 0.45;
}

Score.prototype.render = function() {
    ctx.font = "40px Orbitron";
    ctx.fillStyle = "#3F5DDA";
    ctx.fillText(scores, this.x, this.y);
}

let score = new Score;

//POP UP OBJECT

let Popup = function () {
    this.x = cell.dimensions.x * -5;
    this.y = cell.dimensions.y * 3;
}

Popup.prototype.drawText = function(text, posx, posy, size, textColor, font, strokeLine, strokeColor) {
    if (!size) size = "30px";
    if (!font) font = "Arial";
    if (!textColor) textColor = "red";
    if (!strokeColor) strokeColor = "white";
    ctx.font = size + " " + font;
    if (strokeLine) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeLine;
        ctx.strokeText(text, posx, posy);
    }
    ctx.fillStyle = textColor;
    ctx.fillText(text, posx, posy);
}

Popup.prototype.render = function() {
    this.drawText("Game Over", this.x, this.y, "75px", "red", "Orbitron", 8, "orange");
    this.drawText("Press Enter to Restart", this.x * 3, this.y * 1.5, "30px", "red", "Orbitron", 8, "orange");
}

Popup.prototype.handleInput = function(key) {
    switch (key) {
        case 'enter':
        this.restart();
        break;
    }
};

Popup.prototype.restart = function() { // When user decided to play again
    if (gameOver) {
        this.x = cell.dimensions.x * -5;
        allEnemies.forEach(function (element) {
            element.reset();
        })
        blueGem.timeElapsed = 0;
        blueGem.generatePosition();
        blueGem.update();
        scores = 0;
        score.render();
        lives = 3;
        for (let i = 0; i < lives; i++) {
            allHearts.push(new Heart);
        }
        let heart = new Heart;
        heart.livesCalc();
        controlsBlocked = false;
        gameOver = false;
    }
}

Popup.prototype.reset = function () { // Stops the movement of enemies when game is over, Player cannot move as well
    controlsBlocked = true;
    allEnemies.forEach(function (element) {
        element.speed = 0;
    });
}

let popup = new Popup;
