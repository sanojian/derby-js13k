/**
 * Created by jonas on 2015-08-17.
 */

function applyCollision(car1, car2, collisionV, overlapV, p1, p2) {

	// separate cars
	if (car2.immovable) {
		car1.position.x -= overlapV.x * 1.1;
		car1.position.y -= overlapV.y * 1.1;
	}
	else {
		car1.position.x -= overlapV.x ;
		car1.position.y -= overlapV.y ;
		car2.position.x += overlapV.x;
		car2.position.y += overlapV.y ;
	}
	// Calculate relative velocity
	var rv = car2.velocity.subtract(car1.velocity);

	// Calculate relative velocity in terms of the normal direction
	//collisionV.normalize();
	var velAlongNormal = rv.dotProduct(collisionV);

	// Calculate restitution
	var e = 0.2;//min( A.restitution, B.restitution)

	// Calculate impulse scalar
	var j = (-(1 + e) * velAlongNormal) / (1 / car1.mass + 1 / car2.mass);

	//console.log(j);
	if (Math.abs(j) < 20) {
		// too small to worry about
		return j;
	}

	// Apply impulse
	var impulse = Vec.multiply(collisionV, j);
	var cp = { x: (car1.position.x - car2.position.x) / 2, y: (car1.position.y - car2.position.y) / 2 };
	var worldCp = { x: (car1.position.x + car2.position.x) / 2, y: (car1.position.y + car2.position.y) / 2 };

	if (car2.immovable) {
		// TODO: better calculation
		// wall
		if (cp.x > cp.y) {
			cp.x = car1.position.x;
		}
		else {
			cp.y = car1.position.y;
		}
	}

	car1.velocity = car1.velocity.subtract(Vec.multiply(impulse, 1 / car1.mass));
	car1.angularVelocity = (cp.x * rv.y - cp.y * rv.x) / (cp.x * cp.x + cp.y * cp.y);
	car1.handleCollision();
	var dmg = j;
	if (car2.immovable && car1 === car) {
		// walls do less damage to player
		dmg = j/50;
	}
	var damage = car1.damagePoint(collisionV, dmg, worldCp, p1);
	if (car1 === car) {
		navigator.vibrate(Math.round(damage));
	}

	if (!car2.immovable) {
		car2.velocity = car2.velocity.add(Vec.multiply(impulse, 1 / car2.mass));
		car2.angularVelocity = (cp.x * -rv.y - cp.y * -rv.x) / (cp.x * cp.x + cp.y * cp.y);
		car2.handleCollision();
		if (car2.health > 0) {
			damage = car2.damagePoint(collisionV, j, worldCp, p2);
			if (car1 === car) {
				score += Math.abs(Math.round(damage));
				scoreText.childNodes[0].textContent = 'Score: ' + score;
				showText(car2.position.x, car2.position.y, -damage.toFixed(0));
			}
		}
	}

	return j;

}

function createGradient(id, stops){
	var svgNS = svg1.namespaceURI;
	var grad  = document.createElementNS(svgNS,'linearGradient');
	grad.setAttribute('id', id);
	grad.setAttribute('x1', '0%');
	grad.setAttribute('y1', '0%');
	grad.setAttribute('x2', '0%');
	grad.setAttribute('y2', '100%');
	grad.setAttribute('gradientUnits', 'objectBoundingBox');


	for (var i=0;i<stops.length;i++) {
		var attrs = stops[i];
		var stop = document.createElementNS(svgNS,'stop');
		for (var attr in attrs){
			if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
		}
		grad.appendChild(stop);
	}

	var defs = svg1.querySelector('defs') ||
		svg1.insertBefore( document.createElementNS(svgNS,'defs'), svg1.firstChild);
	return defs.appendChild(grad);
}

function updateGradient(grad, car) {
	grad.setAttribute('gradientTransform', 'rotate(' + (-car.angle * 180/Math.PI) + ' ' + 0.5 + ' ' + 0.5 + ')');
}

function drawMud() {
	var ctx = mudCanvas.getContext("2d");

	for (var i=0; i<cars.length; i++) {
		ctx.fillStyle = '#854C30';
		ctx.rect(cars[i].position.x * innerWidth/ARENA_WIDTH, cars[i].position.y * innerHeight/ARENA_HEIGHT, 2, 2);
		ctx.stroke();
	}

}

function generateNoise(canvas, colors) {
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = colors[0];
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();
	/*for(var i=0; i<canvas.width; i++) {
		for(var j=0; j<canvas.height; j++) {
			if (Math.random() < 0.5) {
				var num = Math.floor(Math.random() * colors.length);
				ctx.fillStyle = colors[num];
				var r = Math.ceil(Math.random()*3);
				ctx.beginPath();
				ctx.arc(i * 2, j * 2, r, 0, r * Math.PI, false);
				ctx.fill();
			}
		}
	}*/

	//document.body.style.backgroundImage = 'url(' + canvas.toDataURL("image/png") + ')';

}
