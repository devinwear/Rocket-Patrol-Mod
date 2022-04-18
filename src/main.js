// Devin Wear
// Rocket Patrol Mod
// 4/17/2022
// This took me around 10 hours
// List of implemented features:
/*
Track a high score that persists across scenes and display it in the UI (5) --- This is only visible in the game over screen, the UI was getting a bit cluttered.
Allow the player to control the Rocket after it's fired (5)
Display the time remaining (in seconds) on the screen (10)
Implement the 'FIRE' UI text from the original game (5)
Implement the speed increase that happens after 30 seconds in the original game (5)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
Implement a simultaneous two-player mode (30)
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyENTER;

game.highScore = 0;