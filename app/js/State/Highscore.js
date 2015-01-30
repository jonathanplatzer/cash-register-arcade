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
	test: true,
    
    preload: function() {
	},
    create: function() {
        this.game.add.tileSprite(0, 0, 1280, 720, 'backgroundHighscore');
        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.alpha = 0.9;
        this.apiurl = "http://cra.throughotherey.es/api/highscore";
        
		//Set text style
		this.style = { font: "40px Arial", fill: "#ffffff", align: "center" };
		
		//Add UI elements
		this.buttonBack = this.game.add.button(30, this.game.world.height - 30, 'buttonHighscoreBack', this.onBackToMain , this, 1, 0);
		this.buttonBack.anchor.setTo(0, 1);
		this.buttonUp = this.game.add.button(30, 30, 'buttonHighscoreUp', this.onHighscoreUp , this, 1 ,0);
		this.buttonUp.anchor.setTo(0, 0);
		this.buttonDown = this.game.add.button(30, 210, 'buttonHighscoreDown', this.onHighscoreDown , this, 1, 0);
		this.buttonDown.anchor.setTo(0, 0);
        
        //SFX Init
        this.buttonBack.setOverSound(this.game.buttonoversfx);
        this.buttonUp.setOverSound(this.game.buttonoversfx);
        this.buttonDown.setOverSound(this.game.buttonoversfx);
        this.buttonBack.setDownSound(this.game.buttonselectsfx);
        this.buttonUp.setDownSound(this.game.buttonselectsfx);
        this.buttonDown.setDownSound(this.game.buttonselectsfx);
        
        //Highscore Header-Box
        this.headerGraphics = this.game.add.graphics(0, 0);
        this.headerGraphics.alpha = 0.9;
        this.headerGraphics.beginFill(0x393d3f);
        this.headerGraphics.lineStyle(5, 0x262e33);
        this.headerGraphics.drawRect(230, 38, 1000, 50);
        this.headerGraphics.endFill();
        
        //Highscore Header-Text
		this.highscoreHeaderRank = this.game.add.text(240, 43, "Platz", this.style);
		this.highscoreHeaderPlayer = this.game.add.text(380, 43, "Spielername", this.style);
		this.highscoreHeaderScore = this.game.add.text(1000, 43, "Punkte", this.style);
		
		//Get highscore data
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", this.apiurl, false );
		xmlHttp.send( null );
		this.highscoreData = JSON.parse(xmlHttp.responseText);
		this.highscoreData.sort(this.compare);
		
		this.drawHighscore();
	},
    update: function() {
    },
	
	onBackToMain: function() {
		this.state.start('mainMenu');
	},
	
	onHighscoreUp: function() {
		if(this.untergrenze !== 0)
		{
			this.obergrenze -= 9;
			this.untergrenze -= 9;
		}
		this.removeText();
        this.removeBoxes();
		this.drawHighscore();
	},
	
	onHighscoreDown: function() {
		if(this.obergrenze < this.highscoreData.length)
		{
			this.obergrenze += 9;
			this.untergrenze += 9;
		}
		this.removeText();
        this.removeBoxes();
		this.drawHighscore();
	},
	
	drawHighscore: function() {
		var i;
		var y = 109; //ergibt aus höhe von text + spacing zwischen den einträgen
		this.textData = [];
        this.highscoreElements = []; //#989898
        
		for(i = this.untergrenze; i < this.obergrenze; i++)
		{
			//Wenn nicht 10 Elemente auf einmal angezeigt werden
			if(i >= this.highscoreData.length)
			{
				break;
			}
            //Box
            this.graphics.beginFill(0x393d3f);
            this.graphics.lineStyle(5, 0x262e33);
            this.graphics.drawRect(230, y - 5, 1000, 50);
            this.graphics.endFill();
        
			//"Score: " + this.highscoreData.highscore[i].score
			this.textData.push(this.game.add.text(240, y, (i + 1), this.style));
			this.textData.push(this.game.add.text(380, y, this.highscoreData[i].name, this.style));
			this.textData.push(this.game.add.text(1000, y, this.highscoreData[i].score, this.style));
			y += 66;
		}
	},
	
	removeText: function() {
		this.textData.forEach(function(text) {
			text.destroy();
		});
	},
	removeBoxes: function() {
        this.graphics.destroy(false);
        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.alpha = 0.9;
        
    },
	compare: function (a,b) {
		return b.score - a.score;
	}
};
