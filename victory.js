var maxScore = 50,
	score = {
		radiant: 0,
		dire: 0
	},
	configMap = {
		"25 kills": 25,
		"50 kills": 50,
		"75 kills": 75,
		"100 kills": 100,
		"150 kills (long game)": 150
	};


plugin.get('LobbyManager', function(lobbyManager){
	var scoreStr = lobbyManager.getOptionsForPlugin('MNIMode')['MaxScore'];
	maxScore = scoreStr in configMap ? configMap[scoreStr] : 100;
});

game.hookEvent("dota_player_killed", onPlayerKilled);

function onPlayerKilled(event) {
	var playerId = event.getInt("PlayerID"),
		client = dota.findClientByPlayerID(playerId);
		hero = client ? client.netprops.m_hAssignedHero : null;

	if (!hero) { return };

	if (hero.netprops.m_iTeamNum === dota.TEAM_DIRE) { score.radiant++ };
	if (hero.netprops.m_iTeamNum === dota.TEAM_RADIANT) { score.dire++ };
	
	print("SCORE: "+score.radiant+"-"+score.dire);
	
	if (score.radiant >= maxScore) {
		// Radiant win!
		endGame(dota.TEAM_DIRE);
	} else if (score.dire >= maxScore) {
		// Dire win!
		endGame(dota.TEAM_RADIANT);
	}
}

function endGame(loser) {
	var wintxt = (loser === dota.TEAM_DIRE) ? "Radiant" : "Dire",
		i;
	
	for(i = 0; i < server.clients.length; ++i) {
		if(!server.clients[i] || !server.clients[i].isInGame()) {
			continue;
		}
		
		server.clients[i].printToChat(wintxt + " wins!");
		server.clients[i].printToChat("Thanks for playing MNI Mode!");
	}
	dota.forceWin(loser);
}

exports.Score = score;
