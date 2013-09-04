var DIRE = 3,
	RADIANT = 2,
	MapBorders = {
		rad: [ -4500, -4000 ],
		dire: [ 4000, 3500 ],
		leftmost: -3400,
		leftangle: [ -3400, -2600 ],
		peak: [ -1000, -200 ],
		lowpeak: [ 3600, -3000 ],

		riverGap: [
			[2800, -2750],
			[3200, -2500]
		],
		riverGapLanding: [ 3150, -3050 ]
	},

	Teleport = require('teleport.js');


game.hook("OnGameFrame", onGameFrame);


// enforce map boundaries
function onGameFrame() {
	var i, client, hero, id;

	for (i = 0; i < server.clients.length; ++i) {
		client = server.clients[i];
		if (!client) { continue; }

		id = client.netprops.m_iPlayerID;
		if (id < 0) { continue; }

		hero = client.netprops.m_hAssignedHero;
		if (!hero) { continue; }

		Teleport.checkPortals(hero, client);

		boundHero(hero, client);
	}
}


MapBorders.angleOffset = MapBorders.leftangle[1] - MapBorders.leftangle[0];
function boundHero(hero, client) {
	var x = hero.netprops.m_vecOrigin.x,
		y = hero.netprops.m_vecOrigin.y,
		z = hero.netprops.m_vecOrigin.z,
		origX = x,
		origY = y,

		direDist = [
			MapBorders.dire[0] - x,
			MapBorders.dire[1] - y,
		],
		radDist = [
			x - MapBorders.rad[0],
			y - MapBorders.rad[1],
		],
		team = hero.netprops.m_iTeamNum,
		dist, result;

	if ( (team === DIRE && direDist[0] < 0 && direDist[1] < 0)  ||  (team === RADIANT && radDist[0] < 0 && radDist[1] < 0) ) {
		return;
	}

	if (team === DIRE && direDist[0] < 500 && direDist[1] < 500) {
		x += direDist[0] > 0 ? direDist[0] : 0;
		y += direDist[1] > 0 ? direDist[1] : 0;

		dota.findClearSpaceForUnit(hero, x, y, 0);
		return;
	}
	if (team === RADIANT && radDist[0] < 500 && radDist[1] < 500) {
		x -= radDist[0] > 0 ? radDist[0] : 0;
		y -= radDist[1] > 0 ? radDist[1] : 0;

		dota.findClearSpaceForUnit(hero, x, y, 0);
		return;
	}


	// vertical line on the left
	if (x <= MapBorders.leftmost) {
		x = x < MapBorders.leftmost ? MapBorders.leftmost : x;

	// diagonal line on the top left corner
	} else if (x > MapBorders.leftangle[0] && x <= MapBorders.peak[0]) {
		y = (y > x + MapBorders.angleOffset) ? x + MapBorders.angleOffset : y;

	// weird angle line along the river
	} else if (x > MapBorders.peak[0] && x <= MapBorders.lowpeak[0]) {
		result = peakBound(x, y);
		x = result.x || x;
		y = result.y || y;

		// I SPEAK BINARU
		if (x > MapBorders.riverGap[0][0] && x < MapBorders.riverGap[1][0]
			&& y > MapBorders.riverGap[0][1] && y < MapBorders.riverGap[1][1]) {
			// HONOR

			x = MapBorders.riverGapLanding[0];
			y = MapBorders.riverGapLanding[1];
		}

	} else {
		y = y > MapBorders.lowpeak[1] ? MapBorders.lowpeak[1] : y;

	}

	if (origX !== x || origY !== y) {
		dota.findClearSpaceForUnit(hero, x, y, 0);
	}
}


// for angle calculations
// this is the XY coord of the line if it was originating from 0,0
MapBorders.peakOffset = [ MapBorders.lowpeak[0] - MapBorders.peak[0], MapBorders.lowpeak[1] - MapBorders.peak[1] ];
// "rise over run"
MapBorders.peakSlope = MapBorders.peakOffset[1] / MapBorders.peakOffset[0];

// CALCULATE!
function peakBound(x, y) {
	var expY = (x - MapBorders.peak[0]) * MapBorders.peakSlope + MapBorders.peak[1];

	return { y: y > expY ? expY : y };
}

/*
scratch/

	peak: [ -1000, -200 ],
	lowpeak: [ 3600, -3000 ],


MapBorders.peakOffset = [ 4600 , -2800 ];
// "rise over run"
-14 / 23
MapBorders.peakSlope = -0.60869565217;

*/
