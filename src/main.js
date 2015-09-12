/**
 * Created by jonas on 2015-08-26.
 */


// GLOBALS
var car;
var cars = [];
var walls = [];
var smoke = [];
var smokeCounter = 0;
var texts = [];
var textsCounter = 0;
var fire = [];
var fireCounter = 0;

var curLevel = 0;

var ARENA_WIDTH = 16 * 12;
var ARENA_HEIGHT = 9 * 12;

var svgNS = 'http://www.w3.org/2000/svg';
var svgEffects, healthBar;
var healthBarMaxWidth;
var score = 0;
var scoreText, playersText;
var aa;
var keepPlaying = true;
var loading = false;
var highScores = [];

// check for mobile environment
var hasTouch = !!('ontouchstart' in window);
// enable vibration support
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

var highScoreDiv, splashDiv;

function init() {

	// create muddy background
	generateNoise(document.getElementById('mudCanvas'), ['#D27D2C', '#854C30']);
	initAudio();

	aa.volume('engine', 0, 0.3);
	aa.volume('engine2', 0, 0.3);

	svg1.style.width = innerWidth;
	svg1.style.height = innerHeight;

	highScoreDiv = document.getElementById('divHighScoreEntry');
	highScoreDiv.style.left = (innerWidth/2 - highScoreDiv.offsetWidth/2) + 'px';
	highScoreDiv.style.top = (innerHeight/2 - highScoreDiv.offsetHeight/2) + 'px';

	splashDiv = document.getElementById('divSplash');
	splashDiv.style.left = (innerWidth/2 - splashDiv.offsetWidth/2) + 'px';
	splashDiv.style.top = (innerHeight/2 - splashDiv.offsetHeight/2) + 'px';

	var scaleX = innerWidth / ARENA_WIDTH;
	var scaleY = innerHeight / ARENA_HEIGHT;
	var scale = Math.min(scaleX, scaleY);

	svg1.setAttribute('viewBox', '0 0 ' + ARENA_WIDTH + ' ' + ARENA_HEIGHT);


	// prevent copy paste controls
	document.body.oncopy = function() { return false; };
	document.body.oncut = function() { return false; };
	document.body.onpaste = function() { return false; };

	// wall N
	walls.push(new RigidBody({ x: ARENA_WIDTH / 2, y: 5 }, 10000, true));
	walls[walls.length - 1].position.x = ARENA_WIDTH / 2;
	walls[walls.length - 1].position.y = 5;

	// wall S
	walls.push(new RigidBody({ x: ARENA_WIDTH / 2, y: 5 }, 10000, true));
	walls[walls.length - 1].position.x = ARENA_WIDTH / 2;
	walls[walls.length - 1].position.y = ARENA_HEIGHT - 5;

	// wall W
	walls.push(new RigidBody({ x: 5, y: ARENA_HEIGHT / 2 }, 10000, true));
	walls[walls.length - 1].position.x = 5;
	walls[walls.length - 1].position.y = ARENA_HEIGHT / 2;

	// wall E
	walls.push(new RigidBody({ x: 5, y: ARENA_HEIGHT / 2 }, 10000, true));
	walls[walls.length - 1].position.x = ARENA_WIDTH - 5;
	walls[walls.length - 1].position.y = ARENA_HEIGHT / 2;

	var arena = document.createElementNS(svgNS, "rect");
	arena.setAttribute('width', walls[0].rect.width - 10);
	arena.setAttribute('height', walls[2].rect.height - 10);
	arena.setAttribute('x', 5);
	arena.setAttribute('y', 5);
	arena.setAttribute('rx', 10);
	arena.style.fill = '#D27D2C';
	arena.style.stroke = '#140C1C';
	arena.style.strokeWidth = 10;
	svg1.appendChild(arena);

	addText(walls[0].rect.width / 2, 5.5, 'Mud Bowl Derby', 10, '#DAD45E');


	scoreText = addText( 2 * walls[0].rect.width / 3, walls[2].rect.height - 5, 'Score: ' + score, 8, '#8595A1');

	playersText = addText( 4 * walls[0].rect.width / 5, 6, 'Players: ' + score, 8, '#8595A1');

	var healthBox = document.createElementNS(svgNS, "rect");
	healthBox.setAttribute('width', walls[0].rect.width/3);
	healthBox.setAttribute('height', 8);
	healthBox.setAttribute('x', walls[0].rect.width/6);
	healthBox.setAttribute('y', walls[2].rect.height - 9);
	healthBox.setAttribute('rx', 1);
	healthBox.style.fill = '#D04648';
	healthBox.style.stroke = '#8595A1';
	healthBox.style.strokeWidth = 1;
	svg1.appendChild(healthBox);

	healthBar = document.createElementNS(svgNS, "rect");
	healthBarMaxWidth = walls[0].rect.width/3 - 2;
	healthBar.setAttribute('width', healthBarMaxWidth);
	healthBar.setAttribute('height', 8 - 2);
	healthBar.setAttribute('x', walls[0].rect.width/6 + 1);
	healthBar.setAttribute('y', walls[2].rect.height - 8);
	//healthBar.setAttribute('rx', 1);
	healthBar.style.fill = '#346524';
	healthBar.style.stroke = '#346524';
	healthBar.style.strokeWidth = 1;
	svg1.appendChild(healthBar);


	svgEffects = document.createElementNS (svgNS, "g");
	svg1.appendChild(svgEffects);

	// smoke
	var i;
	for (i=0; i<30; i++) {
		var smokePiece = document.createElementNS (svgNS, "ellipse");
		smokePiece.setAttribute('cx', 0);
		smokePiece.setAttribute('cy', 0);
		smokePiece.setAttribute('rx', 4);
		smokePiece.setAttribute('ry', 4);
		smokePiece.style.fill = 'url(#smoke1)';
		smokePiece.style.opacity = 0;
		svgEffects.appendChild(smokePiece);
		smoke.push({ time: 0, active: false, svg: smokePiece });
	}

	// fire
	for (i=0; i<10; i++) {
		var firePiece = document.createElementNS (svgNS, "ellipse");
		firePiece.setAttribute('cx', 0);
		firePiece.setAttribute('cy', 0);
		firePiece.setAttribute('rx', 4);
		firePiece.setAttribute('ry', 4);
		firePiece.style.fill = 'url(#fire1)';
		firePiece.style.opacity = 0;
		svgEffects.appendChild(firePiece);
		fire.push({ time: 0, active: false, svg: firePiece });
	}

	// texts
	for (i=0; i<10; i++) {
		var dmgText = addText(0, 0, '100', 7, '#8595A1', svgEffects);
		dmgText.style.opacity = 0;
		texts.push({ time: 0, active: false, svg: dmgText, x: 0, y: 0 });
	}

	if (hasTouch) {
		createMobileControls();
	}

	car = new CarPlayer(Vec.divide(new Vec(5, 8), 2), 10, '#597DCE', '#6DC2CA');

	cars.push(car);

	initSteering();
	loadLevel(0);

	try {
		connect();
	} catch (ex) { console.log(ex); }
}

