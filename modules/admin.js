const build = require('./build');

const admin = async ({ client, message, command }) => {
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
            await build(client);
            break;
        default:
            break;
    }
};

module.exports = admin;

