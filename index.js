/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const { Client, Options } = require('discord.js');
const { Patreon, token, babyBotToken } = require('./config');
const axios = require('axios');
const handlers = require('./handlers');

const ClientOptions = {
    makeCache: Options.cacheWithLimits({
        MessageManager: 10
    }),
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES']
};
const client = new Client(ClientOptions);

client.login(token).catch(error => console.error(error));

// Register our event handlers (defined below):
client.on('messageCreate', message => handlers.onMessage({ message, client }));
client.on('ready', async () => {
    //const guild = await client.guilds.fetch(Patreon.guild);
    //await guild.members.fetch().catch(console.error);
});

client.on('threadCreate', async (thread) => {
        if (thread.joinable) await thread.join();
    }
);

const checkWithBabyBot = async (userId = '') => {
    const response = await axios.get(`https://discordapp.com/api/guilds/${Patreon.guild}/members/${userId}`, {
        'headers': { 'Authorization': `Bot ${babyBotToken}` },
        'timeout': 1000
    }).catch(()=> {});
    if (response && response.data && response.data.roles) {
        if (response.data.roles.some(role => role === Patreon.role)) {
            if(response.data.nick) return response.data.nick;
            else return response.data.user.username
        }
    }
};

const sendMessage = async ({ message, embed, text, attachment }) => {
    const response = {};
    if (text) {
        response.content = text;
    }


    if (attachment) {
        response.files = [attachment];
    }

    if (embed) {
        response.embeds = [embed];
    }

    message.channel.send(response).catch(console.error);
}

exports.sendMessage = sendMessage;
exports.checkWithBabyBot = checkWithBabyBot;

