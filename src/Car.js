/**
 * Created by jonas on 2015-08-17.
 */

function Car(halfSize, mass, color, color2) {

	this.health = 1000;
	this.smokeTimer = 0;

	Vehicle.call(this, halfSize, mass, color);

	this.carId = 'car' + ('' + Math.random()).substring(2);

	this.svgObj = document.createElementNS (svgNS, "g");
	this.svgObj.setAttribute('id', this.carId);
	svg1.appendChild(this.svgObj);

	this.wheelSvgs = [];
	var i;
	for (i=0; i<this.wheels.length; i++) {
		var worldWheelOffset = this.relativeToWorld(this.wheels[i].getAttachPoint());

		this.wheelSvgs[i] = new Line(
			(this.position.x + worldWheelOffset.x),
				(this.position.y + worldWheelOffset.y) - 0.8,
			(this.position.x + worldWheelOffset.x),
				(this.position.y + worldWheelOffset.y) + 1.6,
			'black',
			1
		);
		this.svgObj.appendChild(this.wheelSvgs[i].svgObj);
	}

	var gradientId = 'grad'+ ('' + Math.random()).substring(2);
	this.gradient = createGradient(gradientId,[
		{offset:'30%', 'stop-color': color},
		{offset:'70%','stop-color': color2}
	]);

	this.svgChassis = document.createElementNS (svgNS, "path");
	this.polyChassisPoints = [
		new Vec(this.rect.x + this.rect.width/8,this.rect.y - this.rect.height/8),
		new Vec(this.rect.x,this.rect.y),
		new Vec(this.rect.x, this.rect.y + this.rect.height),
		new Vec(this.rect.x + this.rect.width/4, this.rect.y + 5*this.rect.height/4),
		new Vec(this.rect.x + 3*this.rect.width/4, this.rect.y + 5*this.rect.height/4),
		new Vec(this.rect.x + this.rect.width, this.rect.y + this.rect.height),
		new Vec(this.rect.x + this.rect.width, this.rect.y),
		new Vec(this.rect.x + 7*this.rect.width/8, this.rect.y - this.rect.height/8)
	];
	var path = 'M ' + this.polyChassisPoints[0].x + ',' + this.polyChassisPoints[0].y;
	for (var pts=0; pts<this.polyChassisPoints.length; pts++) {
		path += ' L ' + this.polyChassisPoints[pts].x + ',' + this.polyChassisPoints[pts].y;
	}
	path += ' L ' + this.polyChassisPoints[0].x + ',' + this.polyChassisPoints[0].y;
	this.svgChassis.setAttribute('d', path);

	this.svgChassis.style.fill = 'url(#' + gradientId + ')';
	this.svgChassis.style.stroke = 'black';
	this.svgChassis.style.strokeWidth = 0.25;
	this.svgObj.appendChild(this.svgChassis);

	var cockpit = document.createElementNS (svgNS, "rect");
	cockpit.setAttribute('x', -halfSize.x + 0.25);
	cockpit.setAttribute('y', 0-halfSize.y/2);
	cockpit.setAttribute('width', halfSize.x*2 - 0.5);
	cockpit.setAttribute('height', halfSize.y/1);
	cockpit.setAttribute('rx', 1);
	cockpit.style.fill = 'url(#screen1)';
	cockpit.style.stroke = 'black';
	cockpit.style.strokeWidth = 0.25;
	this.svgObj.appendChild(cockpit);
	var roof = document.createElementNS (svgNS, "rect");
	roof.setAttribute('x', 0-2*halfSize.x/3);
	roof.setAttribute('y', 0-3*halfSize.y/4);
	roof.setAttribute('width', 4*halfSize.x/3);
	roof.setAttribute('height', halfSize.y/1);
	roof.setAttribute('rx', 1);
	roof.style.fill = 'url(#' + gradientId + ')';
	roof.style.stroke = 'black';
	roof.style.strokeWidth = 0.25;
	this.svgObj.appendChild(roof);

	this.brakes = [];
	for (i=0; i<2; i++) {
		this.brakes[i] = document.createElementNS (svgNS, "rect");
		this.brakes[i].setAttribute('x', this.polyChassisPoints[i ? 7 : 0].x + (i ? -1.25 : 0.25));
		this.brakes[i].setAttribute('y', this.polyChassisPoints[i ? 7 : 0].y+0.25);
		this.brakes[i].setAttribute('width', 1);
		this.brakes[i].setAttribute('height', 0.5);
		this.brakes[i].style.fill = '#660000';
		this.svgObj.appendChild(this.brakes[i]);
	}

	this.lights = [];
	for (i=0; i<2; i++) {
		this.lights[i] = document.createElementNS (svgNS, "ellipse");
		this.lights[i].setAttribute('cx', this.polyChassisPoints[i ? 3 : 4].x + (i ? 0.2 : -0.2));
		this.lights[i].setAttribute('cy', this.polyChassisPoints[i ? 3 : 4].y - 0.6);
		this.lights[i].setAttribute('rx', 0.5);
		this.lights[i].setAttribute('ry', 0.3);
		this.lights[i].style.fill = '#DAD45E';
		this.lights[i].style.stroke = 'black';
		this.lights[i].style.strokeWidth = 0.25;
		this.svgObj.appendChild(this.lights[i]);
	}

}
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.kill = function() {
	var thisCar = document.getElementById(this.carId);
	svg1.removeChild(thisCar);
};

