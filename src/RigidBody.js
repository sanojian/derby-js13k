/**
 * Created by jonas on 2015-08-16.
 *
 * ported from bzroom on http://www.gamedev.net/topic/470497-2d-car-physics-tutorial/
 */

function RigidBody(halfSize, mass, immovable) {
	//linear properties
	this.position = new Vec();
	this.velocity = new Vec();
	this.forces = new Vec();
	this.mass = mass;
	this.immovable = immovable || false;

	//angular properties
	this.angle = 0;
	this.angularVelocity = 0;
	this.torque = 0;

	//graphical properties
	this.halfSize = halfSize;
	this.rect = { x: 0, y: 0, width: 0, height: 0 };

	//store physical parameters
	this.inertia = (1 / 12) * (halfSize.x * halfSize.x) * (halfSize.y * halfSize.y) * mass;

	//generate our viewable rectangle
	this.rect.x = -this.halfSize.x;
	this.rect.y = -this.halfSize.y;
	this.rect.width = this.halfSize.x * 2;
	this.rect.height = this.halfSize.y * 2;
}

RigidBody.prototype.setLocation = function(position, angle)	{
	this.position = position;
	this.angle = angle;
};

RigidBody.prototype.getPosition = function() {
	return this.position;
};

RigidBody.prototype.update = function(timeStep) {
	//integrate physics
	//linear
	var acceleration = Vec.divide(this.forces, this.mass);
	this.velocity = Vec.add(this.velocity, Vec.multiply(acceleration, timeStep));
	this.position = Vec.add(this.position, Vec.multiply(this.velocity, timeStep));
	this.forces = new Vec(0,0); //clear forces

	//angular
	var angAcc = this.torque / this.inertia;
	this.angularVelocity += angAcc * timeStep;
	this.angle += this.angularVelocity * timeStep;
	this.torque = 0; //clear torque
};


//take a relative vector and make it a world vector
RigidBody.prototype.relativeToWorld = function(relative) {

	var vec = new Vec(relative.x, relative.y);

	vec.rotate(this.angle);
	return vec;
};

//take a world vector and make it a relative vector
RigidBody.prototype.worldToRelative = function(world) {
	var vec = new Vec(world.x, world.y);

	vec.rotate(-this.angle);
	return vec;
};

//velocity of a point on body
RigidBody.prototype.pointVel = function(worldOffset) {
	var tangent = new Vec(-worldOffset.y, worldOffset.x);
	return Vec.add(Vec.multiply(tangent, this.angularVelocity), this.velocity);
};

RigidBody.prototype.addForce = function(worldForce, worldOffset) {
	//add linear force
	this.forces = Vec.add(this.forces, worldForce);
	//and it's associated torque
	this.torque += Vec.crossProduct(worldOffset, worldForce);
};

