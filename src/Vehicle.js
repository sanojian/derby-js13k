/**
 * Created by jonas on 2015-08-16.
 *
 * ported from tutorial by bzroom on http://www.gamedev.net/topic/470497-2d-car-physics-tutorial/
 */

function Wheel(position, radius) {

	this.forwardAxis = new Vec(0, 1);
	this.sideAxis = new Vec(-1, 0);
	this.steeringAngle = 0;

	this.wheelTorque = 0;
	this.position = position;
	this.setSteeringAngle(0);
	this.wheelSpeed = 0;
	this.wheelRadius = radius;
	this.wheelInertia = radius * radius; //fake value

}

Wheel.prototype.setSteeringAngle = function(newAngle) {
	this.steeringAngle = newAngle;

	//foward vector
	this.forwardAxis.x = 0;
	this.forwardAxis.y = 1;
	//side vector
	this.sideAxis.x = -1;
	this.sideAxis.y = 0;

	this.forwardAxis.rotate(newAngle);
	this.sideAxis.rotate(newAngle);
};

Wheel.prototype.addTransmissionTorque = function(newValue) {
	this.wheelTorque += newValue;
};

Wheel.prototype.getWheelSpeed = function() {
	return this.wheelSpeed;
};

Wheel.prototype.getAttachPoint = function() {
	return this.position;
};

Wheel.prototype.calculateForce = function(relativeGroundSpeed, timeStep) {
	//calculate speed of tire patch at ground
	var patchSpeed = Vec.multiply(Vec.reverse(this.forwardAxis), this.wheelSpeed * this.wheelRadius);

	//get velocity difference between ground and patch
	var velDifference = Vec.add(relativeGroundSpeed, patchSpeed);

	//project ground speed onto side axis
	var sideVel = velDifference.project(this.sideAxis);
	var projForward = velDifference.project(this.forwardAxis);
	var forwardMag = projForward.mag;
	var forwardVel = projForward.vec;

	//calculate super fake friction forces
	//calculate response force
	var responseForce = Vec.multiply(Vec.reverse(sideVel.vec), 4);
	responseForce = Vec.subtract(responseForce, forwardVel);

	//calculate torque on wheel
	this.wheelTorque += forwardMag * this.wheelRadius;

	//integrate total torque into wheel
	this.wheelSpeed += (this.wheelTorque / this.wheelInertia) * timeStep;

	//clear our transmission torque accumulator
	this.wheelTorque = 0;

	//return force acting on body
	return responseForce;
};


//our vehicle object
function Vehicle(halfSize, mass, color) {

	RigidBody.call(this, halfSize, mass);

    this.wheels = [];

	//front wheels
	this.wheels[0] = new Wheel(new Vec(halfSize.x, halfSize.y), 0.5);
	this.wheels[1] = new Wheel(new Vec(-halfSize.x, halfSize.y), 0.5);

	//rear wheels
	this.wheels[2] = new Wheel(new Vec(halfSize.x, -halfSize.y), 0.5);
	this.wheels[3] = new Wheel(new Vec(-halfSize.x, -halfSize.y), 0.5);

}
Vehicle.prototype = Object.create(RigidBody.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.handleCollision = function() {
	for (var i=0; i<this.wheels.length; i++) {
		this.wheels[i].wheelSpeed = 0;
		this.wheels[i].wheelTorque = 0;
	}
	this.forces = new Vec(0, 0);
};

Vehicle.prototype.setSteering = function(steering) {
	var steeringLock = 0.75;

	//apply steering angle to front wheels
	this.wheels[0].setSteeringAngle(-steering * steeringLock);
	this.wheels[1].setSteeringAngle(-steering * steeringLock);
};

Vehicle.prototype.setThrottle = function(throttle, allWheel) {
	var torque = 80;

	// if opposite of travel, apply braking too
	if (throttle && this === car) {
		var relativeGroundSpeed = this.worldToRelative(this.velocity);
		if (relativeGroundSpeed.y > 0 && throttle < 0) {
			// forwards and car is in reverse
			this.velocity = Vec.multiply(this.velocity, 0.97);
		}
		else if (relativeGroundSpeed.y < 0 && throttle > 0) {
			// backwards and car is in gear
			this.velocity = Vec.multiply(this.velocity, 0.97);
		}
	}

	//apply transmission torque to back wheels
	if (allWheel) {
		this.wheels[0].addTransmissionTorque(throttle * torque);
		this.wheels[1].addTransmissionTorque(throttle * torque);
	}

	this.wheels[2].addTransmissionTorque(throttle * torque);
	this.wheels[3].addTransmissionTorque(throttle * torque);

};

Vehicle.prototype.setBrakes = function(brakes) {
	console.log('barkes');
	var brakeTorque = 20;

	//apply brake torque apposing wheel vel
	for (var i=0; i<this.wheels.length; i++) {
		var wheelVel = this.wheels[i].getWheelSpeed();
		this.wheels[i].addTransmissionTorque(-wheelVel * brakeTorque * brakes);
		//if (brakes) {
		//	this.wheels[i].wheelSpeed = 0;
		//}
		
	}
};

Vehicle.prototype.update = function(timeStep) {
	for (var i=0; i<this.wheels.length; i++) {
		var worldWheelOffset = this.relativeToWorld(this.wheels[i].getAttachPoint());
		var worldGroundVel = this.pointVel(worldWheelOffset);
		var relativeGroundSpeed = this.worldToRelative(worldGroundVel);
		var relativeResponseForce = this.wheels[i].calculateForce(relativeGroundSpeed, timeStep);
		var worldResponseForce = this.relativeToWorld(relativeResponseForce);

		this.addForce(worldResponseForce, worldWheelOffset);

	}

	RigidBody.prototype.update.call(this, timeStep);
};


