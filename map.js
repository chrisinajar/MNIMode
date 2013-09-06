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
		runeSpawn: [1400, -4500]
	};

// set up game boundaries
require('bounds.js');

game.hook("OnMapStart", onMapStart);

function onMapStart() {
	var wells, i, towers;
	
	
	for(i = 0; i < server.clients.length; ++i) {
		client = server.clients[i];
		if (client && client.isInGame()) {
			client.printToChat("Welcome to MNI Mode! This is an arena game mode where, after leaving the well, you will be teleported into a small battle area. Fight to the death, try to hold the center valley, and remember that you can only buy consumables with starting gold!");
		}
	}
	
	// get all the wells and remove them
	// this keeps the heroes from healing themselves
	dota.removeAll("ent_dota_fountain");
	
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
	
	// rune spawners
	wells = game.findEntitiesByClassname('dota_item_rune_spawner')
	for (i=0; i<wells.length; i+= 1) {
		wells[i].teleport(MapBorders.runeSpawn[0], MapBorders.runeSpawn[1], 256);
	}

}
