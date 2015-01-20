/* Define custom server-side HTTP routes for lineman's development server
 *   These might be as simple as stubbing a little JSON to
 *   facilitate development of code that interacts with an HTTP service
 *   (presumably, mirroring one that will be reachable in a live environment).
 *
 * It's important to remember that any custom endpoints defined here
 *   will only be available in development, as lineman only builds
 *   static assets, it can't run server-side code.
 *
 * This file can be very useful for rapid prototyping or even organically
 *   defining a spec based on the needs of the client code that emerge.
 *
 */

module.exports = {
  drawRoutes: function(app) {
    app.get('/api/highscore/', function(req, res){
		res.json( {
		highscore: [
			{ player: "fag_nr.1", score: 3242},
			{ player: "fag_nr.2", score: 343},
			{ player: "fag_nr.3", score: 68},
			{ player: "fag_nr.5", score: 32642},
			{ player: "fag_nr.4", score: 678},
			{ player: "fag_nr.6", score: 908},
			{ player: "fag_nr.7", score: 234},
			{ player: "fag_nr.8", score: 567},
			{ player: "fag_nr.9", score: 345},
			{ player: "fag_nr.0", score: 577},
			{ player: "fag_nr.10", score: 384},
			{ player: "fag_nr.11", score: 3242},
			{ player: "fag_nr.12", score: 45},
			{ player: "fag_nr.13", score: 67},
			{ player: "fag_nr.18", score: 666},
			{ player: "fag_nr.17", score: 45646},
			{ player: "fag_nr.16", score: 657576},
			{ player: "fag_nr.151", score: 3242},
			{ player: "fag_nr.141", score: 657657},
			{ player: "fag_nr.113", score: 3242},
			{ player: "fag_nr.127", score: 45},
			{ player: "fag_nr.136", score: 67},
			{ player: "fag_nr.182", score: 666},
			{ player: "fag_nr.173", score: 45646},
			{ player: "fag_nr.169", score: 657576},
			{ player: "fag_nr.152", score: 3242},
			{ player: "fag_nr.140", score: 657657},
			{ player: "fag_nr.222", score: 123}
		]});
    });
  }
};