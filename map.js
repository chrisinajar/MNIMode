/*
 * map modes
 * 
 * 0: Dire jungle
 * 1: Radiance jungle
 * 2: No limit
 */
var configMap = {
		"Dire Jungle": 2,
		"Radiance Jungle": 1,
		"Entire Map": 0
	},
	MapBorders = {
		rad: {
			x: -3500,
			y: -3100
		},
		dire: {
			x: 3000,
			y: 3000
		},
		lineR: 700,
		lineD: 800,

		secretShop: [936, -4197]
	};

// set up game boundaries
require('bounds.js');

game.hook("OnMapStart", onMapStart);

function onMapStart() {
	var wells, i, towers;
	
	// get all the wells and remove them
	// this keeps the heroes from healing themselves
	wells = game.findEntitiesByClassname('ent_dota_fountain')
	for (i=0; i<wells.length; i+= 1) {
		dota.remove(wells[i]);
	}
	
	// taken directly from poor man's pudge wars
	// Move T1 towers out of the way
	towers = game.findEntityByTargetname("dota_goodguys_tower1_mid");
	if (towers != null) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_badguys_tower1_mid");
	if (towers != null) {
		towers.teleport(5000, 5000, 128);
	}
	// </stolen code
	// gpl ftw

	// other towers...
	towers = game.findEntityByTargetname("dota_goodguys_tower2_mid");
	if (towers != null) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_goodguys_tower1_bot");
	if (towers != null) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_goodguys_tower2_bot");
	if (towers != null) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_goodguys_tower3_bot");
	if (towers != null) {
		towers.teleport(-5000, -5000, 128);
	}

}
