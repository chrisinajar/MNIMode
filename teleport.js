var Spawns = [
		[ 5486, -3495 ],
		[ 5465, -4185 ],
		[ 5252, -4965 ],
		[ 4205, -5660 ],
		[ 4205, -5660 ],
		[ 3744, -3488 ],
		[ 2855, -3162 ],
		[ 2855, -3162 ],
		[ 2393, -4674 ],
		[ 2265, -5797 ],
		[ 1607, -2599 ],
		[ 1270, -3559 ],
		[ 281, -4749 ],
		[ 195, -2230 ],
		[ 164, -3572 ],
		[ -65, -5095 ]
	],

	Ports = [
	//RADIANT!
	{
		rect: [
			[ -6608, -6576 ],
			[ -5000, -5000 ]
		],
		dest: Spawns
	},


	//DIRE!
	{
		rect: [
			[ 6100, 5710 ],
			[ 6944, 6050 ]
		],
		dest: Spawns
	},

	{
		rect: [
			[ 100, -2000 ],
			[ 300, -1800 ]
		],
		dest: [ 288, -2080 ]
	}
	];
	// /Ports


function checkPortals(hero) {
	var x = hero.netprops.m_vecOrigin.x,
		y = hero.netprops.m_vecOrigin.y,
		origX = x,
		origY = y,
		i,l,t;

	for (i=0,l=Ports.length; i<l; ++i) (function(port) {
		// is in port
		if (port.dest && x > port.rect[0][0] && x < port.rect[1][0]
			&& y > port.rect[0][1] && y < port.rect[1][1]) {

			// teleport!
			if (typeof port.dest[0] === 'number') {
				// normal coord set
				dota.findClearSpaceForUnit(hero, port.dest[0], port.dest[1], 0);
				return;
			} else {
				// array of locations
				t = Math.round(Math.random() * (port.dest.length - 1));
				dota.findClearSpaceForUnit(hero, port.dest[t][0], port.dest[t][1], 0);
				return;
			}
		}
	}(Ports[i]));
}

exports.checkPortals = checkPortals;