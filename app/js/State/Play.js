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
        /*
        //Define movement constants - old
        this.MAX_SPEED = 750;
        this.ACCELERATION = 1500;
        this.FORCE = 500;
        this.DRAG = 800;
        this.GRAVITY = 2600;
        this.JUMP_SPEED = -700;
        */
        
        //Define movement constants
        this.HANDANIMATIONTIME = 2000;
        this.MAX_SPEED = 400;
        this.JUMP_VELOCITY = 27;
        this.SPEED_ADD = 10;
        this.BUYPOINT = 145;
        this.isOnGround = false;
        this.canDoubleJump = true;
        this.isOnObject = false;
        this.isRight = true;
        this.isLeft = false;
        this.LEFTSPEED = 0;
        this.RIGHTSPEED = 0;
        this.obstacles = [];
        
        //Obstacle Spawn Timer
        this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.createObstacle, this);
        
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
        this.player.body.addRectangle();
        this.player.animations.add('run', [0, 1, 2, 3, 4, 5], 20, true);  //Animation geht nach rechts, für umdrehen der seite einfach this.player.scale.x *= -1;
        this.player.animations.add('inair', [6], 20, true);
        this.player.animations.add('stand', [0], 20, true);
        
        this.player.animations.play('run');
                
        //Setting Up Collision        
        this.groundblock = this.game.add.sprite(0 + 640, this.game.height - 36 + 17, 'groundblock'); //P2 anchor is 0.5|0.5 -- x + 640 to set it to x = 0 -- this.game.height - 36 + 17 to center it on the register
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
        
        /*
        var weinflasche = this.game.add.sprite(600, 300, 'weinflasche');
        this.game.physics.p2.enable(weinflasche, true);
        weinflasche.body.fixedRotation  = true;
        weinflasche.body.clearShapes();
        weinflasche.body.addPhaserPolygon('physicsData', 'weinflasche');
        weinflasche.body.collideWorldBounds = false;
        weinflasche.body.setCollisionGroup(this.objectsCollisionGroup);
        weinflasche.body.collides([this.objectsCollisionGroup, this.playerCollisionGroup, this.groundCollisionGroup]);
        */
        /*
        //Additional Testing
        var weinflasche = this.game.add.sprite(600, 300, 'weinflasche');
        this.game.physics.p2.enable(weinflasche, true);
        weinflasche.body.fixedRotation  = true;
        weinflasche.body.clearShapes();
        weinflasche.body.addPhaserPolygon('physicsData', 'weinflasche');
        weinflasche.body.collideWorldBounds = false;
        
        var brot = this.game.add.sprite(900, 300, 'brot');
        this.game.physics.p2.enable(brot, true);
        brot.body.fixedRotation  = true;
        brot.body.clearShapes();
        brot.body.addPhaserPolygon('physicsData', 'brot');
        brot.body.collideWorldBounds = false;
        
        var orangensaft = this.game.add.sprite(1200, 300, 'orangensaft');
        this.game.physics.p2.enable(orangensaft, true);
        orangensaft.body.fixedRotation  = true;
        orangensaft.body.clearShapes();
        orangensaft.body.addPhaserPolygon('physicsData', 'orangensaft');
        orangensaft.body.collideWorldBounds = false;
        */
        
        
        /*
        weinflasche.body.setCollisionGroup(objectsCollisionGroup);
        brot.body.setCollisionGroup(objectsCollisionGroup);
        orangensaft.body.setCollisionGroup(objectsCollisionGroup);
        
        weinflasche.body.collides([objectsCollisionGroup, playerCollisionGroup, groundCollisionGroup]);
        brot.body.collides([objectsCollisionGroup, playerCollisionGroup, groundCollisionGroup]);
        orangensaft.body.collides([objectsCollisionGroup, playerCollisionGroup, groundCollisionGroup]);
        */
        
        
        /*this.ground = this.game.add.group();
        for (var x = -128; x < this.game.width + 128; x += 32) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 36);
            this.game.physics.p2.enable(groundBlock, true);
            groundBlock.body.dynamic = false;
            groundBlock.anchor.setTo(0,0);
            groundBlock.body.x = x;
            groundBlock.body.y = this.game.height - 36;
            this.ground.add(groundBlock);
        }*/
        
        //this.groundblock = this.game.add.sprite(0, this.game.height - 36, 'groundblock');
        //this.game.physics.p2.enable(this.groundblock, true);
        //this.groundblock.body.static = true;
        //this.groundblock.body.clearShapes();
        //this.groundblock.body.addPhaserPolygon('physicsData', 'groundblock');
        
        /*this.groundblock2 = this.game.add.sprite(this.game.width/2, this.game.height - 36, 'groundblock');
        this.game.physics.p2.enable(this.groundblock2, true);
        this.groundblock2.body.dynamic = false;*/
        
        
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
    },
    update: function() {
        /*// Collide the player with the ground
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.player, this.obstacles);

        var isOnGround = this.player.body.touching.down;

        if (this.leftInputIsActive()) {
            // If the LEFT key is down, set the player velocity to move left
            this.player.body.acceleration.x = -this.ACCELERATION;
        } else if (this.rightInputIsActive()) {
            // If the RIGHT key is down, set the player velocity to move right
            this.player.body.acceleration.x = this.ACCELERATION;
        } else {
            this.player.body.acceleration.x = 0;
            if (isOnGround) {
                this.canDoubleJump = true;
            }

        }

        // Set a variable that is true when the player is touching the ground

        if (this.upInputIsActive(5)) {
            if (this.canDoubleJump || isOnGround) {
                // Jump when the player is touching the ground or they can double jump
                this.player.body.velocity.y = this.JUMP_SPEED;

                // Disable ability to double jump if the player is jumping in the air
                if (!isOnGround) {
                    this.canDoubleJump = false;
                }
            }
        }*/
        
        /*
        for (var i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].body.velocity = -this.FORCE;

            if (this.obstacles[i].body.x < -120) {
                this.obstacles.pop(i);
            }
        }*/
        
        //Reset the ability to double jump after player hit the ground
        if(this.isOnGround || this.isOnObject) {
            this.canDoubleJump = true;
            //this.isOnObject = false;
        }
        /*
        if(this.LEFTSPEED === 0 || this.RIGHTSPEED === 0)
        {
            this.player.animations.play('stand');
        }*/
        
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
            /*
            if(!this.isRight)
            {
                this.RIGHTSPEED = 0;
            }
            if(!this.isLeft)
            {
                this.LEFTSPEED = 0;
            }*/
            
            //If player is not moving left or right and |collides with/stands on| an object, set standing animation
            if(this.isOnObject)
            {
                if(this.LEFTSPEED === 0 || this.RIGHTSPEED === 0)
                {
                    this.player.animations.play('stand');
                }
            }
        }
        //console.log(this.player.body.data.velocity[1]);
        if (this.upInputIsActive(3)) {
            if(this.onGroundOrObject || this.canDoubleJump)
            {
                //this.player.body.data.applyForce([0, 1500], [0, 0]);
                this.player.body.data.velocity[1] = this.JUMP_VELOCITY;
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
            /*if(this.isOnGround || this.canDoubleJump || this.isOnObject)
            {
                this.player.body.data.applyForce([0, 1500], [0, 0]);
                
                //First time in this function INTHEGROUND is true
                //After first jump action isOnGround is set to false
                //Next time jump is pressed while being in air canDoubleJump becomes false
                if(this.isOnGround || this.isOnObject)
                {
                    this.player.animations.play('inair');
                }
                else {
                    this.canDoubleJump = false;
                }
                
                this.isOnObject = false;
                this.isOnGround = false;
            }*/
            /*
            if(this.isOnGround || this.canDoubleJump)
            {
                this.player.body.data.applyForce([0, 1500], [0, 0]);
                
                //First time in this function INTHEGROUND is true
                //After first jump action isOnGround is set to false
                //Next time jump is pressed while being in air canDoubleJump becomes false
                if(this.isOnGround)
                {
                    this.isOnGround = false;
                    this.player.animations.play('inair');
                }
                else {
                    this.canDoubleJump = false;
                }
            }
            if(this.isOnObject || this.canDoubleJump)
            {
                console.log("FROMOBJECT" + " CANDOUBLEJUMP " + this.canDoubleJump);
                this.player.body.data.applyForce([0, 1500], [0, 0]);
                
                if(this.isOnObject)
                {
                    console.log("FROMOBJECT" + " CANDOUBLEJUMP " + this.canDoubleJump);
                    this.isOnObject = false;
                    this.player.animations.play('inair');
                }
                else {
                    this.canDoubleJump = false;
                }
            }*/
        }
        
        for (var i = this.obstacles.length - 1; i >= 0; i--) {
            //console.log("INDEX: " + i);
            if(this.obstacles[i].body !== null)
            {
                this.obstacles[i].body.data.velocity[0] = 20;
                
                if (this.obstacles[i].body.x < 0) {
                    this.obstacles[i].destroy();
                    this.obstacles.splice(i, 1);
                }
            }
            else {
                //console.log("ISNULL");
            }
        }
        
        console.log(this.obstacles.length);
        
        //Checks if player got bought = game over
        if(this.player.x < this.BUYPOINT)
        {
            //console.log(this.player.x);
            //this.game.paused = true;
            this.game.state.start('mainMenu');
        }
    },
    createObstacle: function() {
        /*var randomObstacle = {
            body: {
                x: 120
            }
        };
        this.obstacles.push(randomObstacle);*/
        var randomObjectName = this.game.obstacleCatalog[Math.floor(Math.random()*this.game.obstacleCatalog.length)];
        
        var randomObjectSprite = this.game.add.sprite(1200, 300, randomObjectName);
        this.game.physics.p2.enable(randomObjectSprite, false);
        randomObjectSprite.body.fixedRotation  = true;
        randomObjectSprite.body.clearShapes();
        randomObjectSprite.body.addPhaserPolygon('physicsData', randomObjectName);
        randomObjectSprite.body.collideWorldBounds = false;
        
        randomObjectSprite.body.setCollisionGroup(this.objectsCollisionGroup);
        randomObjectSprite.body.collides([this.objectsCollisionGroup, this.playerCollisionGroup, this.groundCollisionGroup]);
        
        this.obstacles.push(randomObjectSprite);
        
        console.log(randomObjectName);
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
    }
};