// Clearly this is dennis mode.

var score = require('victory.js').Score,
	Lib = require('lib.js'),
	cvCreepsNoSpawning = console.findConVar("dota_creeps_no_spawning"),
	cvEasyMode = console.findConVar("dota_easy_mode"),
	frameCount = 0,
	xpGain = 0,
	xpGainMap = {
		"Weighted": 0,
		"Off": 1,
		"Unweighted": 2,
		"Random": 5,
		"Medium": 3,
		"High": 4
	};

require('items.js');
require('map.js');
require('respawn.js');

game.hook("OnGameFrame", onGameFrame);
game.hook("Dota_OnHeroPicked", onHeroPicked);


plugin.get('LobbyManager', function(lobbyManager){
	var xpGainStr = lobbyManager.getOptionsForPlugin('MNIMode')['ExperienceGain'];
	xpGain = xpGainStr in configMap ? configMap[xpGainStr] : xpGain;
});

function onGameFrame() {
	var client, hero, i, myScore, xp, lvl;

	cvCreepsNoSpawning.setInt(1);
	cvEasyMode.setInt(1);

	frameCount++;

	if (frameCount % 20 === 0) {
		for (i = 0; i < server.clients.length; ++i) {
			client = server.clients[i];
			if (!client) { continue; }

			hero = client.netprops.m_hAssignedHero;
			if (!hero) { continue; }

			hero = Lib.Hero(hero);
			myScore = 0;

			if (xpGain === 0) {
				myScore = (hero.netprops.m_iTeamNum === dota.TEAM_DIRE) ? score.radiant - score.dire : score.dire - score.radiant;

				if (myScore <= 0) {
					continue;
				}

				myScore /= 8;
				myScore += 1;
			} else if (xpGain === 2) {
				myScore += 2;
			} else if (xpGain === 3) {
				myScore += 5;
			} else if (xpGain === 4) {
				myScore += 10;
			} else if (xpGain === 5) {
				myScore += Math.random()*10;
			}

			hero.addXP(myScore);
		}
	}

}

function onHeroPicked(client) {
	client.printToChat("Welcome to MNI Mode! This is an arena game mode where, after leaving the well, you will be teleported into a small battle area. Fight to the death, try to hold the center valley, and remember that you can only buy consumables with starting gold!");
	client.printToChat("The secret shop is at the tower in the center.");
}
