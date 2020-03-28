import Discord from "discord.js";

/**
 * Helper method to make your code have a delay without having to nest
 *
 * @param milliseconds {int}
 * @returns {Promise<void>}
 */
export function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Makes the bot type in a text channel. <br />
 * We use this over channel.startTyping because that function is buggy as hell
 *
 * @param channel {Discord.TextChannel}
 * @returns {Promise<void>}
 */
export function sendTyping(channel) {
  const endpoint = channel.client.api.channels[channel.id].typing;

  // This returns a promise so we don't have to make this function async
  return endpoint.post();
}

/**
 * Tests if two strings are equals in any case
 *
 * @param str1 {string}
 * @param str2 {string}
 * @returns {boolean}
 */
export function equalsIgnoreCase(str1, str2) {
  return str1.toUpperCase() === str2.toUpperCase();
}