Car.prototype.damagePoint = function(collisionV, j, cp, pts) {

	var rotatedCollisionV = Vec.rotate(collisionV, this.angle);
	// find closest point of contact
	var pt = 0;
	var minDist = 10000;
	for (var i=0; i<pts.length; i++) {
		var dist = Math.sqrt(Math.pow(cp.x - pts[i].x, 2) + Math.pow(cp.y - pts[i].y, 2));
		if (dist < minDist) {
			pt = i;
			minDist = dist;
		}
	}
	var damage = 0;
	if (pt === 3 || pt === 4) {
		// front end
		damage = j*4;
	}
	else if (pt === 2 || pt === 5) {
		// sides
		damage = j*1;
	}
	else {
		// rear
		damage = j/4;
	}

	this.health += damage;
	if (this.health < 0 && !this.dead) {
		this.dead = true;
		addFire(this);
		aa.play('bigExplosion');
	}
	return damage;


	/*if (pt === 3) {
		this.lights[0].style.opacity = 0;
	}
	else if (pt === 4) {
		this.lights[1].style.opacity = 0;
	}

	this.polyChassisPoints[pt].x -= rotatedCollisionV.x * j / 100;
	this.polyChassisPoints[pt].y -= rotatedCollisionV.y * j / 100;
	var path = 'M ' + this.polyChassisPoints[0].x + ',' + this.polyChassisPoints[0].y;
	for (var pts=0; pts<this.polyChassisPoints.length; pts++) {
		path += ' L ' + this.polyChassisPoints[pts].x + ',' + this.polyChassisPoints[pts].y;
	}
	path += ' L ' + this.polyChassisPoints[0].x + ',' + this.polyChassisPoints[0].y;
	this.svgChassis.setAttribute('d', path);*/

};

Car.prototype.setThrottle = function(throttle) {

	if (this.oldThrottle !== throttle) {

			for (var i = 0; i < 2; i++) {
				this.brakes[i].style.fill = throttle < 0 ? '#ff0000' : '#660000';
			}

	}
	this.oldThrottle = throttle;
	Vehicle.prototype.setThrottle.call(this, throttle);

};

Car.prototype.update = function(timeStep) {

	if (this.health < 500 && this.smokeTimer < 0) {
		addSmoke(this.position.x, this.position.y);
		if (this.health < 0) {
			this.smokeTimer = 300;
		}
		else if (this.health < 200) {
			this.smokeTimer = 30;
		}
		else {
			this.smokeTimer = 100;
		}
	}
	this.smokeTimer--;

	updateGradient(this.gradient, this);

	Vehicle.prototype.update.call(this, timeStep);

	for (var i=0; i<2; i++) {
		var attachPt = this.wheels[i].getAttachPoint();
		this.wheelSvgs[i].svgObj.setAttribute('transform', 'rotate(' +
			(this.wheels[0].steeringAngle * 180 / Math.PI) + ' ' + (attachPt.x + 0.5) + ' ' + (attachPt.y + 0.8) + ')');
	}

	this.svgObj.setAttribute('transform', 'translate (' + this.position.x + ' ' + this.position.y + ') rotate(' +
	(this.angle * 180 / Math.PI) + ' ' + 0 + ' ' + 0 + ')');


	//svg1.setAttribute('viewBox', (this.position.x - this.rect.width/2 -160/2) + ' ' + (this.position.y - this.rect.height/2 - 120/2) + ' 160 120');

};

Car.prototype.checkBounds = function() {
	/*if (this.position.x + this.rect.width > innerWidth || this.position.x < this.rect.width) {
		this.velocity.x = -3*this.velocity.x/4;
	}
	if (this.cy + this.r > innerHeight || this.cy < this.r) {
		this.velocity.y = -3*this.velocity.y/4;
		this.setPosition(this.cx, Math.min(innerHeight - this.r, this.cy));
	}*/
};
