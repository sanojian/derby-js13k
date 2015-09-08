//mini 2d vector :)
function Vec(x, y) {

	this.x = x || 0;
	this.y = y || 0;
	
}


Vec.prototype.getMagnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec.add = function(vec1, vec2) {
	return new Vec(vec1.x + vec2.x, vec1.y + vec2.y);
};

Vec.prototype.add = function( vec2) {
	return new Vec(this.x + vec2.x, this.y + vec2.y);
};

Vec.subtract = function(vec1, vec2) {
	return new Vec(vec1.x - vec2.x, vec1.y - vec2.y);
};

Vec.prototype.subtract = function( vec2) {
	return new Vec(this.x - vec2.x, this.y - vec2.y);
};

// scalar multiply
Vec.multiply = function(vec, r) {
	return new Vec(vec.x * r, vec.y * r);
};

// scalar divide
Vec.divide = function(vec, r) {
	return new Vec(vec.x / r, vec.y / r);
};

// multiply vectors
Vec.dotProduct = function(vec1, vec2) {
	return (vec1.x * vec2.x + vec1.y * vec2.y);
};

Vec.prototype.dotProduct = function(vec2) {
	return (this.x * vec2.x + this.y * vec2.y);
};

// divide by vector
Vec.crossProduct = function(vec1, vec2) {
	return (vec1.x * vec2.y - vec1.y * vec2.x);
};

Vec.reverse = function(vec) {
	return new Vec(-vec.x, -vec.y);
};

Vec.prototype.normalize = function() {
	var mag = this.getMagnitude();

	this.x /= mag;
	this.y /= mag;
};

Vec.getNormal = function(vec1, vec2) {
	var vec = new Vec(-(vec1.y - vec2.y), vec1.x - vec2.x);
	vec.normalize();
	return vec;
};

Vec.prototype.getHeading = function() {
	return Math.atan2(this.y, this.x);
};

Vec.prototype.rotate = function(angle) {
	var ox = this.x;
	var oy = this.y;
	this.x = ox * Math.cos(angle) - oy * Math.sin(angle);
	this.y = ox * Math.sin(angle) + oy * Math.cos(angle);
};

Vec.rotate = function(vec1, angle) {
	var vec = new Vec(vec1.x, vec1.y);
	var ox = vec1.x;
	var oy = vec1.y;
	vec.x = ox * Math.cos(angle) - oy * Math.sin(angle);
	vec.y = ox * Math.sin(angle) + oy * Math.cos(angle);
	return vec;
};

//project this vector on to vec
Vec.prototype.project = function(vec2) {
	var thisDotV = Vec.dotProduct(this, vec2);
	return Vec.multiply(vec, thisDotV);
};

//project this vector on to vec, return signed magnitude
Vec.prototype.project = function(vec) {
	var thisDotV = Vec.dotProduct(this, vec);
	return { vec: Vec.multiply(vec, thisDotV), mag: thisDotV };
};

