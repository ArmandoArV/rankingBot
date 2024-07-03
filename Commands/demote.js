const robloxLogin = require("../robloxLogin");
const noblox = require("noblox.js");
const { EmbedBuilder } = require("discord.js");
const { channelsId, rolesId, idGrupo } = require("../constants.json");

module.exports = {
  name: "demote",
  async execute(message) {
    const args = message.content.split(" ");
    const username = args[1];
    if (!username) {
      return message.channel.send("Please provide a username.");
    }

    // Check if the user has the specific role to demote
    const requiredRoleId = rolesId.admin;
    if (!message.member.roles.cache.has(requiredRoleId)) {
      return message.channel.send(
        "You do not have permission to use this command."
      );
    }

    try {
      await robloxLogin();
      const userId = await noblox.getIdFromUsername(username);
      console.log(`User ID: ${userId}`);

      // Check if the user is in the group
      const userRankInGroup = await noblox.getRankInGroup(idGrupo, userId);
      if (userRankInGroup === 0) {
        return message.channel.send("The user is not in the group.");
      }

      const userInfo = await noblox.getPlayerInfo(userId);
      const currentRank = await noblox.getRankNameInGroup(idGrupo, userId);
      const newRank = await noblox.demote(idGrupo, userId);
      const newRankName = await noblox.getRankNameInGroup(idGrupo, userId);

      message.channel.send(
        `User ${username} has been demoted to ${newRankName}.`
      );

      const demotionEmbed = new EmbedBuilder()
        .setTitle("Demotion Approved")
        .setDescription(
          `User: ${userInfo.username}\nRank: ${currentRank} ➜ ${newRankName}\nDemoted by: ${message.author.username}`
        )
        .setThumbnail(`https://static.thenounproject.com/png/3427785-200.png`)
        .setColor("#FF0000");

      const promotionLogsChannel = await message.client.channels.fetch(
        channelsId.logsDegrados
      );
      await promotionLogsChannel.send({ embeds: [demotionEmbed] });
    } catch (error) {
      console.error(`Error trying to demote user: ${username}`, error);
      if (error.message.includes("User not found")) {
        message.reply("User not found on Roblox.");
      } else if (error.message.includes("403")) {
        message.reply("You do not have permission to demote this user.");
      } else {
        message.reply("There was an error trying to execute that command.");
      }
    }
  },
};
