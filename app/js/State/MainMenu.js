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
        //Starts the music when the music is not already running
        if(this.game.music && !this.game.musicRunning) {
            this.game.backgroundmusic.play();
            this.game.musicRunning = true;
        }
    },
    create: function() {
        //Button Init
        this.game.add.tileSprite(0, 0, 1280, 720, 'backgroundMainMenu');
        this.buttonPlay = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonPlay', this.startGame, this, 1, 0);
        this.buttonPlay.anchor.setTo(0.5, 2.0);
        this.buttonOptionen = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonOptionen', this.startOptions, this, 1, 0);
        this.buttonOptionen.anchor.setTo(0.5, 0.5);
        this.buttonHighscore = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttonHighscore', this.startHighscore, this, 1, 0);
        this.buttonHighscore.anchor.setTo(0.5, -1.0);
        
        //Set the SFX for buttons
        this.buttonPlay.setOverSound(this.game.buttonoversfx);
        this.buttonOptionen.setOverSound(this.game.buttonoversfx);
        this.buttonHighscore.setOverSound(this.game.buttonoversfx);
        this.buttonPlay.setDownSound(this.game.buttonselectsfx);
        this.buttonOptionen.setDownSound(this.game.buttonselectsfx);
        this.buttonHighscore.setDownSound(this.game.buttonselectsfx);
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
