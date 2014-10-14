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
        game.state.add('optionMenu', CashRegisterArcade.State.OptionMenu);
        game.state.add('highscore', CashRegisterArcade.State.Highscore);
        game.state.add('play', CashRegisterArcade.State.Play);

        // Start
        game.state.start('boot');
    }
)();
