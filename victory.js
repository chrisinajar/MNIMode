var maxScore = 100,
	radiScore = 0,
	direScore = 0,
	configMap = {
		"25 kills": 25,
		"50 kills": 50,
		"75 kills": 75,
		"100 kills": 100,
		"150 kills": 150
	};

plugin.get('LobbyManager', function(lobbyManager){
	maxScore = configMap[lobbyManager.getOptionsForPlugin('MNIMode')['MaxScore']];
	
	if (!(maxScore > 0 && maxScore < 1000)) {
		maxScore = 100;	
	}
});

game.hookEvent("dota_player_kill", onPlayerKill);

function onPlayerKill(event) {
	var playerId = event.getInt("PlayerID"),
		client = dota.findClientByPlayerID(playerId),
		hero = client ? client.netprops.m_hAssignedHero : null,
		i;

	if (hero === null) { return };
		
	client = null;
	
	if (hero.netprops.m_iTeamNum === 3) {
		radiScore += 1;
		
		if (radiScore >= maxScore) {
			// Radiant win!
			for(i = 0; i < server.clients.length; ++i) {
				client = server.clients[i];
				if (client && client.isInGame()) {
					client.printToChat("Radiant wins!");
				}
			}
			dota.forceWin(dota.TEAM_DIRE);
		}
	} else if (hero.netprops.m_iTeamNum === 2) {
		direScore += 1;
		
		if (direScore >= maxScore) {
			// Radiant win!
			for(i = 0; i < server.clients.length; ++i) {
				client = server.clients[i];
				if (client && client.isInGame()) {
					client.printToChat("Dire wins!");
				}
			}
			dota.forceWin(dota.TEAM_RADIANT);
		}
	}
}
