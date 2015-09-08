/**
 * Created by jonas on 2015-09-08.
 */

var socket = {};
var connected = false;
var playerName = 'Player '+Math.random().toString().replace(/.*\./,'');

function connect() {
	connected = true;
	console.log('connecting');
	if (!socket.connected) socket = io(document.location.href);
	socket.on('leaders', showLeaders);
	socket.on('players', showPlayers);
	socket.on('disconnect', onDisconnect);
	socket.emit('playerInfo', playerName );
}

function showLeaders(data) {
	highScores = data;
	console.log(data);
}

function showPlayers(data) {
	playersText.childNodes[0].textContent = 'Players: ' + data;
}

function postHighScore(input) {

}

function onDisconnect() {

}