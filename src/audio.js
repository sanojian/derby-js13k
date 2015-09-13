/**
 * Created by jonas on 2015-09-01.
 */

function initAudio() {
	aa = new ArcadeAudio();

	aa.add( 'powerup', 10,
		[
			[0,,0.01,,0.4384,0.2,,0.12,0.28,1,0.65,,,0.0419,,,,,1,,,,,0.3]
		]
	);

	aa.add( 'laser', 5,
		[
			[2,,0.2,,0.1753,0.64,,-0.5261,,,,,,0.5522,-0.564,,,,1,,,,,0.25],
			[0,,0.16,0.18,0.18,0.47,0.0084,-0.26,,,,,,0.74,-1,,-0.76,,1,,,,,0.15]
		]
	);

	aa.add( 'bigExplosion', 5,
		[
			[3,,0.41,0.08,0.61,0.0144,,-0.3399,-0.14,0.62,0.47,-0.86,,,,,-0.24,-0.0064,0.78,,,,,0.5]
		]
	);

	aa.add( 'engine', 1,
		[
			[0,,0.19,,,0.07,,-0.02,-0.02,0.52,0.38,-0.02,0.74,,,,-0.02,,0.83,,,,,0.5]
			//[0,,0.18,,,0.07,,-0.02,-0.02,0.28,0.41,,0.74,,,0.45,-0.02,,0.83,,,,,0.5]
			//[2,0.1671,0.0128,,,0.14,0.04,-0.04,,0.9,0.67,-1,,0.5902,-0.3338,0.05,0.04,,0.85,-0.78,,0.1701,1,0.5]
			//[3,,0.11,0.08,0.1019,,,0.2481,-0.78,,,-0.14,,,,,0.488,-0.0144,1,,,,,0.5]
		]
	);

	aa.add( 'engine2', 1,
		[
			[0,,0.18,,,0.1,0.06,-0.02,-0.02,0.52,0.38,-0.02,0.74,,,,-0.02,,0.83,,,,,0.5]
		]
	);

	aa.add( 'bip', 1,
		[
			[0,,0.0468,0.5223,0.2031,0.56,,,,,,,,,,,,,1,,,,,0.5]
		]
	);

	aa.add( 'bee', 1,
		[
			[0,,0.42,0.13,0.2031,0.65,,,,,,,,,,,,,0.46,,,,,0.5]
		]
	);

	aa.add( 'damage', 3,
		[
			[3,,0.0138,,0.2701,0.4935,,-0.6881,,,,,,,,,,,1,,,,,0.25],
			[0,,0.0639,,0.2425,0.7582,,-0.6217,,,,,,0.4039,,,,,1,,,,,0.25],
			[3,,0.0948,,0.2116,0.7188,,-0.6372,,,,,,,,,,,1,,,0.2236,,0.25],
			[3,,0.1606,0.5988,0.2957,0.1157,,-0.3921,,,,,,,,,0.3225,-0.2522,1,,,,,0.25],
			[3,,0.1726,0.2496,0.2116,0.0623,,-0.2096,,,,,,,,,0.2665,-0.1459,1,,,,,0.25],
			[3,,0.1645,0.7236,0.3402,0.0317,,,,,,,,,,,,,1,,,,,0.25]
		]
	);

	window.aa = aa;
}