/**
 * Created by jonas on 2015-08-26.
 *
 * Based on the collision engine from Crafty.js
 */

function checkCollision3(points1, points2) {
	var i, j,
		edgeNormal,
		min1, min2,
		max1, max2,
		interval,
		MTV = -Infinity,
		MNx = null,
		MNy = null,
		dot,
		nextPoint;

	//loop through the edges of Polygon 1
	for (i=0; i < points1.length; i++) {
		nextPoint = (i === points1.length - 1 ? 0 : i + 1);

		//generate the normal for the current edge
		edgeNormal = Vec.getNormal(points1[i], points1[nextPoint]);

		//default min max
		min1 = min2 = Infinity;
		max1 = max2 = -Infinity;

		//project all vertices from poly1 onto axis
		for (j = 0; j < points1.length; ++j) {
			dot = Vec.dotProduct(points1[j], edgeNormal);
			if (dot > max1) max1 = dot;
			if (dot < min1) min1 = dot;
		}

		//project all vertices from poly2 onto axis
		for (j = 0; j < points2.length; ++j) {
			dot = Vec.dotProduct(points2[j], edgeNormal);
			if (dot > max2) max2 = dot;
			if (dot < min2 ) min2 = dot;
		}

		//calculate the minimum translation vector should be negative
		if (min1 < min2) {
			interval = min2 - max1;
			edgeNormal.x = -edgeNormal.x;
			edgeNormal.y = -edgeNormal.y;
		} else {
			interval = min1 - max2;
		}

		//exit early if positive
		if (interval >= 0) {
			return false;
		}

		if (interval > MTV) {
			MTV = interval;
			MNx = edgeNormal.x;
			MNy = edgeNormal.y;
		}
	}

	//loop through the edges of Polygon 2
	for (i = 0; i < points2.length; i++) {
		nextPoint = (i == points2.length - 1 ? 0 : i + 1);

		//generate the normal for the current edge
		edgeNormal = Vec.getNormal(points2[i], points2[nextPoint]);

		//default min max
		min1 = min2 = Infinity;
		max1 = max2 = -Infinity;

		//project all vertices from poly1 onto axis
		for (j = 0; j < points1.length; ++j) {
			dot = Vec.dotProduct(points1[j], edgeNormal);
			if (dot > max1) max1 = dot;
			if (dot < min1) min1 = dot;
		}

		//project all vertices from poly2 onto axis
		for (j = 0; j < points2.length; ++j) {
			dot = Vec.dotProduct(points2[j], edgeNormal);
			if (dot > max2) max2 = dot;
			if (dot < min2) min2 = dot;
		}

		//calculate the minimum translation vector should be negative
		if (min1 < min2) {
			interval = min2 - max1;
			edgeNormal.x = -edgeNormal.x;
			edgeNormal.y = -edgeNormal.y;
		} else {
			interval = min1 - max2;
		}

		//exit early if positive
		if (interval >= 0) {
			return false;
		}

		if (interval > MTV) {
			MTV = interval;
			MNx = edgeNormal.x;
			MNy = edgeNormal.y;
		}
	}

	return {
		overlap: MTV,
		normal: new Vec(MNx, MNy)
	};
}