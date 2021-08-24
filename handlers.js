const Discord = require('discord.js');
const { toLower } = require('lodash');
const { version } = require('./package.json');
const config = require('./config');
const { buildPrefix, buildParams, buildCommand, buildDescriptor } = require('./modules/functions');
const { readData, writeData } = require('./modules/data');
const modules = require('./modules/');
const main = require('./index');
const swCommands = require('./modules/SW.GENESYS/').commands;
const l5rCommands = require('./modules/L5R/').commands;

//Called whenever a users send a message to the server
const onMessage = async ({ message, client }) => {
    //Ignore messages sent by the bot
    if (message.author.bot) return;

    //check to see if bot can send messages on channel and external emoji can be used
    if (message.channel.type !== 'DM') {
        if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
        if (!message.channel.permissionsFor(client.user).has('USE_EXTERNAL_EMOJIS')) {
            await main.sendMessage({
                message,
                text: `Please enable \'Use External Emoji\' permission for ${client.user.username}`
            });
            return;
        }
        if (!message.channel.permissionsFor(client.user).has('EMBED_LINKS')) {
            await main.sendMessage({
                message,
                text: `Please enable \'Embed Links\' permission for ${client.user.username}`
            });
            return;
        }
    }

    let prefix, params, command, desc, channelEmoji;

    //build the prefix
    prefix = await buildPrefix(client, message);
    if (!prefix) return;

    //build params
    params = buildParams(message, prefix);
    if (!params) return;

    //build command
    [command, params] = buildCommand(params);
    if (!command || command === 'play') return;

    //get channelEmoji
    if (!channelEmoji) channelEmoji = await readData(client, message, 'channelEmoji').catch(console.error);

    //check for Patron
    const member = await main.checkWithBabyBot(message.author.id);

    if (member) {
        channelEmoji += 'Patreon';
    }

    //make the descriptor
    [desc, params] = buildDescriptor(params);

    //set the rest of params to lowercase
    params = params.filter(Boolean);
    params.forEach((param, index) => params[index] = toLower(param));

    console.log(`${message.author.username}, ${command}, ${params}, ${new Date()}`);

//************************COMMANDS START HERE************************

    switch (command) {
        case 'stats':
            await modules.stats({ client, message });
            break;
        case 'ver':
        case 'v':
            await main.sendMessage({ message, text: `${client.user.username}: version: ${version}` });
            break;
        case 'poly':
        case 'p':
            modules.poly(params, message);
            break;
        case 'swrpg':
        case 'genesys':
        case 'l5r':
            writeData(client, message, 'channelEmoji', command);
            await main.sendMessage({
                message, text: `${client.user.username} will now use ${command} dice`
            });
            break;
        case 'prefix':
            if (message.channel.type === 'dm') {
                await main.sendMessage({ message, text: 'Prefix cannot be changed in DMs' });
            } else await modules.prefix(client, message, params);
            break;
        case 'invite':
            const embed = new Discord.MessageEmbed()
                .setColor('GREY')
                .setTitle(`**Invite**`)
                .setDescription(`Click [here](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=105227020288&scope=bot%20applications.commands) to invite the bot to your server!`);
            await main.sendMessage({ message, embed });
            break;
    }
    if (message.author.id === config.adminID) {
        await modules.admin({ client, message, params, command });
    }
    switch (channelEmoji) {
        case 'swrpg':
        case 'swrpgPatreon':
        case 'genesys':
        case 'genesysPatreon':
            await swCommands({ client, message, params, command, desc, channelEmoji, prefix });
            break;
        case 'l5r':
        case 'l5rPatreon':
            await l5rCommands({ client, message, params, command, desc, channelEmoji, prefix });
            break;
        default:
            break;

    }
};

exports.onMessage = onMessage;
