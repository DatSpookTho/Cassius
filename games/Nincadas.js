/**
 * Example game
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file contains example code for a game (Trivia)
 *
 * @license MIT license
 */

'use strict';

const name = "Nincada's Natural Gift Givaway";
const id = Tools.toId(name);
const description = "Guess the type of Natural Gift by the berry given!";
const data = {
	"Pokemon Items": {},
};


for (let i in Tools.data.items) {
	let item = Tools.data.items[i];
	if (!item.name) continue;
	let name = item.name;
	if (!item.isBerry) continue;
	let type = item.naturalGift.type;	
    if (!type) continue;
		let str = "Nincada threw the **" + name + "**!";
	if (!(str in data)) data[str] = [];
	data[str].push(type);
}

class nincadas extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = id;
		this.description = description;
		this.freeJoin = true;
		this.answers = null;
		this.hint = null;
		this.points = new Map();
		this.maxPoints = 5;
		this.categories = Object.keys(data);
	}

	onSignups() {
		this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
	}

	setAnswers() {
		let question = Tools.sample(Object.keys(data));
		this.answers = data[question];
        this.hint = question;
	}
	
	onNextRound() {
		if (this.answers) {
			let answers = this.answers.length;
			this.say("Time's up! The answer" + (answers > 1 ? "s were" : " was") + " __" + this.answers.join(", ") + "__");
		}
		this.setAnswers();
		this.on(this.hint, () => {
			this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
		});
		this.say(this.hint);
	}

	checkAnswer(guess) {
		guess = Tools.toId(guess);
		for (let i = 0, len = this.answers.length; i < len; i++) {
			if (Tools.toId(this.answers[i]) === guess) {
				return true;
			}
		}
		return false;
	}

	guess(guess, user) {
		if (!this.answers || !this.checkAnswer(guess)) return;
		clearTimeout(this.timeout);
		if (!(user.id in this.players)) this.addPlayer(user);
		let player = this.players[user.id];
		let points = this.points.get(player) || 0;
		points += 1;
		this.points.set(player, points);
		if (points >= this.maxPoints) {
			this.say("Correct! " + user.name + " wins the game! (Answer" + (this.answers.length > 1 ? "s" : "") + ": __" + this.answers.join(", ") + "__)");
			this.end();
			return;
		}
		this.say("Correct! " + user.name + " advances to " + points + " point" + (points > 1 ? "s" : "") + ". (Answer" + (this.answers.length > 1 ? "s" : "") + ": __" + this.answers.join(", ") + "__)");
		this.answers = null;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.commands = {
	// command: game function
	// alias: command
	"guess": "guess",
	"g": "guess",
};
exports.aliases = ['nngg'];
exports.variations = [
];
exports.modes = ["Survival"];
exports.game = nincadas;