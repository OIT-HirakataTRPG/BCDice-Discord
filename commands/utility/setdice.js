const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setdice')
        .setDescription('ダイスの設定を変更します')
        .addStringOption(option =>
            option.setName('system')
                .setDescription('使用するゲームシステムを指定します')
                .setRequired(true)
                .addChoices(
				{ name: '通常ダイス', value: 'DiceBot' },
				{ name: 'CoC6版', value: 'Cthulhu' },
				{ name: 'CoC7版', value: 'Cthulhu7th' },
                { name: 'シノビガミ', value: 'Shinobigami' },
                { name: 'ダブルクロス3rd', value: 'DX3' },
                { name: 'エモクロア', value: 'Emoklore' },
                { name: '虚構侵蝕', value: 'KyokoShinshoku' },
                { name: 'ソード・ワールド2.5', value: '	SwordWorld2.5' },
                { name: 'nRR', value: 'NRR' })
			),
    
    async execute(interaction) {
        await interaction.reply({
            content: (`(工事中)使用するダイスを ${interaction.options.getString('system')} に設定しました`),
            allowedMentions: { repliedUser: false },
            flags: 'Ephemeral'
        });
    }
};