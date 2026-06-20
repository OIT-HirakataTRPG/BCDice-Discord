const { SlashCommandBuilder } = require('discord.js');
const { executeDice } = require('../helper/dice_helper');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('d')
        .setDescription('ダイスを振れます')
        .addStringOption(option =>
            option.setName('roll')
                .setDescription('ダイスの値')
                .setRequired(true)),

    async execute(interaction) {
        const roll = interaction.options.getString('roll');
        const system = 'Cthulhu';
        await executeDice(interaction, system, roll);
    }
};