function startGame() {
	loading = true;
	keepPlaying = false;

	score = 0;
	scoreText.childNodes[0].textContent = 'Score: ' + score;
	splashDiv.style.display = 'none';
	// time for old level to unload
	setTimeout(function() {
		loadLevel(1);
	}, 100);
}

function loadLevel(levelId) {

	curLevel = levelId;
	var level = DEF_LEVELS[levelId];

	car.setThrottle(0);
	car.setSteering(0);
	car.setLocation(new Vec(level.position.x, level.position.y), level.position.angle);
	car.dead = false;
	// clear forces
	car.handleCollision();
	car.clearForces();

	var i;
	// clean up existing cars
	for (i=1; i<cars.length; i++) {
		cars[i].kill();
		cars.splice(i,1);
		i--;
	}

	for (i=0; i<level.opponents.length; i++) {
		var aiName = level.opponents[i].ai || 'default';
		var ai = DEFS_AI[aiName];
		var carAi = new CarAi(Vec.divide(new Vec(ai.width, ai.height), 2), ai.mass, ai.color_pri, ai.color_sec, aiName);
		carAi.setThrottle(0);
		carAi.setSteering(0);
		carAi.setLocation(new Vec(level.opponents[i].x, level.opponents[i].y), level.opponents[i].angle);
		cars.push(carAi);
	}

	// move effects to top
	svg1.appendChild(svgEffects);

	loading = false;
	keepPlaying = true;
	requestAnimationFrame(step);

}

