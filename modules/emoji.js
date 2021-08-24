const emojiFile = require('../emoji.json');

const emoji = (string, type = 'swrpg') => emojiFile[type][string];

module.exports = emoji;
