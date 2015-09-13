/**
 * Created by jonas on 2015-08-17.
 */

function CarAi(halfSize, mass, color, color2, personality, bodyType) {

	this.personality = personality;
	this.target = car;
	this.frameCount = 0;

	Car.call(this, halfSize, mass, color, color2, bodyType);


}
CarAi.prototype = Object.create(Car.prototype);
CarAi.prototype.constructor = CarAi;

CarAi.prototype.getAngleToCar = function(targetCar) {
	return Math.atan2(targetCar.position.y - this.position.y, targetCar.position.x - this.position.x) - Math.PI/2;
};

CarAi.prototype.attackTarget = function(direction) {
	// attack player
	var angleToPlayer = this.getAngleToCar(this.target) + (direction < 0 ? Math.PI : 0);
	angleToPlayer = angleToPlayer < 0 ? angleToPlayer + 2 * Math.PI : angleToPlayer;
	angleToPlayer = angleToPlayer > 2 * Math.PI ? angleToPlayer - 2 * Math.PI : angleToPlayer;
	this.angle = this.angle < 0 ? this.angle + 2 * Math.PI : this.angle;
	this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;

	if (Math.abs(this.angle - angleToPlayer) < 0.2) {
		this.setSteering(0);
		this.setThrottle(0.7 * direction);
	}
	else if (this.angle > angleToPlayer) {
		this.setSteering(1 * direction);
		this.setThrottle(0.5 * direction);
	}
	else {
		this.setSteering(-1 * direction);
		this.setThrottle(0.5 * direction);

	}
};


CarAi.prototype.update = function(timeStep) {

	if (this.health > 0) {

		if (this.frameCount % 360 === 0) {
			var newTarget = Math.floor(Math.random() * cars.length);
			if (cars[newTarget] !== this) {
				this.target = cars[newTarget];
			}
		}

		var angleToPlayer;
		if (this.personality === 'circles') {
			this.setSteering(-1);
			this.setThrottle(1);
		}
		else if (this.personality === 'kamikazi') {
			this.attackTarget(1);
		}
		else if (this.personality === 'rearakazi') {
			this.attackTarget(-1);
		}
		else if (this.personality === 'erratic') {
			if (Math.floor(this.frameCount/360) % 2 === 1) {
				this.attackTarget(1);
			}
			else {
				this.attackTarget(-1);
			}
		}
		else if (this.personality === 'stopngo') {
			if (Math.floor(this.frameCount/240) % 2 === 1) {
				this.attackTarget(-1);
			}
		}
	}

	this.frameCount++;

	Car.prototype.update.call(this, timeStep);

	//svg1.setAttribute('viewBox', (this.position.x - this.rect.width/2 -160/2) + ' ' + (this.position.y - this.rect.height/2 - 120/2) + ' 160 120');

};

