const main = require('../index');
const Discord = require('discord.js');

const stats = async ({ message, client }) => {
    const guilds = await client.shard.fetchClientValues('guilds.cache.size');
    const members = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));

    const totalGuilds = guilds.reduce((acc, guildCount) => acc + guildCount, 0);
    const totalMembers = members.reduce((acc, memberCount) => acc + memberCount, 0);
    const embed = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} Stats`)
        .setColor('WHITE')
        .setDescription(`${client.shard.count} shard${client.shard.count > 1 ? 's' : ''}.\nServer count: ${totalGuilds}\nMember count: ${totalMembers}`);
    await main.sendMessage({ message, embed });
};

module.exports = stats;
