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
        this.game.load.image('player', '/assets/img/player.png');
    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#000000';
        this.game.physics.arcade.gravity.y = 500;
        player = this.game.add.sprite(1000, 500, 'player');
        player.scale.setTo(0.1875);
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.bounce.y = 0.25;
        player.body.collideWorldBounds = true;
        //player.body.setSize(20, 32, 5, 16);
        //this.game.camera.follow(player);
        player.accelerationX=0;
        player.accelerationY=0;
        acceleration=20;
        deceleration=10;
        worldVelocity=-15;
        jumpSpeed=-600;
        player.maxVelocity=75;

        cursors = this.game.input.keyboard.createCursorKeys();

        keyEsc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        keyEsc.onDown.add(this.backToMain, this);
    },
    update: function() {
        player.accelerationX=0;
        if (cursors.left.isDown)
        {
            player.accelerationX = -acceleration;
            if(player.body.onFloor())
            {
                player.accelerationX +=worldVelocity;
            }
            else{
                player.accelerationX/=deceleration;
            }
        }
        else if (cursors.right.isDown)
        {
            player.accelerationX = acceleration;
            if(player.body.onFloor())
            {
                player.accelerationX +=worldVelocity;
            }
            else{
                player.accelerationX/=deceleration;
            }
        }
        else if(player.body.onFloor())
        {
            player.accelerationX=player.body.velocity.x/-deceleration+worldVelocity;
            
        }

        if (cursors.up.isDown && player.body.onFloor())
        {
            player.body.velocity.y = jumpSpeed;
        }
        player.body.velocity.x=player.body.velocity.x+player.accelerationX;
        if(player.body.x<1){

            /*Do something usefull*/
            console.log("DEATH");

        }
    },
    backToMain:function(){
        this.game.state.start('mainMenu');
    }
};
