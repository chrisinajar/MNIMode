// libinajar
var Lib = {};
/*
 * Thanks to supgusy,
 * the majority of this code is literally copy and pasted
 * and the copy and replaced to fit my variable naming scheme.
 */

Lib.Hero = function(hero) {
	var fn;

	if (!hero) {
		print('null hero');
		return null;
	}

	for (fn in Lib.Hero) {
		if (Lib.Hero.hasOwnProperty(fn)) {
			hero[fn] = Lib.Hero[fn];
		}
	}

	return hero;
}

// similar to dota.setHeroLevel but sets xp to a known amount
Lib.Hero.setHeroLevelXP = function(level, xp) {
	var levelDiff = level - this.netprops.m_iCurrentLevel;

	if (levelDiff != 0) {
		this.netprops.m_iCurrentLevel = level;
		this.netprops.m_flStrength += this.datamaps.m_flStrengthGain * levelDiff;
		this.netprops.m_flAgility += this.datamaps.m_flAgilityGain * levelDiff;
		this.netprops.m_flIntellect += this.datamaps.m_flIntellectGain * levelDiff;

		this.netprops.m_iAbilityPoints = Math.max(0, this.netprops.m_iAbilityPoints + levelDiff);
	}

	this.netprops.m_iCurrentXP = xp;
}

Lib.Hero.addXP = function(amount) {
	var xp = this.netprops.m_iCurrentXP,
		lvl = this.netprops.m_iCurrentLevel;

	xp = xp + amount;

	while (dota.getTotalExpRequiredForLevel(lvl) > xp) { lvl--; }
	while (dota.getTotalExpRequiredForLevel(lvl + 1) < xp) { lvl++; }
	
	Lib.Hero.setHeroLevelXP.apply(this, [lvl, xp]);
}

Lib.Hero.copyTo = function(other) {
	var j,m_hItem,m_hItemClassname,other_m_hItem,couriers,k,courierItem;

	// restore levels and xp from this to other
	Lib.Hero.setHeroLevelXP.apply(other, [this.netprops.m_iCurrentLevel, this.netprops.m_iCurrentXP]);

	// restore items from this to other
	for (j = 0; j < 12; ++j) {
		m_hItem = this.netprops.m_hItems[j];
		if (!m_hItem) {
			continue;
		}
		m_hItemClassname = m_hItem.getClassname();

		other_m_hItem = dota.giveItemToHero(m_hItemClassname, other);
		if (!other_m_hItem) {
			continue; // shouldn't happen
		}
		other_m_hItem.netprops.m_iCurrentCharges = m_hItem.netprops.m_iCurrentCharges;
		other_m_hItem.netprops.m_fCooldown = m_hItem.netprops.m_fCooldown;
	}
	
	// set items on couriers belonging to this to the other purchaser
	couriers = game.findEntitiesByClassname("npc_dota_courier");
	for (j = 0; j < couriers.length; ++j) {
		courier = couriers[j];
		for (k = 0; k < 6; ++k) {
			courierItem = courier.netprops.m_hItems[k];
			if (!courierItem) {
				continue;
			}
			if (courierItem.netprops.m_hPurchaser == this) {
				courierItem.netprops.m_hPurchaser = other;
			}
		}
	}
}

Lib.Hero.remove = function(client) {
	var heros, j;
	if (client) {
		heros = client.getHeroes();
		if (heros && heros.length) {

			for (j = 0; j < heros.length; ++j) {
				dote.remove(heros[j]);

				if (heros[j] === this) {
					// i have no idea if this even works...
					this = null;
				}
			}
		}
	}
	// eliminate the old hero/all meepos (teleport method)
	// delayed meepo removals, they haven't spawned yet except for the main guy, eliminate them all together next frame
	if (client === true && this.getClassname() === "npc_dota_hero_meepo") {
		Lib.once(function(hero) {
			var meepos = game.findEntitiesByClassname("npc_dota_hero_meepo");
			for (var i = 0; i < meepos.length; ++i) {
				dota.remove(meepos[i]);
			}
			needEliminateMeepos = false;
		}, this);
	} else {
		dota.remove(this);
	}
}

exports.Hero = Lib.Hero;

/*
 *
 * Easier async control
 *
 */

Lib._nextFrame = [];

Lib.once = function(fn, context) {
	if (typeof fn === 'function') {
		Lib._nextFrame.push({
			fn: fn,
			context: context
		});
	}
}

Lib.once.onGameFrame = function() {
	var frame,
		frameList = Lib._nextFrame.slice();

	Lib._nextFrame = [];

	while (frameList.length > 0) {
		frame = frameList.pop();
		frame.fn.apply(this, [frame.context]);
	}
}

game.hook("OnGameFrame", Lib.once.onGameFrame);

exports.once = Lib.once;


