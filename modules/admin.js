const { buildEmojiDB } = require('./buildEmojiDB');

const admin = async (client, message, params, command) => {
    switch(command) {
        case 'logout':
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
