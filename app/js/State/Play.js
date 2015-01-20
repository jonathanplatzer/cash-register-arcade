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
    },
    create: function() {
        this.game.add.tileSprite(0, 0, 1280, 720, 'backgroundPlay');
        this.game.add.tileSprite(0, 0, 1280, 720, 'kassamain');
        this.register = this.game.add.sprite(150, this.game.height - 72, 'register');
        this.register.anchor.setTo(0, 1);
        this.register.scale.setTo(0.2);

        //Define moveme constants
        this.MAX_SPEED = 750;
        this.ACCELERATION = 1500;
        this.FORCE = 500;
        this.DRAG = 800;
        this.GRAVITY = 2600;
        this.JUMP_SPEED = -700;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.GRAVITY;

        this.player = this.game.add.sprite(this.game.width / 2, this.game.height - 120, 'player');

        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
        this.player.body.drag.setTo(this.DRAG, 0); // x, y
        this.player.scale.setTo(0.1875);

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        this.obstacle = this.game.add.sprite(this.game.width/4, this.game.height - 72, 'player');
        this.game.physics.enable(this.obstacle, Phaser.Physics.ARCADE);
        this.obstacle.anchor.setTo(1,1);
        this.obstacle.scale.setTo(0.2);
        this.obstacle.collideWorldBounds = false;
        this.obstacle.body.allowGravity = true;

        this.obstacle2 = this.game.add.sprite((this.game.width/4)*3, this.game.height - 72, 'player');
        this.game.physics.enable(this.obstacle2, Phaser.Physics.ARCADE);
        this.obstacle2.anchor.setTo(1,1);
        this.obstacle2.scale.setTo(0.4);
        this.obstacle2.collideWorldBounds = false;
        this.obstacle2.body.allowGravity = true;

        this.ground = this.game.add.group();
        for (var x = -128; x < this.game.width+128; x += 32) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 36);
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }

        this.ground.add(this.obstacle);
        this.ground.add(this.obstacle2);

        cursors = this.game.input.keyboard.createCursorKeys();

        keyEsc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        keyEsc.onDown.add(this.backToMain, this);
    },
    update: function() {

        // Collide the player with the ground
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.obstacle, this.ground);
        this.game.physics.arcade.collide(this.obstacle2, this.ground);

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

                //this.player.body.velocity.x = -this.FORCE;
                if(!this.player.body.touching.right && !this.player.body.touching.right) {
                    //this.player.body.velocity.x = 0;
                }
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

        this.obstacle.body.velocity.x = -this.FORCE;
        this.obstacle2.body.velocity.x = -this.FORCE;

        if(this.obstacle.x < 0) {
            this.obstacle.body.x = 1280;
        }

        if(this.obstacle2.x < 0) {
            this.obstacle2.body.x = 1280;
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
