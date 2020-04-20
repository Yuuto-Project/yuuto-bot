/*
 * The methods in this class have been inspired from JDA-utils
 * https://github.com/JDA-Applications/JDA-Utilities/blob/master/commons/src/main/java/com/jagrosh/jdautilities/commons/utils/FinderUtil.java
 */

import Discord from "@yuuto-project/discord.js";
import { equalsIgnoreCase } from "./utils.js";

// Regex constants to search
export const DISCORD_ID = /\d{17,20}/; // user id
export const USER_TAG = /(\S.{0,30}\S)\s*#(\d{4})/; // $1 -> username, $2 -> discriminator
export const USER_MENTION = /<@!?(\d{17,20})>/; // $1 -> ID

/**
 * Searches for users in the discord.js user cache <br/>
 * Note: This does not work for members
 *
 * @param query {string}
 * @param client {Discord.Client}
 * @returns {Discord.User[]}
 */
export function findUsers(query, client) {
  if (!(client instanceof Discord.Client)) {
    throw new Error("Client argument is not a discord client");
  }

  // eslint-disable-next-line no-use-before-define
  return genericUserCacheSearch(query, client.users);
}

/**
 * Searches for members in a guild
 *
 * @param query {string}
 * @param guild {Discord.Guild}
 * @returns {Discord.GuildMember[]}
 */
export function findMembers(query, guild) {
  if (!(guild instanceof Discord.Guild)) {
    throw new Error("Guild parameter is not a discord guild");
  }

  // eslint-disable-next-line no-use-before-define
  return genericUserCacheSearch(query, guild.members, "displayName");
}

/**
 * base logic for searching in the discord.js user or member cache
 *
 * @param query {string}
 * @param resolver {Discord.BaseManager}
 * @param nameKey {string} - The key under which the name of the entity is found
 * @returns {Discord.GuildMember[]|Discord.User[]}
 */
function genericUserCacheSearch(query, resolver, nameKey = "username") {
  if (!query) {
    return [];
  }

  let singleMatch = null;

  if (USER_MENTION.test(query)) {
    const userId = USER_MENTION.exec(query)[1];

    singleMatch = resolver.resolve(userId);
  } else if (USER_TAG.test(query)) {
    // The first comma ignores the first element
    // Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Ignoring_some_returned_values
    const [, username, discriminator] = USER_TAG.exec(query);

    // default to null as find may return undefined
    singleMatch =
      resolver.cache.find(u => {
        const userModel = u.user || u;

        return (
          (userModel.username === username || u[nameKey] === username) &&
          userModel.discriminator === discriminator
        );
      }) || null;
  } else if (DISCORD_ID.test(query)) {
    const userId = DISCORD_ID.exec(query)[0];

    singleMatch = resolver.resolve(userId);
  }

  if (singleMatch) {
    return [singleMatch];
  }

  const exactMatch = [];
  const wrongCase = [];
  const startsWith = [];
  const contains = [];
  const lowerQuery = query.toLowerCase();

  for (const [, user] of resolver.cache) {
    const { username } = user.user || user;
    const name = user[nameKey];

    if (name === query || username === query) {
      exactMatch.push(user);
    } else if (
      (equalsIgnoreCase(name, query) || equalsIgnoreCase(username, query)) &&
      !exactMatch.length
    ) {
      wrongCase.push(user);
    } else if (
      (name.toLowerCase().startsWith(lowerQuery) ||
        username.toLowerCase().startsWith(lowerQuery)) &&
      !wrongCase.length
    ) {
      startsWith.push(user);
    } else if (
      (name.toLowerCase().includes(lowerQuery) ||
        username.toLowerCase().includes(lowerQuery)) &&
      !startsWith.length
    ) {
      contains.push(user);
    }
  }

  return [...exactMatch, ...wrongCase, ...startsWith, ...contains];
}
