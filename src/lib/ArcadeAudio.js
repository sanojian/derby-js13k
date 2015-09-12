/*
	thanks to  Andrzej Mazur
 */

function ArcadeAudio() {
	this.sounds = {};
}

ArcadeAudio.prototype.add = function( key, count, settings ) {
	this.sounds[ key ] = [];
	settings.forEach( function( elem, index ) {
		this.sounds[ key ].push( {
			tick: 0,
			count: count,
			pool: []
		} );
		for( var i = 0; i < count; i++ ) {
			var audio = new Audio();
			audio.src = jsfxr( elem );
			this.sounds[ key ][ index ].pool.push( audio );
		}
	}, this );
};

ArcadeAudio.prototype.play = function( key ) {
	var sound = this.sounds[ key ];
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	soundData.pool[ soundData.tick ].play();
	soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
};

ArcadeAudio.prototype.loop = function( key ) {
	var sound = this.sounds[ key ];
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	var index = soundData.tick;
	soundData.pool[ index ].loop = true;
	soundData.pool[ index ].play();

	soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;

	return index;
};

ArcadeAudio.prototype.volume = function( key, index, volume ) {
	var sound = this.sounds[ key ];
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	soundData.pool[ index ].volume = volume;
};

ArcadeAudio.prototype.stop = function( key, index ) {
	var sound = this.sounds[ key ];
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	soundData.pool[ index ].loop = false;
};

ArcadeAudio.prototype.speed = function( key, index, speed, throttle ) {
	var sound = this.sounds[ key ];
	var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];

	//soundData.pool[ index ].playbackRate = 0.5 + Math.abs(throttle/5) + (speed > 5 ? (speed > 10 ? 0.1 : 0.5) : 0);
	var speedFactor = 0;
	if (speed > 10)
		speedFactor = 0.4;
	else if (speed > 8)
		speedFactor = 0.3;
	else if (speed > 6)
		speedFactor = 0.2;
	else if (speed > 4)
		speedFactor = 0.15;
	else if (speed > 2)
		speedFactor = 0.1;

	soundData.pool[ index ].playbackRate = 0.5 + Math.abs(throttle/4) + speedFactor*3;
	soundData.pool[ index ].volume = throttle ? 0.4 : 0.25;

	//var playSpeed = speed/4;
	//soundData.pool[ index ].playbackRate = Math.max(0.5, Math.min(3, playSpeed));
	//var volume = (throttle ? 0.4 : 0) + speed/8;
	//soundData.pool[ index ].volume = Math.max(0.5, Math.min(1, volume));

	//soundData.pool[ index ].playbackRate = 0.5 + Math.abs(throttle);
	//soundData.pool[ index ].volume = 0.5;
};
