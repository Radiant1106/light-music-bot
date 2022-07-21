const { getVoiceConnection } = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "nowplaying",
    aliases: ["np", "current", "cur"],
    description: "Shows information about the current track",
    run: async (client, message, args, prefix) => {
        if(!message.member.voice.channelId) return message.reply("👎 **Please join a Voice-Channel first!**").catch(() => null);
        // get an old connection
        const oldConnection = getVoiceConnection(message.guild.id);
        if(!oldConnection) return message.reply("👎 **I'm not connected somewhere!**").catch(() => null);
        if(oldConnection && oldConnection.joinConfig.channelId != message.member.voice.channelId) return message.reply("👎 **We are not in the same Voice-Channel**!").catch(() => null);
        
        const queue = client.queues.get(message.guild.id); // get the queue
        if(!queue || !queue.tracks || !queue.tracks[0]) { 
            return message.reply(`👎 **Nothing playing right now**`).catch(() => null);
        }
        const song = queue.tracks[0];
        const curPos = oldConnection.state.subscription.player.state.resource.playbackDuration;
        
        const songEmbed = new MessageEmbed().setColor("FUCHSIA")
            .setTitle(`${song.title}`)
            .setURL(client.getYTLink(song.id))
            .addField(`ℹ️ **Upload-Channel:**`, `> ${song ? `[${song.channel.name}](${song.channel.url})` : `\`Unknown\``}`, true)
            .addField(`📅 **Upload-At:**`, `> ${song.uploadedAt}`, true)
            .addField(`💯 **Requester:**`, `> ${song.requester} \`${song.requester.tag}\``, true)
            .addField(`⏳ **Duration:**`, `> ${client.createBar(song.duration, curPos)}\n> **${client.formatDuration(curPos)} / ${song.durationFormatted}**`)
        if(song?.thumbnail?.url) songEmbed.setImage(`${song?.thumbnail?.url}`);

        return message.reply({content: `ℹ️ **Nowplaying Track**`, embeds: [songEmbed]}).catch(() => null);
    },
};