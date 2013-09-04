var Ports = [
	//RADIANT!
	// radiant bottom
	{
		rect: [
			[-4600, -6400],
			[-4500, -5900]
		],
		dest: [5161, -6939]
	},
	// radiant middle
	{
		rect: [
			[-5000, -4600],
			[-4800, -4200]
		],
		dest: [-3400, -2950]
	},
	// radiant top
	{
		rect: [
			[-6900, -4200],
			[-6350, -4000]
		],
		dest: [2250, -2200]
	},

	//DIRE!
	// dire bottom
	{
		rect: [
			[6000, 3500],
			[6600, 3800]
		],
		dest: [5550, -3450]
	},
	// dire middle
	{
		rect: [
			[4000, 3500],
			[4800, 4300]
		],
		dest: [-900, -350]
	},
	// dire top
	{
		rect: [
			[4000, 5500],
			[4300, 6000]
		],
		dest: [-3160, -7000]
	}
	];
	// /Ports


function checkPortals(hero, client) {
	var x = hero.netprops.m_vecOrigin.x,
		y = hero.netprops.m_vecOrigin.y,
		origX = x,
		origY = y,
		i,l;

	for (i=0,l=Ports.length; i<l; ++i) (function(port) {
		// is in port
		if (port.dest && x > port.rect[0][0] && x < port.rect[1][0]
			&& y > port.rect[0][1] && y < port.rect[1][1]) {
			// teleport!
			dota.findClearSpaceForUnit(hero, port.dest[0], port.dest[1], 0);
		}
	}(Ports[i]));
}

exports.checkPortals = checkPortals;