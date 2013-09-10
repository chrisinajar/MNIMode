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
		secretShop: [936, -4197],
		runeSpawn: [3067, -4615]
	};

// set up game boundaries
var Buildings = require('buildings.js');
require('bounds.js');

game.hook("OnMapStart", onMapStart);

function onMapStart() {
	var wells, i, towers;
	
	// get all the wells and remove them
	// this keeps the heroes from healing themselves
	dota.removeAll("ent_dota_fountain");
	
	// taken directly from poor man's pudge wars
	// Move T1 towers out of the way
	towers = game.findEntityByTargetname("dota_goodguys_tower1_mid");
	if (towers) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_badguys_tower1_mid");
	if (towers) {
		towers.teleport(5000, 5000, 128);
	}
	// </stolen code
	// gpl ftw

	// other towers...
	towers = game.findEntityByTargetname("dota_goodguys_tower2_mid");
	if (towers) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_goodguys_tower1_bot");
	if (towers) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_goodguys_tower2_bot");
	if (towers) {
		towers.teleport(-5000, -5000, 128);
	}
	towers = game.findEntityByTargetname("dota_goodguys_tower3_bot");
	if (towers) {
		towers.teleport(-5000, -5000, 128);
	}
	
	// rune spawners
	wells = game.findEntitiesByClassname('dota_item_rune_spawner')
	for (i=0; i<wells.length; i+= 1) {
		wells[i].teleport(MapBorders.runeSpawn[0], MapBorders.runeSpawn[1], 256);
	}

	Buildings.setupMap();
}
