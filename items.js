// in dennis mode you can only buy consumables with starting gold
// we do something similar but much lazier by stopping consumables
// from being purchased after first kill of anything (even minion)

var gracePeriod = true;

game.hook("Dota_OnBuyItem", onBuyItem);

game.hookEvent("last_hit", disableGracePeriod);
game.hookEvent("dota_player_kill", disableGracePeriod);

function disableGracePeriod() {
	gracePeriod = false;
}

function onBuyItem(unit, item, player, unknown) {
	// anything goes during the grace period
	if (gracePeriod) { return; }
	
	// otherwise block consumables
	switch (item) {
		case "item_flask":
		case "item_tango":
		case "item_clarity":
		case "item_bottle":
			return false;
	}
	return;
}
