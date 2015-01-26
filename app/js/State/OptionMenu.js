/**
 * @file See {@link CashRegisterArcade.State.OptionMenu}
 * @author Andreas Reicher <reiana10@htlkaindorf.at>
 */
var State = namespace('CashRegisterArcade.State');

/**
 * Create a new 'OptionMenu' state
 * @class OptionMenu
 * @classdesc State for the option menu of the game
 * @memberOf CashRegisterArcade.State
 */
State.OptionMenu = function(game) {
};

State.OptionMenu.prototype = {
    preload: function() {
        //Damit die Sound aus/an buttons beim zurückkehren ins menu richtig dargestellt werden.
        if(this.game.music) {
            this.musicFrame = 0;
        }
        else {
            this.musicFrame = 1;
        }
        if(this.game.sfx) {
            this.sfxFrame = 0;
        }
        else {
            this.sfxFrame = 1;
        }
    },
    create: function() {
        this.game.add.tileSprite(0, 0, 1280, 720, 'backgroundOptionMenu');
        
        //Button Init
        this.buttonTheme = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 180, 'buttonTheme',this.toggleTheme, this, 1, 0);
        this.buttonMusic = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 10, 'buttonMusic',this.toggleMusic, this, 1, 0);
        this.sprite_music_indicator = this.game.add.sprite(this.game.world.centerX + 180, this.game.world.centerY - 10, 'buttonVoiceIndicator', this.musicFrame);
        this.buttonSfx = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 10, 'buttonSfx',this.toggleSfx, this, 1, 0);
        this.sprite_sfx_indicator = this.game.add.sprite(this.game.world.centerX + 180, this.game.world.centerY + 10, 'buttonVoiceIndicator', this.sfxFrame);
        this.buttonBack = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 180, 'buttonBack',this.toMainMenu, this, 1, 0);
        
        this.buttonTheme.anchor.setTo(0.5, 1);
        this.buttonMusic.anchor.setTo(0.5, 1);
        this.sprite_music_indicator.anchor.setTo(0, 1);
        this.buttonSfx.anchor.setTo(0.5, 0);
        this.sprite_sfx_indicator.anchor.setTo(0, 0);
        this.buttonBack.anchor.setTo(0.5, 0);
        
        //SFX Init
        this.buttonTheme.setOverSound(this.game.buttonoversfx);
        this.buttonMusic.setOverSound(this.game.buttonoversfx);
        this.buttonSfx.setOverSound(this.game.buttonoversfx);
        this.buttonBack.setOverSound(this.game.buttonoversfx);
        this.buttonTheme.setDownSound(this.game.buttonselectsfx);
        this.buttonMusic.setDownSound(this.game.buttonselectsfx);
        this.buttonSfx.setDownSound(this.game.buttonselectsfx);
        this.buttonBack.setDownSound(this.game.buttonselectsfx);
    },
    update: function() {
    },
    toggleMusic: function()
    {
        this.game.music = !this.game.music;
        
        if(this.game.music) {
            this.sprite_music_indicator.frame = 0;
            this.game.backgroundmusic.volume = 0.5;
        }
        else {
            this.sprite_music_indicator.frame = 1;
            this.game.backgroundmusic.volume = 0;
        }
    },
    toggleSfx: function()
    {
        this.game.sfx = !this.game.sfx;
        
        if(this.game.sfx) {
            this.sprite_sfx_indicator.frame = 0;
            this.game.buttonoversfx.volume = 0.5;
            this.game.buttonselectsfx.volume = 0.5;
        }
        else {
            this.sprite_sfx_indicator.frame = 1;
            this.game.buttonoversfx.volume = 0;
            this.game.buttonselectsfx.volume = 0;
        }
    },
    toggleTheme: function()
    {
        if(isNaN(this.game.theme)){
            this.game.theme=0;
        }
        else{
            this.game.theme++;
        }
        console.log(this.game.theme);
    },
    toMainMenu: function()
    {

        this.game.state.start('mainMenu');
    }
};
