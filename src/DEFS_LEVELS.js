/**
 * Created by jonas on 2015-08-31.
 */

var DEF_LEVELS = {

	0: {
		position: {
			x: 60, y: 60, angle: Math.PI/2
		},
		opponents: [
			{ x: 90, y: 60, angle: Math.PI/2, ai: null }
		]
	},
	1: {
		position: {
			x: 40, y: 50, angle: Math.PI/2
		},
		opponents: [
			//{ x: 160, y: 40, angle: Math.PI/2, ai: null }
			{ x: 160, y: 50, angle: Math.PI/2, ai: 'kamikazi' }
		]
	},
	2: {
		position: {
			x: 40, y: 50, angle: Math.PI/2
		},
		opponents: [
			{ x: 160, y: 20, angle: Math.PI/2, ai: 'kamikazi' },
			{ x: 160, y: 70, angle: Math.PI/2, ai: 'kamikazi' }
		]
	}
};