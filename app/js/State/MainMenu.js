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

State.MainMenu.prototype = {
    preload: function() {},
    create: function() {
        this.game.stage.backgroundColor = 0xff0000;
    },
    update: function() {}
};
