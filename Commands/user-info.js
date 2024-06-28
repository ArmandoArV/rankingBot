const robloxLogin = require("../robloxLogin");
const noblox = require("noblox.js");

module.exports = {
  name: "requerir",
  async execute(message) {
    try {
      // Send a direct message to the user asking for their Roblox username
      await message.author.send("Please provide your Roblox username.");
      console.log(
        `Sent DM to user: ${message.author.username} [${message.author.id}]`
      );

      // Set up a message collector to collect the user's response
      const filter = (response) => response.author.id === message.author.id;
      const dmChannel = await message.author.createDM();

      dmChannel
        .awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
        .then(async (collected) => {
          const username = collected.first().content.trim();
          console.log(
            `Received username from user: ${message.author.username} [${message.author.id}] - ${username}`
          );

          try {
            // Authenticate with Roblox
            await robloxLogin();

            // Fetch the Roblox user information
            const UserID = await noblox.getIdFromUsername(username);
            console.log(`User info: ${JSON.stringify(UserID)}`);

            // Send the user information to the Discord channel
            await dmChannel.send(`User ID: ${UserID}`);
          } catch (error) {
            console.error(
              `Error fetching info for Roblox user: ${username}`,
              error
            );
            await dmChannel.send(
              "There was an error fetching the Roblox user information. Please ensure the username is correct."
            );
          }
        })
        .catch(async () => {
          console.log(
            "Time ran out or an error occurred while waiting for username."
          );
          await dmChannel.send(
            "You did not provide your Roblox username in time."
          );
        });
    } catch (error) {
      console.error(
        `Error in !requerir command for user: ${message.author.username} [${message.author.id}]`,
        error
      );
      message.reply("There was an error trying to execute that command.");
    }
  },
};
