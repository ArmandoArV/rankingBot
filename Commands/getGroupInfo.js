const noblox = require("noblox.js");

module.exports = {
  name: "group",
  async execute(message) {
    // Extract the group ID from the message content
    const args = message.content.split(" ");
    if (args.length < 2) {
      return message.channel.send("Please provide a group ID.");
    }
    const groupID = parseInt(args[1], 10);
    if (isNaN(groupID)) {
      return message.channel.send("Invalid group ID.");
    }

    try {
      // Authenticate with Noblox
      const currentUser = await noblox.setCookie(process.env.ROBLOX_COOKIE);
      console.log(
        `Logged in as ${currentUser.UserName} [${currentUser.UserID}]`
      );

      // Fetch the group information
      const groupInfo = await noblox.getGroup(groupID);
      console.log(groupInfo);

      // Send the group information to the Discord channel
      message.channel.send(
        `Group Name: ${groupInfo.name}\nGroup Description: ${groupInfo.description}\nMember Count: ${groupInfo.memberCount}`
      );
    } catch (error) {
      console.error(error);
      message.channel.send(
        "There was an error fetching the group information."
      );
    }
  },
};
