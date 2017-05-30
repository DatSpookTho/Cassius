/**
 * Commands
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file contains the base commands for Cassius.
 *
 * @license MIT license
 */

'use strict';

let commands = {
	// Developer commands
	js: 'eval',
	eval: function (target, room, user) {
		if (!user.isDeveloper()) return;
		try {
			target = eval(target);
			this.say(JSON.stringify(target));
		} catch (e) {
			this.say(e.name + ": " + e.message);
		}
	},

	// Informational commands
	about: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say(Config.username + " code by sirDonovan: https://github.com/sirDonovan/Cassius with additions made by Spooktune~");
	},
	
	beep: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		this.say("boop");
	},

	argbeep: function (arg, target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		Client.send("scrabble|/me boops " + arg);
	},
	
	intro: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!addhtmlbox <div>Welcome to Scrabble!<li> <a href='http://scrabble-ps.weebly.com'>PS Scrabble Website</a></li> <li><a href='https://en.crosswordsarena.com/'>Play Scrabble!</a></li></ul></div>");
	},

	roomdesc: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!addhtmlbox <div>Play Scrabble with friends, join Scrabble tournaments, and compete in the exciting new Scrabblemons metagame!</div>");
	},
	
	nt: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		this.say("this is why I don't play with timer.");
	},
	
	say: function (arg, target, room, user) {
		if (room !== user || !user.hasRank(room, '+')) return;
		this.say(arg);
	},
	
	commands: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("https://hastebin.com/napopihubi.diff");
	},
	
	git: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say("https://github.com/DatSpookTho/Pwogg");
	},
	
	wotw: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		Client.send('scrabble|!addhtmlbox <img src="http://i.imgur.com/MhUaWqH.png" height="95" width="320"><div>ˈ<b> Word of the Week:</b> /ik-see-uh/ (Noun) Any of the genus Ixia of cormous plants native to South Africa. <b>Scrabble Points:</b> 7 in Crosswords Arena, 11 in Scrabble </div>');
	},
	
	tour: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '%')) return;
		Client.send('scrabble|/tour create gen 7 ubers, elimination');
		Client.send('scrabble|/wall This is a Scrabblemons Tour! Only use a Scrabblemons team! Info on Scrabblemons can be found here: http://scrabble-ps.weebly.com/scrabble-mons-guide.html. Using banned Pokemon are strictly prohibited, and you will be disqualified if you are caught using one.');

	},
	
	tourstart: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '%')) return;
		Client.send('scrabble|/tour start');
		Client.send('scrabble|/wall Good luck to everyone!');
	},
	
	
	//client.send("scrabble|/mn	
	// Game commands
	signups: 'creategame',
	creategame: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		if (!Config.games || !Config.games.includes(room.id)) return this.say("Games are not enabled for this room.");
		if (!Games.createGame(target, room)) return;
		room.game.signups();
	},
	start: 'startgame',
	startgame: function (target, room, user) {
		if (!room.game || !user.hasRank(room, '+')) return;
		room.game.start();
	},
	end: 'endgame',
	endgame: function (target, room, user) {
		if (!room.game || !user.hasRank(room, '+')) return;
		room.game.forceEnd();
	},
	join: 'joingame',
	joingame: function (target, room, user) {
		if (!room.game) return;
		room.game.join(user);
	},
	leave: 'leavegame',
	leavegame: function (target, room, user) {
		if (!room.game) return;
		room.game.leave(user);
	},

	//memes
	topaz: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Excadrill");
	},
	
	arandom: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Ducklett");
	},
	
	spook: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Heatmor");
	},
	
	snap: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Misdreavus");
	},
	
	dsg: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Giratina-Origin");
	},

	order: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Zygarde-10%");
	},
	
	azu: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Celebi");
	},
	
	sty: function (target, room, user) {
		if (!user.hasRank(room, '+')) return;
		Client.send("scrabble|!dt Drifblim");
	},
	
	// Storage commands
	bits: 'points',
	points: function (target, room, user) {
		if (room !== user) return;
		let targetUserid = target ? Tools.toId(target) : user.id;
		let points = [];
		user.rooms.forEach((rank, room) => {
			if (!(room.id in Storage.databases) || !('leaderboard' in Storage.databases[room.id])) return;
			if (targetUserid in Storage.databases[room.id].leaderboard) points.push("**" + room.id + "**: " + Storage.databases[room.id].leaderboard[targetUserid].points);
		});
		if (!points.length) return this.say((target ? target.trim() + " does not" : "You do not") + " have points on any leaderboard.");
		this.say(points.join(" | "));
	},

};

module.exports = commands;
