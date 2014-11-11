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
        this.game.load.image('button_theme','/assets/img/theme.png');
        this.game.load.image('button_music','/assets/img/music.png');
        this.game.load.image('button_sound','/assets/img/sound.png');
        this.game.load.image('button_back','/assets/img/back.png');
    },
    create: function() {
        buttons=4;
        space_height=this.game.height/(3*(buttons)+1);
        this.button_theme=this.game.add.button(this.game.width/10,1*space_height,'button_theme',this.toggleTheme);
        this.button_theme.width=this.game.width/(10)*8;
        this.button_theme.height=space_height*2;
        console.log(this.button_theme.height);
        console.log(this.button_theme.y);
        this.button_music=this.game.add.button(this.game.width/10,4*space_height,'button_music',this.toggleMusic);
        this.button_music.width=this.game.width/10*8;
        this.button_music.height=space_height*2;
        this.button_sound=this.game.add.button(this.game.width/10,7*space_height,'button_sound',this.toggleSfx);
        this.button_sound.width=this.game.width/10*8;
        this.button_sound.height=space_height*2;
        this.button_back=this.game.add.button(this.game.width/10,10*space_height,'button_back',this.toMainMenu);
        this.button_back.width=this.game.width/10*8;
        this.button_back.height=space_height*2;
    },
    update: function() {},
    toggleMusic: function()
    {
        if(this.game.music===true){
            this.game.music=false;
        }
        else{
            this.game.music=true;
        }
        console.log(this.game.music);
    },
    toggleSfx: function()
    {
        if(this.game.sfx===true){
            this.game.sfx=false;
        }
        else{
            this.game.sfx=true;
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
