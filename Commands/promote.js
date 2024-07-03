const robloxLogin = require("../robloxLogin");
const noblox = require("noblox.js");
const { EmbedBuilder } = require("discord.js");
const { channelsId, rolesId, idGrupo } = require("../constants.json");

module.exports = {
  name: "promote",
  async execute(message) {
    // Based on the provided username, the bot will promote the user to the next rank
    const args = message.content.split(" ");
    const username = args[1];
    if (args.length < 2) {
      return message.channel.send("Please provide a username.");
    }

    let userId;
    try {
      await robloxLogin();
      userId = await noblox.getIdFromUsername(username);
      console.log(`User ID: ${userId}`);
    } catch (error) {
      console.error(
        `Error trying to get the user ID from the provided username: ${username}`,
        error
      );
      return message.reply(
        "There was an error trying to execute that command."
      );
    }

    try {
      await robloxLogin();
      const userInfo = await noblox.getPlayerInfo(userId); // to get user info for the embed
      const rank = await noblox.getRankNameInGroup(idGrupo, UserID);
      await noblox.promote(idGrupo, userId);
      message.channel.send(`User ${username} has been promoted.`);

      const promotedEmbed = new EmbedBuilder()
        .setTitle("Promotion Approved")
        .setDescription(
          `User: ${userInfo.username}\nRank: ${rank}\nPromoted by: ${message.author.username}`
        )
        .setColor("#00FF00");

      const promotionLogsChannel = await message.client.channels.fetch(
        channelsId.logsPromos
      );
      await promotionLogsChannel.send({ embeds: [promotedEmbed] });
    } catch (error) {
      console.error(`Error trying to promote user: ${username}`, error);
      message.reply("There was an error trying to execute that command.");
    }
  },
};
