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
        this.state.start('preloader');
    }
};
