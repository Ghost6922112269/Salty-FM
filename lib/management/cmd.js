"use strict";

/*
* Unit for Fps Manager. Adds support for manual module control 
* Author: SaltyMonkey
* Contributors: 
*/

/**
 * @typedef {import("../../fpsManager.js").deps} deps
*/
const rfdc = require("rfdc")({ "proto": true });
const stringSimilarity = require("string-similarity");

class Commands {
	/**
	 *Creates an instance of Control.
	 * @param {deps} deps
	 * @memberof Commands
	*/
	constructor(deps) {
		let prefixes = ["fm", "fps"];

		console.log("DEBUG: unitControl -> constructor");

		const helpHandler = () => {
			deps.mod.command.message("FPS Manager help.");

		};

		const autoSettingHandler = () => {
			deps.mod.settings.enableEvents = !deps.mod.settings.enableEvents;
			deps.mod.command.message(`Triggers ${deps.mod.settings.enableEvents ? "a" : "dea"}ctivated.`);
		};

		const classBasedPresetSettingHandler = () => {
			deps.mod.settings.classBasedPresets = !deps.mod.settings.classBasedPresets;
			deps.mod.command.message(`Class based presets will be ${deps.mod.settings.classBasedPresets ? "a" : "dea"}ctivated after relog.`);
		};

		const debugSettingsHandler = () => {
			deps.mod.settings.debugMode = !deps.mod.settings.debugMode;
			deps.mod.command.message(`Debug mode was ${deps.mod.settings.debugMode ? "a" : "dea"}ctivated.`);
		};

		const activeModeHandler = (str) => {
			let res = stringSimilarity.findBestMatch(str, Object.keys(deps.data.preset.modes));

			// eslint-disable-next-line no-magic-numbers
			if(res.bestMatch.rating < 0.2) { deps.mod.command.message("Mode was not found"); return; }

			deps.data.prevMode = rfdc(deps.data.activeMode);
			deps.data.activeMode = deps.data.preset.modes[res.bestMatch.target];
			deps.mod.command.message(`Mode was changed to "${res.bestMatch.target}".`);
			deps.data._eventTrigger();
		};

		const modeListHandler = () => {
			deps.mod.command.message("Current preset contains:");
			Object.keys(deps.data.preset.modes).forEach(key => {
				deps.mod.command.message(`${key}`);
			});
		};

		const commands = {
			"a": autoSettingHandler,
			"auto": autoSettingHandler,
			"c": classBasedPresetSettingHandler,
			"class": classBasedPresetSettingHandler,
			"h": helpHandler,
			"help": helpHandler,
			"m": activeModeHandler,
			"mode": activeModeHandler,
			"l": modeListHandler,
			"list": modeListHandler,
			"d": debugSettingsHandler,
			"debug": debugSettingsHandler
		};

		if (deps.mod.settings.customCommandsTag && deps.mod.settings.customCommandTag.length)
			prefixes.push(deps.mod.settings.customCommandsTag);

		if (deps.mod.settings.registerCommands)
			deps.mod.command.add(prefixes, commands, this);
	}
}
module.exports = Commands;