function step() {

	var steering = 0;
	var throttle = 0;
	if (!car.dead) {
		if (KEY_LEFT) {
			steering += 1;
		}
		if (KEY_RIGHT) {
			steering -= 1;
		}
		if (KEY_UP) {
			throttle += 1;
		}
		if (KEY_DOWN) {
			throttle -= 1;
		}
	}
	car.setSteering(steering);
	car.setThrottle(throttle);
	if (car.dead || curLevel === 0) {
		aa.stop('engine', 0);
		aa.stop('engine2', 0);
	}
	else if (throttle) {
		aa.stop('engine', 0);
		aa.loop('engine2', 0);
	}
	else {
		aa.stop('engine2', 0);
		aa.loop('engine', 0);

	}

	var i;
	for (i=0; i<cars.length; i++) {
		cars[i].update(20 / 1000);
	}

	// collision
	var pts, impact;
	for (i=0; i<cars.length; i++) {
		var response, collided;
		var p1 = [];
		var p2;
		//for (pts=0; pts<cars[i].svgChassis.pathSegList.length; pts++) {
		for (pts=0; pts<cars[i].polyChassisPoints.length; pts++) {
			//p1.push( new Vec(cars[i].svgChassis.pathSegList[pts].x, cars[i].svgChassis.pathSegList[pts].y ));
			p1.push( new Vec(cars[i].polyChassisPoints[pts].x, cars[i].polyChassisPoints[pts].y ));
			p1[pts].rotate(cars[i].angle);
			p1[pts].x += cars[i].position.x;
			p1[pts].y += cars[i].position.y;
		}

		// walls
		var bDoTest;
		for (var w=0; w<walls.length; w++) {
			// skip if distance too big
			bDoTest = false;
			if (w < 2 && Math.abs(cars[i].position.y -  walls[w].position.y) < 10) {
				bDoTest = true;
			}
			else if (w >= 2 && Math.abs(cars[i].position.x -  walls[w].position.x) < 10) {
				bDoTest = true;
			}
			if (bDoTest) {
				p2 = [
					new Vec(walls[w].position.x + walls[w].rect.x, walls[w].position.y + walls[w].rect.y),
					new Vec(walls[w].position.x + walls[w].rect.x + walls[w].rect.width, walls[w].position.y + walls[w].rect.y),
					new Vec(walls[w].position.x + walls[w].rect.x + walls[w].rect.width, walls[w].position.y + walls[w].rect.y + walls[w].rect.height),
					new Vec(walls[w].position.x + walls[w].rect.x, walls[w].position.y + walls[w].rect.y + walls[w].rect.height)
				];

				collided = checkCollision3(p1, p2);
				if (collided) {
					var normalVec = new Vec(collided.normal.x, collided.normal.y);
					normalVec.normalize();
					impact = applyCollision(
						cars[i],
						walls[w],
						normalVec,
						Vec.multiply(normalVec, collided.overlap),
						p1
					);
					if (Math.abs(impact) > 20) {
						aa.play('damage');
					}

				}
			}

		}

		// other cars
		for (var j=i+1; j<cars.length; j++) {
			// skip if distance too big
			bDoTest = Math.abs(cars[i].position.x -  cars[j].position.x) < 10 && Math.abs(cars[i].position.y -  cars[j].position.y) < 10;
			if (bDoTest) {
				p2 = [];
				for (pts = 0; pts < cars[j].polyChassisPoints.length; pts++) {
					p2.push(new Vec(cars[j].polyChassisPoints[pts].x, cars[j].polyChassisPoints[pts].y));
					p2[pts].rotate(cars[j].angle);
					p2[pts].x += cars[j].position.x;
					p2[pts].y += cars[j].position.y;
				}

				collided = checkCollision3(p1, p2);
				if (collided) {
					impact = applyCollision(
						cars[i],
						cars[j],
						new Vec(collided.normal.x, collided.normal.y),
						Vec.multiply(collided.normal, collided.overlap),
						p1,
						p2
					);
					if (Math.abs(impact) > 20) {
						aa.play('damage');
					}
				}
			}
		}

	}

	animateSmoke();
	animateFire();
	animateText();

	// check if level over
	var carsLeft = 0;
	for (i=1; i<cars.length; i++) {
		if (cars[i].health > 0) {
			carsLeft++;
		}
	}

	if (keepPlaying && !loading && carsLeft === 0) {
		loading = true;
		setTimeout(function() {
			keepPlaying = false;
			setTimeout(function() { loadLevel(2); }, 1000);
		}, 3000);
	}
	else if (keepPlaying && !loading && car.health < 0) {
		loading = true;
		setTimeout(function() {
			handleEndGame();
		}, 3000);
	}

	if (keepPlaying) {
		requestAnimationFrame(step);
	}
}

function handleEndGame() {
	keepPlaying = false;

	var bHighScore = highScores.length ? highScores[highScores.length-1].score < score : true;

	if (bHighScore && !localStorage.derbyPlayerName) {
		highScoreDiv.style.display = 'block';
		return;
	}
	setTimeout(function() {
		try {
			if (bHighScore) {
				socket.emit('score', { name: localStorage.derbyPlayerName, score: score });
			}
			socket.emit('getScores');
		} catch (ex) {
			console.log(ex);
		}
		car.health = 1000;
		healthBar.setAttribute('width', healthBarMaxWidth);
		loadLevel(0);
		splashDiv.style.display = 'block';

	}, 1000);

}