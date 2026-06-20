const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { DynamicLoader } = require('bcdice');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.commands = new Collection();

if (!fs.existsSync('./db')) {
	fs.mkdirSync('./db');
}
const db = new Database('./db/setting.db');
db.prepare(`CREATE TABLE IF NOT EXISTS DiceSystem (
	user_id INTEGER PRIMARY KEY,
	system TEXT NOT NULL
	);`).run();
const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);

const commandsPath = path.join(__dirname, 'commands/utility');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

async function diceroll(user_id, roll) {
	const user = getUser.get(user_id);
	const system = user ? user.system : 'DiceBot';
	const loader = new DynamicLoader();
	const GameSystem = await loader.dynamicLoad(system);
	const result = GameSystem.eval(roll);
	return result
}

client.on('messageCreate', async (message) => {
	if (message.author.bot) return
	var rollResult = await diceroll(message.author.id, message.content);
	try {
		if (rollResult.secret) {
			await message.reply({
				content: ("シークレットはアプリコマンドじゃないと作れなかったよ\nごめんね"),
				flags: 'SuppressNotifications'
			});
		} else {
			await message.reply({
				content: ("> " + message.content.replace('\*', '\\*') + "\n> ⇒ " + rollResult.text.replace('\*', '\\*')),
				allowedMentions: { repliedUser: false },
				flags: 'SuppressNotifications'
			});
		}
	} catch {
		return
	}
});

client.login(process.env.TOKEN);