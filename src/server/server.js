/**
 * Created by jonas on 2015-09-08.
 */

var socketio = require('sandbox-io');
log('Loaded sandbox-io', socketio);

var players = 0;
var highScores = [];

socketio.on('connection', function(socket){

	var playerName = '';
	socket.on('playerInfo', function(data){
		players++;

		playerName = data;
		socketio.emit('players', players);
		socket.emit('leaders', highScores);
	});

	socket.on('disconnect', function(){
		players = Math.max(0, players-1);

		socket.broadcast.emit('players', players);
	});

	socket.on('score', function(data){
		players = Math.max(0, players-1);

		highScores.push({ name: playerName, score: data });
		highScores.sort(function(a, b) {
			return b.score - a.score;
		});
		while (highScores.length > 20) {
			highScores.pop();
		}

		socket.broadcast.emit('leaders', highScores);
	});
});