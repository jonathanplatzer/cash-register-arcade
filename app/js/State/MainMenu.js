/**
 * @file See {@link CashRegisterArcade.State.MainMenu}
 * @author Jonathan Platzer <plajoa10@htlkaindorf.at>
 */
var State = namespace('CashRegisterArcade.State');

/**
 * Create a new 'MainMenu' state
 * @class MainMenu
 * @classdesc State for the main menu of the game
 * @memberOf CashRegisterArcade.State
 */
State.MainMenu = function(game) {};

State.MainMenu.prototype = 
{
    preload: function() 
    {
        this.game.load.image('buttonPlay','/assets/img/buttonPlay.png');
        this.game.load.image('buttonOptionen','/assets/img/buttonOptionen.png');
        this.game.load.image('buttonHighscore','/assets/img/buttonHighscore.png');
    },
    create: function() {
        this.game.stage.backgroundColor = 0xff0000;
        this.buttonPlay = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonPlay', this.startGame, this);
        this.buttonPlay.anchor.setTo(0.5, 2.0);
        this.buttonOptionen = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonOptionen', this.startOptions, this);
        this.buttonOptionen.anchor.setTo(0.5, 0.5);
        this.buttonHighscore = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonHighscore', this.startHighscore, this);
        this.buttonHighscore.anchor.setTo(0.5, -1.0);
    },
    update: function() 
    {        

    },
    startGame: function(pointer) 
    {
        console.log('button click');
        this.state.start('play');
    },
    startOptions: function(pointer) 
    {
        console.log('button click');
        this.state.start('optionMenu');
    },
    startHighscore: function(pointer) 
    {
        console.log('button click');
        this.state.start('highscore');
    }
};
