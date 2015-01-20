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
    preload: function() {
        if(this.game.music && !this.game.musicRunning) {
            this.game.backgroundmusic.play();
            this.game.musicRunning = true;
        }
    },
    create: function() {
        this.game.add.tileSprite(0, 0, 1280, 720, 'backgroundMainMenu');
        this.buttonPlay = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonPlay', this.startGame, this, 1, 0);
        this.buttonPlay.anchor.setTo(0.5, 2.0);
        this.buttonOptionen = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonOptionen', this.startOptions, this, 1, 0);
        this.buttonOptionen.anchor.setTo(0.5, 0.5);
        this.buttonHighscore = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonHighscore', this.startHighscore, this, 1, 0);
        this.buttonHighscore.anchor.setTo(0.5, -1.0);
    },
    update: function() 
    {        

    },
    startGame: function(pointer) 
    {
        this.state.start('play');
    },
    startOptions: function(pointer) 
    {
        this.state.start('optionMenu');
    },
    startHighscore: function(pointer) 
    {
        this.state.start('highscore');
    }
};
