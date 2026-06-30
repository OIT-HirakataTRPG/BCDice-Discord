const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("stopbot").setDescription("Botを停止します"),

	async execute(interaction) {
		if (!interaction.inGuild()) {
			await interaction.reply({
				content: "DMではこのコマンドを実行できません",
				allowedMentions: { repliedUser: false },
				flags: "Ephemeral",
			});
			return;
		}

		if (
			interaction.guild.id !== process.env.ADMINGUILDID ||
			!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
		) {
			await interaction.reply({
				content: "このコマンドを実行するには管理者権限が必要です",
				allowedMentions: { repliedUser: false },
				flags: "Ephemeral",
			});
			return;
		}

		await interaction.reply({
			content: `\# ⚠情報漏洩厳禁⚠\nDocURL: ${process.env.DOCURL}`,
			allowedMentions: { repliedUser: false },
			flags: "Ephemeral",
		});
	},
};
