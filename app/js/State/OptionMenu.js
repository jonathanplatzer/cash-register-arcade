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
    },
    create: function() {
        
        this.game.add.tileSprite(0, 0, 1280, 720, 'background');
        
        this.button_theme = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 180, 'button_theme',this.toggleTheme, this, 1, 0);
        this.button_music = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 10, 'button_music',this.toggleMusic, this, 1, 0);
        this.sprite_music_indicator = this.game.add.sprite(this.game.world.centerX + 180, this.game.world.centerY - 10, 'buttonVoiceIndicator', 0);
        this.button_sound = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 10, 'button_sound',this.toggleSfx, this, 1, 0);
        this.sprite_sfx_indicator = this.game.add.sprite(this.game.world.centerX + 180, this.game.world.centerY + 10, 'buttonVoiceIndicator', 0);
        this.button_back = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 180, 'button_back',this.toMainMenu, this, 1, 0);
        
        this.button_theme.anchor.setTo(0.5, 1);
        this.button_music.anchor.setTo(0.5, 1);
        this.sprite_music_indicator.anchor.setTo(0, 1);
        this.button_sound.anchor.setTo(0.5, 0);
        this.sprite_sfx_indicator.anchor.setTo(0, 0);
        this.button_back.anchor.setTo(0.5, 0);
    },
    update: function() {
    },
    toggleMusic: function()
    {
        this.game.music = !this.game.music;
        
        if(this.game.music) {
            this.sprite_music_indicator.frame = 0;
        }
        else {
            this.sprite_music_indicator.frame = 1;
        }
        
        console.log(this.game.music);
    },
    toggleSfx: function()
    {
        this.game.sfx = !this.game.sfx;
        
        if(this.game.sfx) {
            this.sprite_sfx_indicator.frame = 0;
        }
        else {
            this.sprite_sfx_indicator.frame = 1;
        }
        
        console.log(this.game.sfx);
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
