/**
 * Created by jonas on 2015-08-31.
 */

var DEF_LEVELS = {

	1: {
		name: 'Learn the Ropes',
		position: {
			x: 60, y: 60, angle: Math.PI/2
		},
		opponents: [
			{ x: 160, y: 40, angle: Math.PI/2, ai: null },
			{ x: 160, y: 70, angle: Math.PI/2, ai: 'kamikazi' }
		]
	},
	2: {
		name: 'More Advanced',
		position: {
			x: 60, y: 60, angle: Math.PI/2
		},
		opponents: [
			{ x: 160, y: 70, angle: Math.PI/2, ai: 'kamikazi' },
			{ x: 160, y: 70, angle: Math.PI/2, ai: 'kamikazi' }
		]
	}
};