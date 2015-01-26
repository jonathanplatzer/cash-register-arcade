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
        //Loading Image
        this.load.image('loading','assets/img/loading.png');
        //Audio
        this.load.audio('backgroundMusic', 'assets/sfx/backgroundMusic.ogg');
        this.load.audio('buttonoversfx', 'assets/sfx/button_over.ogg');
        this.load.audio('buttonselectsfx', 'assets/sfx/button_select.ogg');
        //ObstacleCatalog
        this.load.text('obstacleCatalogFile', 'assets/obstaclecatalog.json');
    },
    create: function() {
        this.loadingImage = this.add.image(0, 0, 'loading');
        this.loadingImage.x = this.game.width / 2 - this.loadingImage.width / 2;
        this.loadingImage.y = this.game.height / 2 - this.loadingImage.height / 2;

        //Loads the assetpack
        this.loader = new Phaser.Loader(this.game);
        this.loader.onLoadComplete.addOnce(this.loadCompleted, this);
        this.loader.pack('mainMenu', 'assets/assetpack.json', null, this);
        this.loader.pack('play', 'assets/assetpack.json', null, this);
        this.loader.pack('highscore',' assets/assetpack.json', null, this);
        this.loader.pack('optionMenu', 'assets/assetpack.json', null, this);
        this.loader.start();
        
        //ObstacleCatalog
        this.game.obstacleCatalog = JSON.parse(this.game.cache.getText('obstacleCatalogFile'));
        
        //Music Init
        this.game.backgroundmusic = this.add.audio('backgroundMusic');
        this.game.backgroundmusic.volume = 0.5;
        this.game.backgroundmusic.loop = true;
        this.game.musicRunning = false;
        this.game.music = true;
        this.game.sfx = true;
        
        //SFX Init
        this.game.buttonoversfx = this.add.audio('buttonoversfx');
        this.game.buttonselectsfx = this.add.audio('buttonselectsfx');
        this.game.buttonoversfx.volume = 0.5;
        this.game.buttonselectsfx.volume = 0.5;
    },
    loadCompleted: function(key) {
        this.state.start('mainMenu');
    },
    update: function() {}
};
