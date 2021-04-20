const { buildEmojiDB } = require('./buildEmojiDB');

const admin = async (client, message, params, command) => {
    switch(command) {
        case 'restart':
            await message.channel.send('Restarting, Sir!')
            await client.shard.respawnAll();
            break;
        case 'fix':
            break;
        case 'test':
            break;
        case 'build':
            await buildEmojiDB(client);
            break;
        default:
            break;
    }
};

exports.admin = admin;
