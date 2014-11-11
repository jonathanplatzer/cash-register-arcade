/**
 * @file See {@link CashRegisterArcade.State.Boot}
 * @author Jonathan Platzer <plajoa10@htlkaindorf.at>
 */
var State = namespace('CashRegisterArcade.State');

/**
 * Create a new 'Boot' state
 * @class Boot
 * @classdesc State for the initialization of the game
 * @memberOf CashRegisterArcade.State
 */
State.Boot = function(game) {};

State.Boot.prototype = {
    init: function() {},
    preload: function() {},
    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = this.game.width / 4;
        this.scale.minHeight = this.game.height / 4;
        this.scale.maxWidth = this.game.width * 2;
        this.scale.maxHeight = this.game.height * 2;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);
        this.state.start('preloader');
    }
};
