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
        this.load.onFileError.addOnce(this.fileError, this);

        //Loader Error Image
        this.load.image('loaderError','assets/img/loaderError.png');
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
        var keyF9 = this.game.input.keyboard.addKey(Phaser.Keyboard.F9);
        keyF9.onDown.add(this.continueStart, this);

        if (!this.error) {
            this.loadingImage = this.game.add.image(0, 0, 'loading');
            this.loadingImage.anchor.setTo(0.5, 0.5);
            this.loadingImage.x = this.game.width / 2;
            this.loadingImage.y = this.game.height / 2;
        }

        //Loads the assetpack
        this.loader = new Phaser.Loader(this.game);
        this.loader.onLoadComplete.addOnce(this.loadCompleted, this);
        this.loader.onFileError.addOnce(this.fileError, this);
        this.loader.pack('mainMenu', 'assets/assetpack.json', null, this);
        this.loader.pack('play', 'assets/assetpack.json', null, this);
        this.loader.pack('highscore',' assets/assetpack.json', null, this);
        this.loader.pack('optionMenu', 'assets/assetpack.json', null, this);
        this.loader.start();
        
        //ObstacleCatalog
        this.game.obstacleCatalog = JSON.parse(this.game.cache.getText('obstacleCatalogFile'));
        
        //Music Init
        this.game.backgroundmusic = this.add.audio('backgroundMusic');
        this.game.backgroundmusic.volume = 1;
        this.game.backgroundmusic.loop = true;
        this.game.musicRunning = false;
        this.game.music = true;
        this.game.sfx = true;

        this.game.defaultSfxStatusChangeHandler = function(status) {
            if (status) {
                this.volume = this.defaultVolume;
            } else {
                this.volume = 0;
            }
        };

        //Event for SFX status changes
        this.game.onSfxStatusChange = new Phaser.Signal();

        //SFX Init
        this.game.buttonoversfx = this.add.audio('buttonoversfx', 1);
        this.game.buttonoversfx.defaultVolume = 1;
        this.game.onSfxStatusChange.add(this.game.defaultSfxStatusChangeHandler, this.game.buttonoversfx);

        this.game.buttonselectsfx = this.add.audio('buttonselectsfx', 1);
        this.game.buttonselectsfx.defaultVolume = 1;
        this.game.onSfxStatusChange.add(this.game.defaultSfxStatusChangeHandler, this.game.buttonselectsfx);
    },
    loadCompleted: function(key) {
        this.completed = true;
        if (!this.error || this.ignoreError) {
            this.state.start('mainMenu');
        }
    },
    fileError: function (key) {
        if (!this.error && !this.ignoreError) {
            if (key === 'loaderError') {
                this.errorError = true;
            } else {
                this.loadingImage.destroy();

                this.game.stage.backgroundColor = 0xAAAAAA;

                if (!this.errorError) {
                    var loaderErrorImage = this.game.add.image(this.game.width / 2, 20, 'loaderError');
                    loaderErrorImage.anchor.setTo(0.5, 0);
                } else {
                    var triangle = this.game.add.text(this.game.width / 2, 20, "⚠", { font: "300px sans-serif", fill: "#a00000", align: "center" });
                    triangle.anchor.setTo(0.5, 0);
                }

                var text1 = this.game.add.text(this.game.width / 2, 400, "Ein Fehler ist aufgetreten.", { font: "48px sans-serif", fill: "#000000", align: "center" });
                text1.anchor.setTo(0.5, 0);

                var text2 = this.game.add.text(this.game.width / 2, 460, "Es gab ein Problem beim Laden der Inhalte.\nDies kann durch Netzwerkprobleme oder Serverfehler passieren.", { font: "36px sans-serif", fill: "#000000", align: "center" });
                text2.anchor.setTo(0.5, 0);

                var text3 = this.game.add.text(this.game.width / 2, 600, "Versuche bitte, die Seite neu zu laden.", { font: "48px sans-serif", fill: "#000000", align: "center" });
                text3.anchor.setTo(0.5, 0);

                var text4 = this.game.add.text(this.game.width / 2, 660, "Oder drücke F9 um auf eigene Gefahr fortzufahren.", { font: "24px sans-serif", fill: "#000000", align: "center" });
                text4.anchor.setTo(0.5, 0);
                
                this.error = true;
            }
        }
    },
    continueStart: function () {
        if (this.completed) {
            this.state.start('mainMenu');
        } else {
            this.ignoreError = true;
            this.game.add.text(20, 20, "Ignoriere Fehler", { font: "48px sans-serif", fill: "#ffffff", align: "left" });
        }
    },
    update: function() {}
};
