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
State.Preloader = function(game) {};

State.Preloader.prototype = {
    preload: function() {
        this.load.image('loading','/assets/img/loading.png');
    },
    create: function() {
        this.loadingImage = this.game.add.image(0, 0, 'loading');
        this.loadingImage.x = this.game.width / 2 - this.loadingImage.width / 2;
        this.loadingImage.y = this.game.height / 2 - this.loadingImage.height / 2;

        this.loader = new Phaser.Loader(this.game);
        this.loader.onLoadComplete.addOnce(this.loadCompleted, this);

        this.loader.pack('mainMenu','/assets/assetpack.json', null, this);
        this.loader.pack('play','/assets/assetpack.json', null, this);
        this.loader.pack('highscore','/assets/assetpack.json', null, this);
        this.loader.pack('optionMenu','/assets/assetpack.json', null, this);
        
        this.loader.start();
    },
    loadCompleted: function(key) {
        this.state.start('mainMenu');
    },
    update: function() {}
};
