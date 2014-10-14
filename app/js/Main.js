/**
 * @file Provides the main method of the game
 * @author Jonathan Platzer <plajoa10@htlkaindorf.at>
 */
(
    /**
     * Self-executing method to provide a single entry point.
     */
    function main() {
        // Create the main game object
        var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game');

        // Add the different states to the game
        game.state.add('boot', CashRegisterArcade.State.Boot);
        game.state.add('preloader', CashRegisterArcade.State.Preloader);
        game.state.add('mainMenu', CashRegisterArcade.State.MainMenu);
        game.state.add('optionMenu', CashRegisterArcade.OptionMenu);
        game.state.add('highscore', CashRegisterArcade.Highscore);
        game.state.add('play', CashRegisterArcade.Play);

        // Start
        game.state.start('boot');
    }
)();
