const functions = require('./');

async function commands(client, message, params, command, desc, channelEmoji, prefix) {
    switch(command) {
        //Character Tracker
        case 'character':
        case 'char':
            await functions.char(client, message, params, channelEmoji);
            break;
        // help module
        case 'help':
        case 'h':
            functions.help(client, message, params[0], prefix);
            break;
        case 'gleepglop':
        case 'species':
            functions.gleepglop(client, message, channelEmoji);
            break;
        case 'critical':
        case 'crit':
            functions.crit(message, params, channelEmoji);
            break;
        //!shipcrit command
        case 'shipcritical':
        case 'shipcrit':
            functions.shipcrit(message, params, channelEmoji);
            break;
        //Destiny Point Module
        case 'destiny':
        case 'd':
        case 'story':
        case 's':
            await functions.destiny(client, message, params, channelEmoji);
            break;
        // Roll the dice command
        case 'roll':
        case 'r':
            await functions.roll(client, message, params, channelEmoji, desc).roll;
            break;
        case 'reroll':
        case 'rr':
            await functions.reroll(client, message, params, channelEmoji);
            break;
        case 'initiative':
        case 'init':
        case 'i':
            await functions.initiative(client, message, params, channelEmoji);
            break;
        case 'obligation':
        case 'o':
            await functions.trigger(client, message, 'obligation');
            break;
        case 'duty':
            await functions.trigger(client, message, 'duty');
            break;
    }
}

exports.commands = commands;
