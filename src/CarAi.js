/**
 * Created by jonas on 2015-08-17.
 */

function CarAi(halfSize, mass, color, color2, personality) {

	this.personality = personality;

	Car.call(this, halfSize, mass, color, color2);


}
CarAi.prototype = Object.create(Car.prototype);
CarAi.prototype.constructor = CarAi;

CarAi.prototype.getAngleToCar = function(targetCar) {
	return Math.atan2(targetCar.position.y - this.position.y, targetCar.position.x - this.position.x) - Math.PI/2;
};

CarAi.prototype.update = function(timeStep) {

	if (this.health > 0) {

		var angleToPlayer;
		if (this.personality === 'circles') {
			this.setSteering(-1);
			this.setThrottle(1);
		}
		else if (this.personality === 'kamikazi') {
			// attack player
			angleToPlayer = this.getAngleToCar(car);
			angleToPlayer = angleToPlayer < 0 ? angleToPlayer + 2 * Math.PI : angleToPlayer;
			angleToPlayer = angleToPlayer > 2 * Math.PI ? angleToPlayer - 2 * Math.PI : angleToPlayer;
			this.angle = this.angle < 0 ? this.angle + 2 * Math.PI : this.angle;
			this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;

			if (Math.abs(this.angle - angleToPlayer) < 0.2) {
				this.setSteering(0);
				this.setThrottle(0.7);
			}
			else if (this.angle > angleToPlayer) {
				this.setSteering(1);
				this.setThrottle(0.5);
			}
			else {
				this.setSteering(-1);
				this.setThrottle(0.5);

			}
		}
		else if (this.personality === 'rearakazi') {
			// attack player
			angleToPlayer = this.getAngleToCar(car) + Math.PI;
			angleToPlayer = angleToPlayer < 0 ? angleToPlayer + 2 * Math.PI : angleToPlayer;
			angleToPlayer = angleToPlayer > 2 * Math.PI ? angleToPlayer - 2 * Math.PI : angleToPlayer;
			this.angle = this.angle < 0 ? this.angle + 2 * Math.PI : this.angle;
			this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;

			if (Math.abs(this.angle - angleToPlayer) < 0.2) {
				this.setSteering(0);
				this.setThrottle(-0.7);
			}
			else if (this.angle > angleToPlayer) {
				this.setSteering(-1);
				this.setThrottle(-0.5);
			}
			else {
				this.setSteering(1);
				this.setThrottle(-0.5);

			}
		}
	}

	Car.prototype.update.call(this, timeStep);

	//svg1.setAttribute('viewBox', (this.position.x - this.rect.width/2 -160/2) + ' ' + (this.position.y - this.rect.height/2 - 120/2) + ' 160 120');

};

