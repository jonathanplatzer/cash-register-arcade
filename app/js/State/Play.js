/**
 * @file See {@link CashRegisterArcade.State.Play}
 * @author Jonathan Platzer <plajoa10@htlkaindorf.at>
 */
var State = namespace('CashRegisterArcade.State');

/**
 * Create a new 'Play' state
 * @class Play
 * @classdesc State for the part where the game is actually played
 * @memberOf CashRegisterArcade.State
 */
State.Play = function(game) {};

State.Play.prototype = {
    preload: function() {
        this.game.load.physics('physicsData', 'assets/physicsdata.json');
    },
    create: function() {
        //Define movement constants
        this.HANDANIMATIONTIME = 2000;
        this.MAX_SPEED = 400;
        this.JUMP_SPEED = 27;
        this.SPEED_ADD = 10;
        this.BUYPOINT = 145;
        this.isOnGround = false;
        this.canDoubleJump = true;
        this.isOnObject = false;
        this.isRight = true;
        this.isLeft = false;
        this.LEFTSPEED = 0;
        this.RIGHTSPEED = 0;
        this.OBSTACLE_SPEED = 8;
        this.OBSTACLESPAWN_INTERVAL = 3;
        this.highscore = 0;
        this.playername = "";
        this.gameover = false;
        this.playernamelength = 20;
        this.apiurl = "http://cra.throughotherey.es/api/highscore";
        this.obstacles = [];

        //Obstacle Spawn Timer
        this.obstacleTimer = this.game.time.events.loop(Phaser.Timer.SECOND * this.OBSTACLESPAWN_INTERVAL, this.createObstacle, this);

        //Keyboard initialisation
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        cursors = this.game.input.keyboard.createCursorKeys();

        keyEsc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        keyEsc.onDown.add(this.backToMain, this);

        keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keyLeft.onDown.add(this.onLeftPressed, this);

        keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        keyRight.onDown.add(this.onRightPressed, this);

        keyPause = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        keyPause.onDown.add(this.onPauseGame, this);

        this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);  //Capture all keys to one method

        //this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.BACKSPACE]); // keyCode backspace: 8
        delKey = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        delKey.onDown.add(this.deleteLetter, this);

        //Sound initialisation
        this.registerSound = this.game.add.audio('registerSound', (this.game.sfx) ? 1 : 0);
        this.registerSound.defaultVolume = 0.4;
        this.game.onSfxStatusChange.add(this.game.defaultSfxStatusChangeHandler, this.registerSound);
        this.jumpSound = this.game.add.audio('jumpSound', (this.game.sfx) ? 1 : 0);
        this.jumpSound.defaultVolume = 0.4;
        this.game.onSfxStatusChange.add(this.game.defaultSfxStatusChangeHandler, this.jumpSound);

        //Display Initialisation
        this.game.add.tileSprite(0, 0, 1280, 720, 'backgroundPlay');
        this.game.add.tileSprite(0, 0, 1280, 720, 'kassamain');
        this.register = this.game.add.sprite(150, this.game.height - 77, 'register');
        this.register.anchor.setTo(0, 1);
        this.register.scale.setTo(0.2);

        this.game.add.sprite(0, 0, 'backgroundPlay');
        this.game.add.sprite(0, 0, 'kassamain');
        this.register = this.game.add.sprite(150, this.game.height - 77, 'register');
        this.register.anchor.setTo(0, 1);
        this.register.scale.setTo(0.2);

        this.highscorestyle = { font: "20px Arial", fill: "#000000", align: "right" };
        this.highscoreDisplay = this.game.add.text(295, 432, ""+this.highscore, this.highscorestyle);

        //Setting up physics
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 1400;
        this.game.physics.p2.restitution = 0.2;
        this.game.physics.p2.setImpactEvents(true);

        //Hand Init
        this.hand = this.game.add.sprite(-23, 270, 'hand');
        this.tweenhand = this.game.add.tween(this.hand).to( { angle: 10 }, this.HANDANIMATIONTIME/2, Phaser.Easing.Linear.None)
                                                       .to( { angle: -10 }, this.HANDANIMATIONTIME, Phaser.Easing.Linear.None)
                                                       .to( { angle: 0 }, this.HANDANIMATIONTIME/2, Phaser.Easing.Linear.None)
                                                       .loop(); // durch 2 weil die beiden animationen nur den halben weg haben
        this.tweenhand.start();

        //Setting up player
        this.player = this.game.add.sprite(300, 300, 'player');
        this.game.physics.p2.enable(this.player, false);
        this.player.body.fixedRotation  = true;
        this.player.body.clearShapes();
        this.player.body.addPhaserPolygon('physicsData', 'player');
        this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 20, true);  //Animation geht nach rechts, für umdrehen der seite einfach this.player.scale.x *= -1;
        this.player.animations.add('inair', [6], 20, true);
        this.player.animations.add('stand', [0], 20, true);

        this.player.animations.play('run');

        //Setting Up Collision
        this.groundblock = this.game.add.sprite(640, this.game.height - 36 + 17, 'groundblock'); //P2 anchor is 0.5|0.5 -- x + 640 to set it to x = 0 -- this.game.height - 36 + 17 to center it on the register
        this.game.physics.p2.enable(this.groundblock, false);
        this.groundblock.body.dynamic = false;

        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.objectsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.groundCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.groundblock.body.setCollisionGroup(this.groundCollisionGroup);
        this.groundblock.body.collides([this.objectsCollisionGroup, this.playerCollisionGroup]);

        this.player.body.setCollisionGroup(this.playerCollisionGroup);
        this.player.body.collides(this.objectsCollisionGroup, this.onObject, this);
        this.player.body.collides(this.groundCollisionGroup, this.onGround, this);

        this.game.physics.p2.updateBoundsCollisionGroup();
    },
    update: function() {
        if(!this.gameover)
        {
            //Reset the ability to double jump after player hit the ground
            if(this.isOnGround || this.isOnObject) {
                this.canDoubleJump = true;
                //this.isOnObject = false;
            }

            this.onGroundOrObject = this.isOnGround || this.isOnObject;

            if (this.leftInputIsActive()) {
                //Limit speed of movement
                if(this.LEFTSPEED <= this.MAX_SPEED)
                {
                    this.LEFTSPEED += this.SPEED_ADD;
                }
                //Reset speed from other direction, so you do not have more than 0 speed at the beginning
                this.RIGHTSPEED = 0;

                //Move the player
                this.player.body.moveLeft(this.LEFTSPEED);

                //Set animation
                this.player.animations.play('run');
            } else if (this.rightInputIsActive()) {
                //Limit speed of movement
                if(this.RIGHTSPEED <= this.MAX_SPEED)
                {
                    this.RIGHTSPEED += this.SPEED_ADD;
                }
                //Reset speed from other direction, so you do not have more than 0 speed at the beginning
                this.LEFTSPEED = 0;
                //Move the player
                this.player.body.moveRight(this.RIGHTSPEED);

                //Set animation
                this.player.animations.play('run');
            } else {
                //Prevent massive speed and movement after going in the same direction(pressing left button 2 times for short time) more than one time
                //BUG -- when you jump, but do not press the left or right button the speed resets. So when you are still moving after pressing one direction
                //BUG -- and then jump, then press the same direction you slow down because your speeds got reset in this if. find a way to check if you are still the same direction
                if(this.onGroundOrObject)
                {
                    this.RIGHTSPEED = 0;
                    this.LEFTSPEED = 0;
                }

                //If player is not moving left or right and |collides with/stands on| an object, set standing animation
                if(this.isOnObject)
                {
                    if(this.LEFTSPEED === 0 || this.RIGHTSPEED === 0)
                    {
                        this.player.animations.play('stand');
                    }
                }
            }

            if (this.upInputIsActive(3)) {
                if(this.onGroundOrObject || this.canDoubleJump)
                {
                    //this.player.body.data.applyForce([0, 1500], [0, 0]);
                    this.jumpSound.play();
                    this.player.body.data.velocity[1] = this.JUMP_SPEED;
                    //First time in this function INTHEGROUND is true
                    //After first jump action isOnGround is set to false
                    //Next time jump is pressed while being in air canDoubleJump becomes false
                    if(this.onGroundOrObject)
                    {
                        //this.onGroundOrObject = false;
                        this.player.animations.play('inair');
                    }
                    else {
                        this.canDoubleJump = false;
                    }

                    this.isOnObject = false;
                    this.isOnGround = false;
                }
            }

            for (var i = this.obstacles.length - 1; i >= 0; i--) {
                if(this.obstacles[i].body !== null)
                {
                    this.obstacles[i].body.data.velocity[0] = this.OBSTACLE_SPEED;
                    //console.log(this.obstacles[i].x);
                    //this.obstacles[i].body.x -= this.OBSTACLE_SPEED;

                    if (this.obstacles[i].body.x < this.BUYPOINT && !this.obstacles[i].isBought) {
                        this.obstacles[i].isBought = true;
                        this.highscore += 10;
                        this.highscoreDisplay.setText(this.highscore);
                        this.registerSound.play();
                    }

                    if (this.obstacles[i].body.x < -140) {
                        this.obstacles[i].destroy();
                        this.obstacles.splice(i, 1);
                    }
                }
            }

            //Checks if player got bought = game over
            if(this.player.x < this.BUYPOINT)
            {
                this.registerSound.play();
                this.onGameOver();
            }

            //Speed Increase Test
            this.OBSTACLE_SPEED *= 1.0002;
            this.obstacleTimer.delay /= 1.0002;
            this.tweenhand.timeScale *= 1.0002;
        }
        else { //If gameover is true stop some gameplay routines
            this.player.animations.paused = true;
            this.tweenhand.pause();
        }
    },
    createObstacle: function() {
        if(!this.gameover)
        {
            var randomObjectName = this.game.obstacleCatalog[Math.floor(Math.random()*this.game.obstacleCatalog.length)];

            var height = this.game.cache.getImage(randomObjectName).height;

            var randomObjectSprite = this.game.add.sprite(1550, this.game.height-height/2-36, randomObjectName); // -height/2 because anchor is 0.5 0.5 and object height/2 - game height aligns objects correctly || -36 because height of groundblock
            this.game.physics.p2.enable(randomObjectSprite, false);
            randomObjectSprite.body.fixedRotation  = true;
            randomObjectSprite.body.clearShapes();
            randomObjectSprite.body.addPhaserPolygon('physicsData', randomObjectName);
            randomObjectSprite.body.collideWorldBounds = false;
            randomObjectSprite.body.mass = 1000;
            //randomObjectSprite.body.dynamic = false;

            randomObjectSprite.body.setCollisionGroup(this.objectsCollisionGroup);
            randomObjectSprite.body.collides([this.objectsCollisionGroup, this.playerCollisionGroup, this.groundCollisionGroup]);

            this.obstacles.push(randomObjectSprite);
        }
    },
    leftInputIsActive: function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        isActive |= (this.game.input.activePointer.isDown &&
            this.game.input.activePointer.x < this.game.width / 4);

        return isActive;
    },
    rightInputIsActive: function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
        isActive |= (this.game.input.activePointer.isDown &&
            this.game.input.activePointer.x > this.game.width / 2 + this.game.width / 4);

        return isActive;
    },
    upInputIsActive: function(duration) {
        var isActive = false;

        isActive = this.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, duration);
        isActive |= (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
            this.game.input.activePointer.x > this.game.width / 4 &&
            this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

        return isActive;
    },
    upInputReleased: function() {
        var released = false;

        released = this.input.keyboard.justReleased(Phaser.Keyboard.UP);
        released |= this.game.input.activePointer.justReleased();

        return released;
    },
    onLeftPressed: function() {
        if(!this.isLeft)
        {
            this.player.scale.x *= -1;
            this.isLeft = true;
            this.isRight = false;
        }
    },
    onRightPressed: function() {
        if(!this.isRight)
        {
            this.player.scale.x *= -1;
            this.isRight = true;
            this.isLeft = false;
        }
    },
    backToMain: function() {
        this.game.paused = false;
        this.game.state.start('mainMenu');
    },
    onGround: function() {
        this.isOnGround = true;
        this.isOnObject = false;
        this.player.animations.play('run');
    },
    onObject: function() {
        this.isOnGround = false;
        this.isOnObject = true;
        this.player.animations.play('stand');
    },
    onPauseGame: function() {
        this.game.paused = !this.game.paused;
    },
    onGameOver: function() {
        this.gameover = true;

        this.playerinputfield = this.game.add.sprite(0, 0, 'gameoverscreen');

        this.playernamestyle = { font: "30px Arial", fill: "#FFFFFF", align: "center" };

        this.nametext = this.game.add.text(this.game.world.centerX - 330, this.game.world.centerY + 2, "Name:", this.playernamestyle );
        this.nametext.anchor.setTo(0, 0.5);

        this.playernametext = this.game.add.text(this.game.world.centerX - 230, this.game.world.centerY + 2, this.playername, this.playernamestyle );
        this.playernametext.anchor.setTo(0, 0.5);

        this.buttonSubmitHighscore = this.game.add.button(this.game.world.centerX + 290, this.game.world.centerY, 'buttonSubmitHighscore', this.onSubmitHighscore, this, 1, 0);
        this.buttonSubmitHighscore.anchor.setTo(0.5, 0.5);
    },
    keyPress: function(key) {
        if(this.gameover)
        {
            if(this.playername.length < this.playernamelength && key.charCodeAt(0) > 0x20) //playnamelength restriction
            {
                this.playername += key;
                this.playernametext.setText(this.playername);
            }
        }
        //this.registerSound.play();
    },
    deleteLetter: function() {
        if(this.gameover)
        {
            this.playername = this.playername.substring(0, this.playername.length - 1);
            this.playernametext.setText(this.playername);
        }
    },
    onSubmitHighscore: function() {
        if(this.playername !== "")
        {
            console.log("SUBMIT");

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", this.apiurl);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("name=" + encodeURIComponent(this.playername) + "&score=" + encodeURIComponent(this.highscore));

            this.game.state.start('mainMenu');
        }
    }
};
