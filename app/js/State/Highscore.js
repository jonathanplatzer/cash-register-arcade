/**
 * @file See {@link CashRegisterArcade.State.Highscore}
 * @author Michael Wahlhütter <wahmia10@htlkaindorf.at>
 */
var State = namespace('CashRegisterArcade.State');

/**
 * Create a new 'Highscore' state
 * @class Highscore
 * @classdesc State for the highscore display of the game
 * @memberOf CashRegisterArcade.State
 */
State.Highscore = function(game) {};

State.Highscore.prototype = {
	untergrenze: 0,
	obergrenze: 9,
	
    preload: function() {
		this.game.load.image('buttonBack','/assets/img/buttonHighscoresBack.png');
		this.game.load.image('buttonUp','/assets/img/buttonHighscoresUp.png');
		this.game.load.image('buttonDown','/assets/img/buttonHighscoresDown.png');
	},
    create: function() {
		//Set text style
		this.style = { font: "40px Arial", fill: "#000000", align: "center" };
		
		//Add UI elements
		this.buttonBack = this.game.add.button(30, this.game.world.height - 30, 'buttonBack', this.onBackToMain , this);
		this.buttonBack.anchor.setTo(0, 1);
		this.buttonUp = this.game.add.button(30, 30, 'buttonUp', this.onHighscoreUp , this);
		this.buttonUp.anchor.setTo(0, 0);
		this.buttonDown = this.game.add.button(30, 210, 'buttonDown', this.onHighscoreDown , this);
		this.buttonDown.anchor.setTo(0, 0);
		this.highscoreHeaderRank = this.game.add.text(240, 40, "Platz", this.style);
		this.highscoreHeaderPlayer = this.game.add.text(380, 40, "Spielername", this.style);
		this.highscoreHeaderScore = this.game.add.text(1000, 40, "Punkte", this.style);
		
		//Get highscore data
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", "/api/highscore/", false );
		xmlHttp.send( null );
		this.highscoreData = JSON.parse(xmlHttp.responseText);
		this.highscoreData.highscore.sort(this.compare);
		
		this.drawHighscore();
	},
    update: function() {},
	
	onBackToMain: function() {
		this.state.start('mainMenu');
	},
	
	onHighscoreUp: function() {
		console.log('highscoreUp');
		
		if(this.untergrenze !== 0)
		{
			this.obergrenze -= 9;
			this.untergrenze -= 9;
		}
		this.removeText();
		this.drawHighscore();
	},
	
	onHighscoreDown: function() {
		console.log('highscoreDown');
		
		if(this.obergrenze < this.highscoreData.highscore.length)
		{
			this.obergrenze += 9;
			this.untergrenze += 9;
		}
		this.removeText();
		this.drawHighscore();
	},
	
	drawHighscore: function() {
		var i;
		var y = 106;
		this.textData = [];
		for(i = this.untergrenze; i < this.obergrenze; i++)
		{
			//Wenn nicht 10 Elemente auf einmal angezeigt werden
			if(i >= this.highscoreData.highscore.length)
			{
				break;
			}
			//"Score: " + this.highscoreData.highscore[i].score
			this.textData.push(this.game.add.text(240, y, (i + 1), this.style));
			this.textData.push(this.game.add.text(380, y, this.highscoreData.highscore[i].player, this.style));
			this.textData.push(this.game.add.text(1000, y, this.highscoreData.highscore[i].score, this.style));
			y += 66;
		}
	},
	
	removeText: function() {
		this.textData.forEach(function(text) {
			text.destroy();
		});
	},
	
	compare: function (a,b) {
		return b.score-a.score;
	}
};
