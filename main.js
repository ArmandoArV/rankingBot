const { Client, IntentsBitField, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`Loaded command: ${command.name}`); // Debug log for command loading
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  console.log(`Received message: ${message.content}`); // Debug log for received message

  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).split(" ");
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) {
    console.log(`Command not found: ${commandName}`); // Debug log for command not found
    return;
  }

  try {
    console.log(`Executing command: ${commandName}`);
    await command.execute(message);
  } catch (error) {
    console.error(`Error executing command: ${commandName}`, error);
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(process.env.TOKEN);
