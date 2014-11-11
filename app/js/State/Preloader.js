/**
 * @file See {@link CashRegisterArcade.State.Preloader}
 * @author Michael Ehrenreich <ehrmia10@htlkaindorf.at>
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
        this.load.image('loading','/assets/img/loading.png');
    },
    create: function() {
        this.loadingImage = this.game.add.image(0, 0, 'loading');
        this.loadingImage.x = this.game.width / 2 - this.loadingImage.width / 2;
        this.loadingImage.y = this.game.height / 2 - this.loadingImage.height / 2;
        
        game.time.events.add(Phaser.Timer.SECOND * 2, testComplete, this);
    },
    testComplete: function() {
        this.ready = true;
    },
    update: function() {
        if (this.ready) {
            this.state.start('mainMenu');
        }
    }
};
