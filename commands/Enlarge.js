import { MessageAttachment } from "discord.js";
import Command from "./base/Command";
import {
  EMOTE_ID_REGEX,
  EMOTE_IS_ANIMATED_REGEX
} from "../utils/discordPatterns.js";

export default class Enlarge extends Command {
  constructor() {
    super({
      name: "enlarge",
      category: "tool",
      description: "Returns an enlarged emote"
    });
  }

  async run(client, message, args) {
    // Tests if sent message is not an emote
    if (!EMOTE_ID_REGEX.test(args[0])) {
      message.channel.send(
        "Sorry, but to use this command you need to send emotes only~!"
      );
      return;
    }

    // Parses the emote id from the message
    const [emoteId] = EMOTE_ID_REGEX.exec(args[0]);
    // Determines the emote format
    const emoteFormat = EMOTE_IS_ANIMATED_REGEX.test(args[0]) ? ".gif" : ".png";
    // Concatenates the emote link
    const emoteLink = `https://cdn.discordapp.com/emojis/${emoteId}${emoteFormat}`;

    // Sends the emote link as an attachment
    message.channel.send(emoteLink);
  }
}