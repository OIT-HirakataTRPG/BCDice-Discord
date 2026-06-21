const { DynamicLoader } = require('bcdice');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');

const db = new Database('./db/setting.db');
const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('ヘルプを表示します'),

    async execute(interaction) {
        const user = getUser.get(interaction.user.id);
        const system = user ? user.system : 'DiceBot';
        const loader = new DynamicLoader();
        const GameSystem = await loader.dynamicLoad(system);
        const helpText = GameSystem.HELP_MESSAGE;
        await interaction.reply({
            content: (helpText.replace(/\*/g, '\\*')),
            allowedMentions: { repliedUser: false },
            flags: 'Ephemeral'
        });
    }
};

