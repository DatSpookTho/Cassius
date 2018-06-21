/**
 * Trivia game
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * @license MIT license
 */

'use strict';

const Room = require('./../rooms').Room; // eslint-disable-line no-unused-vars
const User = require('./../users').User; // eslint-disable-line no-unused-vars

const name = "Elgyem's Number Encoder";

const data = {
	"Pokemon": {},
};

// if inheriting from or inherited by another game, this class would be declared as:
// let Trivia = base => class extends base {
class Elgyems extends Games.Game {
	/**
	 * @param {Room} room
	 */
	constructor(room) {
		super(room);
		this.freeJoin = true;
		/**@type {Array<string>} */
		this.answers = [];
		/**@type {?NodeJS.Timer} */
		this.timeout = null;
		this.hint = '';
		this.points = new Map();
		this.maxPoints = 3;
		this.categories = Object.keys(data);
		this.questions = {};
		for (let i = 0, len = this.categories.length; i < len; i++) {
			this.questions[this.categories[i]] = Object.keys(data[this.categories[i]]);
		}
	}

	onSignups() {
		this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
	}
	
	convert(char) {
		return char.charCodeAt() - 96;
	}
	
	convertMon(monName) {
		return monName.split("").map(char => this.convert(char)).join("-");
	}
	
	setAnswers() {
		let mon = Tools.sample(Object.keys(Tools.data.pokedex));
                this.answers = [Tools.data.pokedex[mon].species];
                this.hint = "**Pokemon**: " + this.convertMon(mon);
	}


	onNextRound() {
		if (this.answers.length) {
			this.say("Time's up! The answer" + (this.answers.length > 1 ? "s were" : " was") + " __" + this.answers.join(", ") + "__");
		}
		this.setAnswers();
		this.on(this.hint, () => {
			this.timeout = setTimeout(() => this.nextRound(), 30 * 1000);
		});
		this.say(this.hint);
	}
}

exports.name = name;
exports.id = Tools.toId(name);
exports.description = "Players guess answers based on the given descriptions!";
exports.commands = {
	// command: game function
	// alias: command
	"guess": "guess",
	"g": "guess",
};
exports.aliases = ['ene'];
exports.variations = [
];
exports.modes = ["Survival", "Team"];
// if inheriting from or inherited by another game, this game would be exported as:
// exports.install = Trivia;
exports.game = Elgyems;

/**
 * @param {Elgyems} game
 */
exports.spawnMochaTests = function (game) {
	// you can skip tests for variations or modes by checking "game.variationId" or "game.modeId" here
	if (game.modeId) return;

	const assert = require('assert');

	let tests = {
		/**
		 * @param {Elgyems} game
		 */
		'guess': game => {
			game.signups();
			game.nextRound();
			MessageParser.parseCommand(Config.commandCharacter + 'guess ' + game.answers[0], game.room, Users.add("User 1"));
			assert(game.points.get(game.players['user1']) === 1);
		},
	};

	return tests;
};