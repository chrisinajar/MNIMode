// Clearly this is dennis mode.

require('map.js');
require('victory.js');
require('items.js');
require('respawn.js');

var cvCreepsNoSpawning = console.findConVar("dota_creeps_no_spawning"),
	cvEasyMode = console.findConVar("dota_easy_mode");

game.hook("OnGameFrame", onGameFrame);

function onGameFrame() {
	cvCreepsNoSpawning.setInt(1);
	cvEasyMode.setInt(1);
}
