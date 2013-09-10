var DIRE = 3,
	RADIANT = 2,
	MapBorders = {
		rad: [ -6068, -5674 ],
		dire: [ 6147, 5710 ],
		leftmost: -1750,
		leftangle: [ -1750, -4800 ],
		loft: [150, -2900],
		roof: [150, -1970],
		peak: [ 1568, -1970 ],
		lowpeak: [ 3600, -3100 ],
		rightwall: 5900,
		floor: -6300,

		secretShop: [
			[ 400, -4800 ],
			[ 1450, -3850 ]
		]
	},

	Teleport = require('teleport.js');


game.hook("OnGameFrame", onGameFrame);


// enforce map boundaries
function onGameFrame() {
	var i, j, client, heros, hero, id;

	for (i = 0; i < server.clients.length; ++i) {
		client = server.clients[i];
		if (!client) { continue; }

		id = client.netprops.m_iPlayerID;
		if (id < 0) { continue; }

		heros = client.getHeroes();
		if (!heros || !heros.length) { continue; }

		for (j = 0; j < heros.length; ++j) {
			hero = heros[j];
			Teleport.checkPortals(hero, client);

			boundHero(hero, client);
		}
	}
}

function checkShop(hero, client) {
/*
	hero.netprops.m_iCurShop = 0; // Regular shop
	hero.netprops.m_iCurShop = 1; // Side Shop
	hero.netprops.m_iCurShop = 2; // Secret Shop
	hero.netprops.m_iCurShop = 3 - 6; // Not in a shop / I couldnt workout what it does
*/
	var x = hero.netprops.m_vecOrigin.x,
		y = hero.netprops.m_vecOrigin.y,
		z = hero.netprops.m_vecOrigin.z;

	if (x > MapBorders.secretShop[0][0] && x < MapBorders.secretShop[1][0]
		&& y > MapBorders.secretShop[0][1] && y < MapBorders.secretShop[1][1]) {
		if (hero.netprops.m_iCurShop !== 2) {
			hero.netprops.m_iCurShop = 2;
		}
	} else {
		if (hero.netprops.m_iCurShop !== 3) {
			hero.netprops.m_iCurShop = 3;
		}
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

	y = y < MapBorders.floor ? MapBorders.floor : y;

	// vertical line on the left
	if (x <= MapBorders.leftmost) {
		x = x < MapBorders.leftmost ? MapBorders.leftmost : x;

	// area above the easy spawn camp
	} else if (x > MapBorders.leftangle[0] && x <= MapBorders.loft[0]) {
		if (y < MapBorders.loft[1]) {
			// diagonal line on the left
			y = (y > x + MapBorders.angleOffset) ? x + MapBorders.angleOffset : y;

		} else {
			// vertical line before the roof
			x = x < MapBorders.loft[0] ? MapBorders.loft[0] : x;

		}

	// roof
	} else if (x > MapBorders.roof[0] && x <= MapBorders.peak[0]) {
		y = y > MapBorders.roof[1] ? MapBorders.roof[1] : y;

	// weird angle line along the river
	} else if (x > MapBorders.peak[0] && x <= MapBorders.lowpeak[0]) {
		result = peakBound(x, y);
		x = result.x || x;
		y = result.y || y;

	// rightmost roof
	} else if (x > MapBorders.lowpeak[0] && x <= MapBorders.rightwall) {
		y = y > MapBorders.lowpeak[1] ? MapBorders.lowpeak[1] : y;

	} else {
		// we have to check the Y as well or they can run up the edge into dire bottom tower
		x = x > MapBorders.rightwall ? MapBorders.rightwall : x;
		y = y > MapBorders.lowpeak[1] ? MapBorders.lowpeak[1] : y;

	}

	if (origX !== x || origY !== y) {
		dota.findClearSpaceForUnit(hero, x, y, 0);
	}


	checkShop(hero, client);
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
