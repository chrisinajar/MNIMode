// Clearly this is dennis mode.

var score = require('victory.js').Score,
	Lib = require('lib.js'),
	cvCreepsNoSpawning = console.findConVar("dota_creeps_no_spawning"),
	cvEasyMode = console.findConVar("dota_easy_mode"),
	cvForceGameMode = console.findConVar("dota_force_gamemode"),
	frameCount = 0,
	gameMode = 1,
	gameModeMap = {
		"Not Set": null,
		"Captain's Mode": 2,
		"Random Draft": 3,
		"Single Draft": 4,
		"All Random": 5,
		"Limited Pool": 6,
		"Reverse Captain's Mode": 8,
		"New Player Pool": 13
	};

require('items.js');
require('map.js');
require('respawn.js');

game.hook("OnGameFrame", onGameFrame);
game.hook("Dota_OnHeroPicked", onHeroPicked);


plugin.get('LobbyManager', function(lobbyManager){
	var gameModeStr = lobbyManager.getOptionsForPlugin('MNIMode')['GameMode'];

	gameMode = gameModeStr in gameModeMap ? gameModeMap[gameModeStr] : gameMode;
});

function onGameFrame() {
	var client, hero, i, myScore,
		lvl = 0;

	cvCreepsNoSpawning.setInt(1);
	cvEasyMode.setInt(1);

	if (gameMode !== null) {
		cvForceGameMode.setInt(gameMode);
	}

	frameCount++;

	if (frameCount % 20 === 0) {
		// first we need to figure out the currently highest level
		for (i = 0; i < server.clients.length; ++i) {
			client = server.clients[i];
			if (!client) { continue; }

			hero = client.netprops.m_hAssignedHero;
			if (!hero) { continue; }

			lvl = Math.max(lvl, hero.netprops.m_iCurrentLevel); // avoid looking up the netprop value more than once
		}
		for (i = 0; i < server.clients.length; ++i) {
			client = server.clients[i];
			if (!client) { continue; }

			hero = client.netprops.m_hAssignedHero;
			if (!hero) { continue; }

			hero = Lib.Hero(hero);

			myScore = lvl - hero.netprops.m_iCurrentLevel;

			myScore *= 1 + ((hero.netprops.m_iTeamNum === dota.TEAM_DIRE) ? score.radiant - score.dire : score.dire - score.radiant)/100;

			if (myScore <= 0) {
				continue;
			}

			hero.addXP(myScore);
		}
	}

}

function onHeroPicked(client, className) {
	if (className.indexOf("npc_dota_hero_npc_dota_hero_") == 0) {
		client.printToChat("Welcome to MNI Mode! This is an arena game mode where, after leaving the well, you will be teleported into a small battle area. Fight to the death, try to hold the center valley, and remember that you can only buy consumables with starting gold!");
		client.printToChat("The secret shop is at the tower in the center.");
	}
}
