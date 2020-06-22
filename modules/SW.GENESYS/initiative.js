let functions = require('./');
const { readData, writeData } = require('../data');
const main = require('../../index');

const initiative = async (client, message, params, channelEmoji) => {
    let initiativeOrder = await readData(client, message, 'initiativeOrder');
    let merge = false;
    let write = true;
    if (Object.keys(initiativeOrder).length === 0) initiativeOrder = initializeInitOrder();
    if (!initiativeOrder.newslots) initiativeOrder.newslots = [];
    if (!initiativeOrder.slots) initiativeOrder.slots = [];
    let command = params.shift();
    switch(command) {
        //roll for initiativeOrder
        case 'roll':
        case 'r':
            merge = true;
            if (!params[0] || params[0] === 'npc' || params[0] === 'pc') {
                main.sendMessage(message, 'No dice defined.  ie \'!init roll yygg npc/pc\'');
                return;
            }
            if (!(params[params.length - 1] === 'npc' || params[params.length - 1] === 'pc')) {
                main.sendMessage(message, 'No Character type defined.  ie \'!init roll yygg npc/pc\'');
                return;
            }
            let type = params.pop();
            let diceResult = await functions.roll(client, message, params, channelEmoji, 'Initiative roll');
            diceResult = diceResult.results;
            let rollResult = {
                success: diceResult.success,
                advantage: diceResult.advantage,
                triumph: diceResult.triumph,
                type: type
            };
            if (initiativeOrder.turn !== 1) {
                initiativeOrder.newslots.push(rollResult);
                if (type === 'npc') {
                    main.sendMessage(message, ':smiling_imp: will be added to the initiative order in the next round')
                }
                if (type === 'pc') {
                    main.sendMessage(message, ':slight_smile: will be added to the initiative order in the next round')
                }
            } else {
                initiativeOrder.slots.push(rollResult);
            }
            break;
        //manually set initiativeOrder
        case 'set':
        case 's':
            initiativeOrder = initializeInitOrder();
            if (!params[0]) {
                main.sendMessage(message, 'No Initiative Order defined.  ie \'!init set nppnn\'');
                break;
            }
            for(let i = 0; i < params[0].length; i++) {
                switch(params[0][i]) {
                    case 'n':
                        initiativeOrder.slots.push({ type: 'npc' });
                        break;
                    case 'p':
                        initiativeOrder.slots.push({ type: 'pc' });
                        break;
                    default:
                        break;
                }
            }
            break;
        //Reset the initiativeOrder
        case 'reset':
            initiativeOrder = initializeInitOrder();
            message.reply(' resets the Initiative Order').catch(console.error);
            break;
        //advance to next Initiative slot
        case 'next':
        case 'n':
            if (initiativeOrder.turn + 1 > initiativeOrder.slots.length) {
                initiativeOrder.turn = 1;
                initiativeOrder.round++;
                main.sendMessage(message, 'New Round!');
                if (initiativeOrder.newslots.length > 0) {
                    initiativeOrder.slots = initiativeOrder.slots.concat(initiativeOrder.newslots);
                    initiativeOrder.newslots = [];
                }
            } else initiativeOrder.turn++;
            break;
        //previous Initiative slot
        case 'previous':
        case 'p':
            if (initiativeOrder.turn === 1 && initiativeOrder.round === 1) {
                main.sendMessage(message, 'Initiative is already at the starting turn!');
            } else if (initiativeOrder.turn - 1 < 1) {
                initiativeOrder.turn = initiativeOrder.slots.length;
                initiativeOrder.round--;
                main.sendMessage(message, 'Previous Round!');
            } else initiativeOrder.turn--;
            break;
        //manually modify the initiativeOrder
        case 'modify':
            //check if numbers are used
            if (!params[0]) {
                main.sendMessage(message, 'No Initiative Order defined.  ie \'!init set nppnn\'');
                break;
            }
            initiativeOrder.slots = [];
            for(let i = 0; i < params[0].length; i++) {
                switch(params[0][i]) {
                    case 'n':
                        initiativeOrder.slots.push({ type: 'npc' });
                        break;
                    case 'p':
                        initiativeOrder.slots.push({ type: 'pc' });
                        break;
                    default:
                        break;
                }
            }
            break;
        case 'remove':
            let slot = +params[0];
            if (Object.keys(initiativeOrder.slots[0]).length >
                1) initiativeOrder = sortInitiativeOrder(initiativeOrder);
            if (initiativeOrder.slots.length >= slot - 1) {
                message.reply(`Removing ${getFace(initiativeOrder.slots[slot - 1].type)} from slot ${slot}`);
                initiativeOrder.slots.splice(slot - 1, 1);
                if (slot < initiativeOrder.turn) initiativeOrder.turn--;
            } else message.reply(`There are not ${slot} slots!`);
            break;
        default:
            write = false;
            break;
    }
    if(write) {
        writeData(client, message, 'initiativeOrder', initiativeOrder, merge);
    }
    if (initiativeOrder.slots[0]) printInitiativeOrder(initiativeOrder, message);
    else main.sendMessage(message, 'No initiative order is set!');
};

//Adds a roll to the order and sorts it
const sortInitiativeOrder = (initiativeOrder) => {
    initiativeOrder.slots.sort((a, b) => {
        let nameA = a.type;
        let nameB = b.type;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    ['triumph', 'advantage', 'success'].forEach((symbol) => {
        initiativeOrder.slots.sort((a, b) => {
            if (a[symbol] < b[symbol]) return -1;
            if (a[symbol] > b[symbol]) return 1;
            return 0;
        });
    });
    initiativeOrder.slots.reverse();
    return initiativeOrder;
};

//initializeInitOrder
const initializeInitOrder = () => {
    return {
        turn: 1,
        round: 1,
        slots: [],
        newslots: []
    };
}

//Prints out Initiative Order to channel
const printInitiativeOrder = (initiativeOrder, message) => {
    if (Object.keys(initiativeOrder.slots[0]).length > 1) initiativeOrder = sortInitiativeOrder(initiativeOrder);
    let faces = '';
    for(let i = initiativeOrder.turn - 1; i < initiativeOrder.slots.length; i++) {
        faces += getFace(initiativeOrder.slots[i].type);
    }
    faces += ':repeat:';
    for(let i = 0; i < initiativeOrder.turn - 1; i++) {
        faces += getFace(initiativeOrder.slots[i].type);
    }
    main.sendMessage(message, 'Round: ' + initiativeOrder.round + ' Turn: ' + initiativeOrder.turn + ' Initiative Order: \n')
           ;
    if (faces === '') return;
    if (faces.length > 1500) faces = `Initiative order too long to display.`;

    main.sendMessage(message, faces);
}

const getFace = (type) => {
    switch(type) {
        case 'npc': // non-playable character
            return ':smiling_imp:';
        case 'pc': // playable character
            return ':slight_smile:';
        default:
            return ''; // Always return a string. Even an empty one.
    }
}

exports.initiative = initiative;
