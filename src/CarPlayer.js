/**
 * Created by jonas on 2015-08-17.
 */

function CarPlayer(halfSize, mass, color, color2) {

	Car.call(this, halfSize, mass, color, color2);

	//this.audioIndex = aa.loop('engine');

}
CarPlayer.prototype = Object.create(Car.prototype);
CarPlayer.prototype.constructor = CarPlayer;

CarPlayer.prototype.update = function(timeStep) {

	//aa.speed('engine', this.audioIndex, this.velocity.getMagnitude() / 5, this.oldThrottle || 0 );

	Car.prototype.update.call(this, timeStep);

	//svg1.setAttribute('viewBox', (this.position.x - this.rect.width/2 -160/2) + ' ' + (this.position.y - this.rect.height/2 - 120/2) + ' 160 120');
	//svg1.setAttribute('viewBox', (this.position.x - this.rect.width/2 -ARENA_WIDTH/2) + ' ' + (this.position.y - this.rect.height/2 - ARENA_HEIGHT/2) + ' ' + ARENA_WIDTH + ' ' + ARENA_HEIGHT);

};

CarPlayer.prototype.damagePoint = function(collisionV, j, cp, pts) {

	Car.prototype.damagePoint.call(this, collisionV, j, cp, pts);

	healthBar.setAttribute('width', Math.max(0, (this.health/1000) * healthBarMaxWidth));

};
