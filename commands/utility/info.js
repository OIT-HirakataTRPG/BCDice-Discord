const { DynamicLoader } = require('bcdice');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const { translateSystemName } = require('../helper/translate_system_name');

const db = new Database('./db/setting.db');
const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);

const dicehelpEmbed = new EmbedBuilder()
    // .setTitle('DiceBotについて')
    .setColor(0x336699)


module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('ダイスの詳細を表示します'),

    async execute(interaction) {
        const user = getUser.get(interaction.user.id);
        const system = user ? user.system : 'DiceBot';
        const loader = new DynamicLoader();
        const GameSystem = await loader.dynamicLoad(system);
        const helpText = GameSystem.HELP_MESSAGE;
        if (['ShinobiGami', 'KyokoShinshoku', 'SwordWorld2.5'].includes(system)) {
            await interaction.reply({
                content: `>>> ### ${await translateSystemName(system)} ダイス説明\n${helpText.replace(/\*/g, '\\*')}`,
                allowedMentions: { repliedUser: false },
                flags: 'Ephemeral'
            });
            return
        }
        if (system !== 'DiceBot') {
            dicehelpEmbed.setFields({ name: `${await translateSystemName(system)} ダイス説明`, value: `>>> ${helpText.replace(/\*/g, '\\*')}` });
            dicehelpEmbed.addFields({ name: '共通ダイスの詳細は下記URLのコマンドガイドを参照', value: 'https://docs.bcdice.org/' });
        } else {
            dicehelpEmbed.setFields({ name: '共通ダイス', value: `>>> ${helpText.replace("詳細は下記URLのコマンドガイドを参照\nhttps://docs.bcdice.org/\n", "").replace(/^(.+)/gm, `- $1`)}` });
            dicehelpEmbed.addFields({ name: '詳細は下記URLのコマンドガイドを参照', value: 'https://docs.bcdice.org/' });
        }
        await interaction.reply({
            embeds: [dicehelpEmbed],
            allowedMentions: { repliedUser: false },
            flags: 'Ephemeral'
        });
    }
};

