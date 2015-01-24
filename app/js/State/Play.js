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
        this.load.image('block', '/assets/img/block.png');
        this.game.load.physics('physicsData', 'assets/physicsdata.json');
    },
    create: function() {
        //Define movement constants
        this.MAX_SPEED = 750;
        this.ACCELERATION = 1500;
        this.FORCE = 500;
        this.DRAG = 800;
        this.GRAVITY = 2600;
        this.JUMP_SPEED = -700;
        this.HANDANIMATIONSPEED = 2000;
        
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
        this.hand = this.game.add.sprite(-23, 270, 'hand');
        this.tweenhand = this.game.add.tween(this.hand).to( { angle: 10 }, this.HANDANIMATIONSPEED/2, Phaser.Easing.Linear.None)
                                                       .to( { angle: -10 }, this.HANDANIMATIONSPEED, Phaser.Easing.Linear.None)
                                                       .to( { angle: 0 }, this.HANDANIMATIONSPEED/2, Phaser.Easing.Linear.None)
                                                       .loop(); // /2 weil die beiden animationen nur den halben weg haben
        
        this.tweenhand.start();
        
        //Correct Polygon Collision
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 1400;
        this.game.physics.p2.restitution = 0.4;
        
        var weinflasche = this.game.add.sprite(420, 300, 'weinflasche');
        this.game.physics.p2.enable(weinflasche, true);
        weinflasche.body.fixedRotation  = true;
        weinflasche.body.clearShapes();
        weinflasche.body.addPhaserPolygon('physicsData', 'weinflasche');
        
        var brot = this.game.add.sprite(600, 300, 'brot');
        this.game.physics.p2.enable(brot, true);
        brot.body.fixedRotation  = true;
        brot.body.clearShapes();
        brot.body.addPhaserPolygon('physicsData', 'brot');
        
        var orangensaft = this.game.add.sprite(850, 300, 'orangensaft');
        this.game.physics.p2.enable(orangensaft, true);
        orangensaft.body.fixedRotation  = true;
        orangensaft.body.clearShapes();
        orangensaft.body.addPhaserPolygon('physicsData', 'orangensaft');
        
        this.player = this.game.add.sprite(1200, 300, 'player');
        this.game.physics.p2.enable(this.player, false);
        this.player.body.fixedRotation  = true;
        this.player.body.addRectangle();
        this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 20, true);  //Animation geht nach rechts, für undrehen der seite einfach this.player.scale.x *= -1;
        this.player.animations.add('inair', [6], 20, true);
        
        this.player.animations.play('run');
        
        
        /*this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.GRAVITY;

        this.player = this.game.add.sprite(this.game.width / 2, this.game.height - 120, 'block');

        this.game.physics.enable(this.player, Phaser.Physics.P2JS);

        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
        this.player.body.drag.setTo(this.DRAG, 0); // x, y
        this.player.scale.setTo(1.5);
        this.player.tint = 0xff00ff;

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.obstacles = [];

        this.game.time.events.loop(Phaser.Timer.SECOND, this.createObstacle, this);

        this.ground = this.game.add.group();
        for (var x = -128; x < this.game.width + 128; x += 32) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 36);
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }
        */
        cursors = this.game.input.keyboard.createCursorKeys();
        
        keyEsc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        keyEsc.onDown.add(this.backToMain, this);
    },
    update: function() {
        /*// Collide the player with the ground
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.player, this.obstacles);

        var onTheGround = this.player.body.touching.down;

        if (this.leftInputIsActive()) {
            // If the LEFT key is down, set the player velocity to move left
            this.player.body.acceleration.x = -this.ACCELERATION;
        } else if (this.rightInputIsActive()) {
            // If the RIGHT key is down, set the player velocity to move right
            this.player.body.acceleration.x = this.ACCELERATION;
        } else {
            this.player.body.acceleration.x = 0;
            if (onTheGround) {
                this.canDoubleJump = true;
            }

        }

        // Set a variable that is true when the player is touching the ground

        if (this.upInputIsActive(5)) {
            if (this.canDoubleJump || onTheGround) {
                // Jump when the player is touching the ground or they can double jump
                this.player.body.velocity.y = this.JUMP_SPEED;

                // Disable ability to double jump if the player is jumping in the air
                if (!onTheGround) {
                    this.canDoubleJump = false;
                }
            }
        }

        for (var i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].body.velocity = -this.FORCE;

            if (this.obstacles[i].body.x < -120) {
                this.obstacles.pop(i);
            }
        }*/
    },
    createObstacle: function() {
        /*console.log("create obstalce");
        var randomObstacle = {
            body: {
                x: 120
            }
        };
        this.obstacles.push(randomObstacle);*/
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

        isActive = this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, duration);
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
    backToMain: function() {
        this.game.state.start('mainMenu');
    }
};
