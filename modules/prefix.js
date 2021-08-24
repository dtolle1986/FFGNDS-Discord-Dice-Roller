const { writeData } = require('./data');
const main = require('../index');

const prefix = async (client, message, params) => {
    const guildRoles = await message.guild.roles.cache;

    let botRole = guildRoles.find(val => val.name === client.user.username);
    let userRoles = message.member.roles.cache;
    if (botRole) {
        if (!userRoles.some(role => role.comparePositionTo(botRole) > 0)) {
            await main.sendMessage({
                message,
                text: `${message.author.username} does not have a role high enough to change prefix`
            });
            return;
        }
    }
    if (!params[0]) {
        await main.sendMessage({ message, text: `Please include a single symbol prefix ie \`!prefix $\`` });
        return;
    }
    writeData(client, message, 'prefix', params[0][0]);
    await main.sendMessage({
        message,
        text: `${client.user.username} will now use ${params[0][0]} as the activator for this server`
    });
};

module.exports = prefix;
