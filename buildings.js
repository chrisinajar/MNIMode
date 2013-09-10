var MapBorders = {
		SecretShop: [ 936, -4190, 256 ],

		// Helpers for bounding box pathing!
		// we wall off the area so the the bounds are obvious
		MidLane: [ 1158, -2074, 128 ],

		// peak angle
		Wall1: [ 1850, -2140, 0 ],
		Wall2: [ 1950, -2190, 0 ],
		Wall3: [ 2050, -2240, 0 ],
		Wall4: [ 2150, -2290, 0 ],
		Wall5: [ 2250, -2340, 0 ],
		Wall6: [ 2350, -2390, 0 ],

		// loft wall
		Loft1: [ 100, -2500, 250 ],
		Loft2: [ 100, -2600, 250 ],

		// rightmost roof
		DireBotLane1: [ 5730, -3100, 256 ],

		TopRightCorner: [ 5900, -3100, 256 ],
		BottomRightCorner: [ 5900, -6300, 256 ],
		BottomLeftCorner: [ -1750, -6300, 256 ]

		// floor
		// Floor: []
	},

	// concept and code samples taken from builder
	// thanks ash! you're the man!
	customUnit = false;


game.hook('Dota_OnUnitParsed', onUnitParsed);


function setupMap() {
	var ent;

	// secret shop
	ent = placeBuilding('models/props_structures/tower_good.mdl', MapBorders.SecretShop);
	// ent.netprops.m_flModelScale = 0.8;

	// MidLane
	placeBuilding('models/props_structures/good_statue010.mdl', MapBorders.MidLane);

	// wall
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Wall1);
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Wall2);
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Wall3);
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Wall4);
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Wall5);
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Wall6);

	// loft
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Loft1);
	placeBuilding('models/props_structures/good_statue008.mdl', MapBorders.Loft2);

	placeBuilding('models/props_structures/bad_statue001.mdl', MapBorders.DireBotLane1);
	placeBuilding('models/props_structures/bad_statue002.mdl', MapBorders.TopRightCorner);

	// generate the right wall
	rightWall();

	bottomWall();

	placeBuilding('models/props_structures/bad_statue001.mdl', [ MapBorders.BottomLeftCorner[0] + 400, MapBorders.BottomLeftCorner[1], MapBorders.BottomLeftCorner[2] ] );
	placeBuilding('models/props_structures/bad_statue001.mdl', [ MapBorders.BottomLeftCorner[0] + 400, MapBorders.BottomLeftCorner[1] + 100, MapBorders.BottomLeftCorner[2] ] );
	placeBuilding('models/props_structures/bad_statue001.mdl', [ MapBorders.BottomLeftCorner[0] + 400, MapBorders.BottomLeftCorner[1] + 200, MapBorders.BottomLeftCorner[2] ] );

}

function rightWall() {
	var start = MapBorders.TopRightCorner[1],
		end = MapBorders.BottomRightCorner[1],
		interval = 100,

		x = MapBorders.TopRightCorner[0] + 120,
		z = MapBorders.TopRightCorner[2],

		cur = start;

	while (cur > end) {
		placeBuilding('models/props_structures/bad_statue001.mdl', [x, cur, z]);
		cur -= interval;
	}
}

function bottomWall() {
	var start = MapBorders.BottomRightCorner[0],
		end = MapBorders.BottomLeftCorner[0] + 400,
		interval = 100,

		y = MapBorders.BottomRightCorner[1] - 120,
		z = MapBorders.BottomRightCorner[2],

		cur = start;

	while (cur > end) {
		placeBuilding('models/props_structures/bad_statue001.mdl', [cur, y, z]);
		cur -= interval;
	}
}

function placeBuilding(model, coords) {
	var ent = createUnit('dota_goodguys_fillers', dota.TEAM_NONE, {
		keys: {
			model: model,
			TeamName: "DOTA_TEAM_NEUTRALS"
		}
	});

	ent.teleport(coords[0], coords[1], coords[2]);

	return ent
}

function createUnit(className, team, c) {
	var ent;

	customUnit = c;
	ent = dota.createUnit(className, team);
	customUnit = false;

	return ent;
}


// Change models of buildings
function onUnitParsed(ent, keys) {
	// Check if there is a custom unit
	if(customUnit) {
		// Copy in custom keys
		if(customUnit.keys) {
			for(var k in customUnit.keys) {
				keys[k] = customUnit.keys[k];
			}
		}
	}
}

exports.setupMap = setupMap;
