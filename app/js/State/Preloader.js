/**
 * @file See {@link CashRegisterArcade.State.Preloader}
 * @author Jonathan Platzer <plajoa10@htlkaindorf.at>
 */
var State = namespace('CashRegisterArcade.State');

/**
 * Create a new 'Preloader' state
 * @class Preloader
 * @classdesc State for preloading the assets of the game
 * @memberOf CashRegisterArcade.State
 */
State.Preloader = function(game) {
    this.ready = false;
};

State.Preloader.prototype = {
    preload: function() {
        console.log("Preloader: Preload");
    },
    create: function() {},
    update: function() {
        if(!this.ready) {
            this.ready = true;
            this.state.start('mainMenu');
        }
    }
};
