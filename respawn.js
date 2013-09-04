var respawn = [];

game.hook("OnGameFrame", onGameFrame);
function onGameFrame() {
	var i,l,hero;

	for (i=0,l=respawn.length; i<l; ++i) {
		hero = respawn[i];
		if (!hero) { continue; }
		hero.netprops.m_flRespawnTime = 1.0
	}
	respawn.length = 0;
}

game.hookEvent("dota_player_killed", onPlayerKilled);
function onPlayerKilled(event) {
	var playerId = event.getInt("PlayerID"),
		client = dota.findClientByPlayerID(playerId),
		hero = client ? client.netprops.m_hAssignedHero : null;

	if (!hero) { return; }
	respawn.push(hero);
}
