class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship2', './assets/spaceship2trim.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/4, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new Rocket2(this, game.config.width/1.5, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship(this, game.config.width, borderUISize*8 + borderPadding*4, 'spaceship2', 0, 50).setOrigin(0,0);
        this.ship04.moveSpeed = 5;

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        // display p1 score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // display p2 score
        this.scoreRight = this.add.text(borderUISize + borderPadding*44, borderUISize + borderPadding*2, this.p2Score, scoreConfig);

        // display timer
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.displayTime = 0;
        this.initialTime = 30;
        var hard;
        if (game.settings.gameTimer == 60000) {
            hard = false;
            this.displayTime = 60;
        }
        else {
            hard = true;
            this.displayTime = 45;
        }
        this.timeText = this.add.text(borderUISize + borderPadding*22, borderUISize + borderPadding*2, this.displayTime.toString(), timerConfig);
        this.timedEvent = this.time.addEvent({delay: 1000, callback: onEvent, callbackScope: this, loop: true});

        function onEvent() {
            if (this.displayTime != 0) {
                this.initialTime -= 1;
                this.displayTime -= 1;
                this.timeText.setText(this.displayTime.toString());
            }
            if (hard == false && this.initialTime == 0) {
                this.ship01.moveSpeed = 4;
                this.ship02.moveSpeed = 4;
                this.ship03.moveSpeed = 4;
                this.ship04.moveSpeed = 6;
            }
            else if (hard == true && this.initialTime == 0) {
                this.ship01.moveSpeed = 5;
                this.ship02.moveSpeed = 5;
                this.ship03.moveSpeed = 5;
                this.ship04.moveSpeed = 7;
            }
        }

        // display 'FIRE'
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.FIRE = this.add.text(borderUISize + borderPadding*11.5, borderUISize + borderPadding*2, "FIRE", fireConfig);
        this.FIRE.setActive(false).setVisible(false);
        this.fireEvent = this.time.addEvent({delay: 100, callback: onFire, callbackScope: this, loop: true});
        this.FIRE2 = this.add.text(borderUISize + borderPadding*33.5, borderUISize + borderPadding*2, "FIRE", fireConfig);
        this.FIRE2.setActive(false).setVisible(false);
        this.fireEvent2 = this.time.addEvent({delay: 100, callback: onFire2, callbackScope: this, loop: true});

        function onFire() {
            if (this.p1Rocket.isFiring == true) {
                this.FIRE.setActive(true).setVisible(true);
            }
            else {
                this.FIRE.setActive(false).setVisible(false);
            }
        }

        function onFire2() {
            if (this.p2Rocket.isFiring == true) {
                this.FIRE2.setActive(true).setVisible(true);
            }
            else {
                this.FIRE2.setActive(false).setVisible(false);
            }
        }

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        //this.clock = this.time.delayedCall(game.settings.gameTimer, () => {

        this.gameoverEvent = this.time.addEvent({delay: 100, callback: gameEnd, callbackScope: this, loop: true});

        function gameEnd() {
            if (this.displayTime == 0) {
                if (this.p1Score > game.highScore) {
                    game.highScore = this.p1Score;
                }
                if (this.p2Score > game.highScore) {
                    game.highScore = this.p2Score;
                }
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Current high score: ' + game.highScore, scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }
        }
        //}, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.p2Rocket.update();             // update p2
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Score += 50;
            this.scoreLeft.text = this.p1Score; 
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Score += 10;
            this.scoreLeft.text = this.p1Score; 
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Score += 20;
            this.scoreLeft.text = this.p1Score; 
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Score += 30;
            this.scoreLeft.text = this.p1Score; 
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        // check p2 collisions 
        if (this.checkCollision(this.p2Rocket, this.ship04)) {
            this.p2Score += 50;
            this.scoreRight.text = this.p2Score; 
            this.p2Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Score += 10;
            this.scoreRight.text = this.p2Score; 
            this.p2Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Score += 20;
            this.scoreRight.text = this.p2Score; 
            this.p2Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Score += 30;
            this.scoreRight.text = this.p2Score; 
            this.p2Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        //this.p1Score += ship.points;
        //this.scoreLeft.text = this.p1Score; 
        //time add and repaint
        this.displayTime += 3;
        this.sound.play('sfx_explosion');
    }
}