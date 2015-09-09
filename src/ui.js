/**
 * Created by jonas on 2015-08-15.
 */

var KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SPACE;

function initSteering() {
	document.onkeydown = function(e) {
		switch (e.keyCode) {
			case 37:
				KEY_LEFT = true;
				break;
			case 38:
				KEY_UP = true;
				break;
			case 39:
				KEY_RIGHT = true;
				break;
			case 32:
				KEY_SPACE = true;
				break;
			case 40:
				KEY_DOWN = true;
				break;
		}
	};
	document.onkeyup = function(e) {
		switch (e.keyCode) {
			case 37:
				KEY_LEFT = false;
				break;
			case 38:
				KEY_UP = false;
				break;
			case 39:
				KEY_RIGHT = false;
				break;
			case 32:
				KEY_SPACE = false;
				break;
			case 40:
				KEY_DOWN = false;
				break;
		}
	};
}

function createMobileControls() {

	function createArrow(x, y, rotation, overHandler, outHandler) {
		var arrow = document.createElementNS(svgNS, 'path');
		arrow.style.fill = '#DAD45E';
		arrow.style.stroke = '#4E4A4E';
		arrow.style.strokeWidth = 1;
		arrow.style.opacity = 0.6;
		arrow.setAttribute('d', 'M 0,40 L 20,0 L 40,40 z');
		arrow.setAttribute('stroke-linejoin', 'round');
		arrow.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + rotation + ' 20 20)');
		arrow.addEventListener('touchstart', overHandler);
		arrow.addEventListener('touchend', outHandler);

		svg1.appendChild(arrow);
	}

	var arenaScale = ARENA_WIDTH / ARENA_HEIGHT;
	var screenScale = innerWidth / innerHeight;
	var edgeX = 0;
	if (screenScale > arenaScale) {
		edgeX = (screenScale - arenaScale) * ARENA_WIDTH / 4;
	}

	createArrow(-edgeX, 20, 0, function(evt) { KEY_UP = true; evt.preventDefault(); }, function (evt) { KEY_UP = false; evt.preventDefault(); });
	createArrow(-edgeX, 70, 180, function(evt) { KEY_DOWN = true; evt.preventDefault(); }, function (evt) { KEY_DOWN = false; evt.preventDefault(); });

	createArrow(ARENA_WIDTH-40+edgeX, 70, 90, function(evt) { KEY_RIGHT = true; evt.preventDefault(); }, function (evt) { KEY_RIGHT = false; evt.preventDefault(); });
	createArrow(ARENA_WIDTH-90+edgeX, 70, 270, function(evt) { KEY_LEFT = true; evt.preventDefault(); }, function (evt) { KEY_LEFT = false; evt.preventDefault(); });
}

function addText(x, y, val, fontSize, color, parentNode) {
	var newText = document.createElementNS(svgNS, 'text');
	newText.setAttributeNS(null, 'x', x);
	newText.setAttributeNS(null, 'y', y);
	newText.setAttributeNS(null, 'fill', color);
	newText.setAttributeNS(null, 'font-size', fontSize);
	newText.setAttributeNS(null, 'text-anchor', 'middle');
	newText.setAttributeNS(null, 'alignment-baseline', 'middle');
	newText.setAttributeNS(null, 'font-family', 'Impact, Charcoal, sans-serif');

	var textNode = document.createTextNode(val);
	newText.appendChild(textNode);
	(parentNode || svg1).appendChild(newText);

	return newText;
}

function showText(x, y, text) {
	var nextText = texts[textsCounter];
	textsCounter = (textsCounter + 1) % texts.length;
	nextText.time = 0;
	nextText.active = true;
	nextText.svg.childNodes[0].textContent = text;
	nextText.svg.setAttribute('x', x);
	nextText.svg.setAttribute('y', y);
	nextText.x = x;
	nextText.y = y;
	nextText.svg.style.opacity = 1;
}

function animateText() {
	for (var i=0; i<texts.length; i++) {
		if (texts[i].active) {
			texts[i].time++;
			if (texts[i].time < 80) {
				texts[i].y -= 3 / (texts[i].time || 1);
				texts[i].svg.setAttribute('y', Math.max(2, texts[i].y));
			}
			else {
				texts[i].active = false;
				texts[i].svg.style.opacity = 0;
			}
		}
	}
}


function animateSmoke() {
	for (var i=0; i<smoke.length; i++) {
		if (smoke[i].active) {
			smoke[i].time++;
			if (smoke[i].time < 100) {
				smoke[i].svg.setAttribute('rx', 1 + smoke[i].time * 0.1);
				smoke[i].svg.setAttribute('ry', 1 + smoke[i].time * 0.1);
				smoke[i].svg.style.opacity = 1 - (smoke[i].time/120);
			}
			else {
				smoke[i].active = false;
				smoke[i].svg.style.opacity = 0;
			}
		}
	}
}

function addSmoke(x, y) {
	var nextSmoke = smoke[smokeCounter];
	smokeCounter = (smokeCounter + 1) % smoke.length;
	nextSmoke.time = 0;
	nextSmoke.active = true;
	nextSmoke.svg.setAttribute('cx', x);
	nextSmoke.svg.setAttribute('cy', y);
	nextSmoke.svg.setAttribute('rx', 1);
	nextSmoke.svg.setAttribute('ry', 1);
	nextSmoke.svg.style.opacity = 1;
}

function animateFire() {
	for (var i=0; i<fire.length; i++) {
		if (fire[i].active) {
			fire[i].time += 4;
			if (fire[i].time < 100) {
				fire[i].svg.setAttribute('cx', fire[i].target.position.x);
				fire[i].svg.setAttribute('cy', fire[i].target.position.y);
				fire[i].svg.setAttribute('rx', 1 + fire[i].time * 0.1);
				fire[i].svg.setAttribute('ry', 1 + fire[i].time * 0.1);
				fire[i].svg.style.opacity = 1 - (fire[i].time/1200);
			}
			else {
				fire[i].active = false;
				fire[i].svg.style.opacity = 0;
			}
		}
	}
}

function addFire(target) {
	var nextFire = fire[fireCounter];
	fireCounter = (fireCounter + 1) % fire.length;
	nextFire.time = 0;
	nextFire.target = target;
	nextFire.active = true;
	nextFire.svg.setAttribute('cx', target.position.x);
	nextFire.svg.setAttribute('cy', target.position.y);
	nextFire.svg.setAttribute('rx', 2);
	nextFire.svg.setAttribute('ry', 2);
	nextFire.svg.style.opacity = 1;
}

function goFullScreen() {
	// go full-screen
	if (svg1.requestFullscreen) {
		svg1.requestFullscreen();
	} else if (svg1.webkitRequestFullscreen) {
		svg1.webkitRequestFullscreen();
	} else if (svg1.mozRequestFullScreen) {
		svg1.mozRequestFullScreen();
	} else if (svg1.msRequestFullscreen) {
		svg1.msRequestFullscreen();
	}
}