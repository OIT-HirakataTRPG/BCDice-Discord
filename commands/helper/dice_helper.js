const { DynamicLoader } = require('bcdice');

async function diceroll(system, roll) {
    const loader = new DynamicLoader();
    const GameSystem = await loader.dynamicLoad(system);
    const result = GameSystem.eval(roll);
    return result
}

async function executeDice(interaction, system , roll) {
    var rollResult = await diceroll(system, roll);
    try {
        if (rollResult.secret) {
            await interaction.reply({
                content: ("> " + roll.replace('\*', '\\*') + "\n> ⇒ " + rollResult.text.replace('\*', '\\*')),
                allowedMentions: { repliedUser: false },
                flags: 'Ephemeral'
            });
        } else {
            await interaction.reply({
                content: ("> " + roll.replace('\*', '\\*') + "\n> ⇒ " + rollResult.text.replace('\*', '\\*')),
                allowedMentions: { repliedUser: false },
                flags: 'SuppressNotifications'
            });
        }
    } catch {
        await interaction.reply({
            content: ("入力に誤りがあります"),
            allowedMentions: { repliedUser: false },
            flags: 'Ephemeral'
        });
    }
}

module.exports = {
    executeDice
};