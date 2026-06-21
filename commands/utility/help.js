const { DynamicLoader } = require('bcdice');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');

const dicehelpEmbed = new EmbedBuilder()
    .setTitle('DiceBotについて')
    .setColor(0x336699)


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('ダイスの詳細を表示します'),

    async execute(interaction) {
        dicehelpEmbed.setFields({ name: 'このBotについて', value: 'BCDiceを利用したDiscord用のダイスボットです' });
        dicehelpEmbed.addFields({ name: '\`/dice\`', value: 'ダイスを振ることができます' , inline: true });
        dicehelpEmbed.addFields({ name: '\`/d\`', value: '\`/dice\`の短縮版です' });
        dicehelpEmbed.addFields({ name: '\`/setdice\`', value: 'ダイスの種類を変更します' , inline: true });
        dicehelpEmbed.addFields({ name: '\`/info\`', value: 'ダイスの詳細を表示します' , inline: true });
        await interaction.reply({
            embeds: [dicehelpEmbed],
            allowedMentions: { repliedUser: false },
            flags: 'Ephemeral'
        });
    }
};

