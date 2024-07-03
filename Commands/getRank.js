const robloxLogin = require("../robloxLogin");
const noblox = require("noblox.js");
const { EmbedBuilder } = require("discord.js");
const { channelsId, rolesId, idGrupo } = require("../constants.json");

module.exports = {
  name: "get-rank",
  async execute(message) {
    const args = message.content.split(" ");
    const username = args[1];

    if (args.length < 2) {
      return message.channel.send("Please provide a username.");
    }

    console.log(`Username: ${username}`);

    let userId;
    try {
      await robloxLogin();
      userId = await noblox.getIdFromUsername(username);
      console.log(`User ID: ${userId}`);
    } catch (error) {
      console.error(`Error getting user ID from username: ${username}`, error);
      return message.reply(
        "There was an error trying to execute that command."
      );
    }

    try {
      await robloxLogin();
      const rank = await noblox.getRankNameInGroup(idGrupo, userId);
      console.log(`Rank: ${rank}`);

      const promotedEmbed = new EmbedBuilder()
        .setTitle(`Rango de ${username}`)
        .setDescription(`Rango: ${rank}`)
        .setColor("#00FF00");

      await message.channel.send({ embeds: [promotedEmbed] });
    } catch (error) {
      console.error(`Error getting rank for user ID: ${userId}`, error);
      message.reply("There was an error trying to execute that command.");
    }
  },
};
