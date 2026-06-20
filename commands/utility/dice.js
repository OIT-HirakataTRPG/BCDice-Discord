const { SlashCommandBuilder } = require('discord.js');
const { DynamicLoader } = require('bcdice');

async function diceroll(system, roll) {
    const loader = new DynamicLoader();
    const GameSystem = await loader.dynamicLoad(system);
    const result = GameSystem.eval(roll);
    return result
}


module.exports = {
    data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('ダイスを振れます')
    .addStringOption(option =>
        option.setName('roll')
            .setDescription('ダイスの値')
            .setRequired(true)),

    async execute(interaction) {
        var rollResult = await diceroll('Cthulhu', interaction.options.getString('roll'));
        try {
            await interaction.reply({
                content: ("> " + interaction.options.getString('roll') + "\n> ⇒ " + rollResult.text),
                allowedMentions: { repliedUser: false }
            });
        } catch {
            await interaction.reply({
                content: ("入力に誤りがあります"),
                allowedMentions: { repliedUser: false },
                flags: 'Ephemeral'
            });
        }
        
    },
};

