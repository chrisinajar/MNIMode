var Lib = require('lib.js');


game.hookEvent("dota_player_killed", onPlayerKilled);
function onPlayerKilled(event) {
	var playerId = event.getInt("PlayerID"),
		client = dota.findClientByPlayerID(playerId),
		hero = client ? client.netprops.m_hAssignedHero : null;

	if (!hero) { return; }

	Lib.once(function(hero) {
		hero.netprops.m_flRespawnTime = 1.0;
	}, hero);
}
