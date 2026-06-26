const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const Database = require("better-sqlite3");

const db = new Database("./db/setting.db", { verbose: console.log });
db.pragma("journal_mode = WAL");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('DBを初期化します'),

     async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({
                content: "このコマンドを実行するには管理者権限が必要です。",
                allowedMentions: { repliedUser: false },
                flags: 'Ephemeral'
            });
            return;
        }

        const clearDB = db.prepare(`DELETE FROM DiceSystem;`);
        clearDB.run();

        await interaction.reply({
            content: "DBを初期化しました",
            allowedMentions: { repliedUser: false },
            flags: 'Ephemeral'
        });
     }
};
