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

// Called every time the bot connects to Twitch chat:
const onReady = client => {
    console.log(`Logged in as ${client.user.username}!`);
    console.log(`Version: ${version}`);
};

//Called whenever a users send a message to the server
const onMessage = async (message, client) => {
    let prefix, params, command, desc, channelEmoji;

    //Ignore messages sent by the bot
    if (message.author.bot) return;

    //check to see if bot can send messages on channel and external emoji can be used
    if (message.channel.type !== 'dm') {
        if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
        if (!message.channel.permissionsFor(client.user).has('USE_EXTERNAL_EMOJIS')) {
            main.sendMessage(message, `Please enable \'Use External Emoji\' for ${client.user.username}`);
            return;
        }
    }

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
    channelEmoji = main.channelEmoji[message.channel.id];
    if (!channelEmoji) channelEmoji = await readData(client, message, 'channelEmoji').catch(console.error);
    main.addChannelEmoji(message, channelEmoji);

    //check for Patron
    if (config.patronDiceRole && config.patreonGuild && config[`${channelEmoji}Patreon`]) {
        if (await modules.checkPatreon(client, message.author.id)) channelEmoji += 'Patreon';
        if (!channelEmoji.includes('Patreon') && config.patronMegaRole && message.guild) {
            if (await modules.checkPatreonServer(client, message.guild.ownerID)) {
                channelEmoji += 'Patreon';
            }
        }
    }

    //make the descriptor
    [desc, params] = buildDescriptor(params);

    //set the rest of params to lowercase
    params = params.filter(Boolean);
    params.forEach((param, index) => params[index] = toLower(param));

    console.log(`${message.author.username}, ${command}, ${params}, ${new Date()}`);

//************************COMMANDS START HERE************************

    switch(command) {
        case 'stats':
            modules.buildStats(client, message);
            break;
        case 'ver':
        case 'v':
            main.sendMessage(message, `${client.user.username}: version: ${version}`);
            break;
        case 'poly':
        case 'p':
            modules.poly(params, message);
            break;
        case 'swrpg':
        case 'genesys':
        case 'l5r':
            writeData(client, message, 'channelEmoji', command);
            main.addChannelEmoji(message, command);
            main.sendMessage(message, `${client.user.username} will now use ${command} dice`);
            break;
        case 'prefix':
            if (message.channel.type === 'dm') {
                main.sendMessage(message, 'Prefix cannot be changed in DMs');
            } else await modules.prefix(client, message, params);
            break;
        case 'invite':
            const embed = new Discord.MessageEmbed()
                .setColor('777777')
                .setTitle(`**Invite**`)
                .setDescription(`Click [here](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=280576) to invite the bot to your server!`);
            main.sendMessage(message, { embed });
            break;
    }
    if (message.author.id === config.adminID) {
        await modules.admin(client, message, params, command);
    }
    switch(channelEmoji) {
        case 'swrpg':
        case 'swrpgPatreon':
        case 'genesys':
        case 'genesysPatreon':
            swCommands(client, message, params, command, desc, channelEmoji, prefix);
            break;
        case 'l5r':
        case 'l5rPatreon':
            l5rCommands(client, message, params, command, desc, channelEmoji, prefix);
            break;
        default:
            break;

    }
};

exports.onReady = onReady;
exports.onMessage = onMessage;
