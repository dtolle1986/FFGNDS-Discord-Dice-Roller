const fs = require('fs');
const emoji = require('./printValues').print;

const l5rDice = [
    'black', 'blacks', 'blackst', 'blacket', 'blacko', 'blackot',
    'white', 'whites', 'whiteso', 'whitest', 'whitee', 'whiteet', 'whiteo',
    'success', 'opportunity', 'explosiveSuccess', 'strife', 'whiteHex',
    'blackgif', 'whitegif'
];
const dice = [
    'yellow',
    'yellows',
    'yellowss',
    'yellowa',
    'yellowsa',
    'yellowaa',
    'yellowr',
    'green',
    'greens',
    'greenss',
    'greena',
    'greensa',
    'greenaa',
    'blue',
    'blues',
    'bluesa',
    'blueaa',
    'bluea',
    'red',
    'redf',
    'redff',
    'redt',
    'redft',
    'redtt',
    'redd',
    'purple',
    'purplef',
    'purpleff',
    'purplet',
    'purplett',
    'purpleft',
    'black',
    'blackf',
    'blackt',
    'whiten',
    'whitenn',
    'whitel',
    'whitell',
    'success',
    'advantage',
    'triumph',
    'failure',
    'threat',
    'despair',
    'lightpip',
    'darkpip',
    'lightside',
    'darkside',
    'purplediamond',
    'yellowgif',
    'greengif',
    'bluegif',
    'redgif',
    'purplegif',
    'blackgif',
    'whitegif'
];

const buildEmojiDB = async (client) => {
    const swrpg = await getEmoji('swrpg', client, dice);
    const genesys = await getEmoji('genesys', client, dice);
    const swrpgPatreon = await getEmoji('swrpgPatreon', client, dice);
    const genesysPatreon = await getEmoji('genesysPatreon', client, dice);
    const l5r = await getEmoji('l5r', client, l5rDice);
    const l5rPatreon = await getEmoji('l5rPatreon', client, l5rDice);
    fs.writeFile(`./emoji.json`, JSON.stringify({
        swrpg,
        swrpgPatreon,
        genesys,
        genesysPatreon,
        l5r,
        l5rPatreon
    }), () => console.log('The file has been saved!'));
};

getEmoji = (type, client, list) => {
    return new Promise(resolve => {
        const data = {};
        const process = list.map(async key => data[key] = await emoji(key, client, type));
        Promise.all(process).then(() => resolve(data));
    });
};

exports.buildEmojiDB = buildEmojiDB;
