// eslint-disable-next-line no-unused-vars
import Discord from "@yuuto-project/discord.js";

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

/**
 * Returns a shuffled COPY of arr using modern Fisher-Yates algorithm.
 *
 * @param arr {Array<int>}
 * @returns {Array<int>}
 */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * Escapes all markdown characters from a username
 *
 * @param user {Discord.GuildMember|Discord.User} the member to get the escaped name from
 * @returns {string} The escaped username
 */
export function escapeUsername(user) {
  let name;

  // Allow both a user and a member to be inserted
  if (user instanceof Discord.GuildMember) {
    name = user.displayName;
  } else if (user instanceof Discord.User) {
    name = user.username;
  } else {
    throw new Error("User must be a member or a user.");
  }

  return name.replace(/[`*_~>]/g, "\\$&");
}
