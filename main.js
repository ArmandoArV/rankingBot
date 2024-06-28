const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  switch (message.content) {
    case "!ping":
      message.channel.send("Pong!");
      break;
    case "!beep":
      message.channel.send("Boop!");
      break;
    case "!server":
      message.channel.send(
        `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`
      );
      break;
    case "!user-info":
      message.channel.send(
        `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
      );
      break;
  }
});

client.login(process.env.TOKEN); // Replace this with your bot's token.
