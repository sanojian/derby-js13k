/**
 * Created by jonas on 2015-08-16.
 */

/**
 * Created by jonas on 2015-08-15.
 */

function Line(ox, oy, dx, dy, color, stokeWidth, dashStroke) {

	this.ox = ox;
	this.oy = oy;
	this.dx = dx;
	this.dy = dy;

	this.svgObj = document.createElementNS ('http://www.w3.org/2000/svg', "path");
	//this.svgObj.setAttribute('d', 'M ' + ox + ',' + oy + ' L ' + dx + ',' + dy);
	this.svgObj.style.stroke = color || 'black';
	this.svgObj.style.strokeWidth = stokeWidth || 4;
	if (dashStroke) {
		this.svgObj.style.strokeDasharray = dashStroke;
	}
	svg1.appendChild(this.svgObj);
	this.setPosition(ox, oy, dx, dy);

}

Line.prototype.setPosition = function(ox, oy, dx, dy) {
	this.svgObj.setAttribute('d', 'M ' + ox + ',' + oy + ' L ' + dx + ',' + dy);
};

Line.prototype.setColor = function(color) {
	this.svgObj.style.stroke = color;
};