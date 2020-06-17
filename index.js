/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');
const handlers = require('./handlers');
client.login(config.token).catch(error => console.error(error));

client.on('message', msg => handlers.onMessage(msg, client));
client.on('ready', () => handlers.onReady(client));

const sendMessage = (message, text, attachment) => {
    message.channel.send(text, attachment && attachment).catch(console.error);
};

exports.sendMessage = sendMessage;

