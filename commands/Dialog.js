import { MessageAttachment } from "@yuuto-project/discord.js";
import axios from "axios";
import {
  EMOJI_REGEX,
  EMOTE_MENTIONS_REGEX,
  NONASCII_REGEX
} from "../utils/discordPatterns.js";
import Command from "./base/Command.js";

import { sendTyping } from "../utils/utils.js";

const backgrounds = [
  "bath",
  "beach",
  "cabin",
  "camp",
  "cave",
  "forest",
  "messhall"
];

const characters = [
  "aiden",
  "avan",
  "chiaki",
  "connor",
  "eduard",
  "felix",
  "goro",
  "hiro",
  "hunter",
  "jirou",
  "keitaro",
  "kieran",
  "knox",
  "lee",
  "naoto",
  "natsumi",
  "seto",
  "taiga",
  "yoichi",
  "yoshi",
  "yuri",
  "yuuto"
];

const backgroundString = backgrounds.join("`, `");
const charactersString = characters.join("`, `");

export default class Dialog extends Command {
  constructor() {
    super({
      name: "dialog",
      category: "fun",
      description:
        "Returns an image of a character in Camp Buddy saying anything you want",
      usage: `Run \`dialog <background> <character> <message>\` or \`dialog <character> <message>\` to give you an image of a Camp Buddy character with a custom dialog!\nAvailable backgrounds : \`${backgroundString}\`\nAvailable characters : \`${charactersString}\``
    });
  }

  async run(_client, message, args) {
    const { channel } = message;

    await sendTyping(channel);

    const now = Date.now();

    if (args.length < 2) {
      channel.send(
        "This command requires two arguments : `dialog [background] <character> <text>` ([] is optional)"
      );
      return;
    }

    let character = args.shift().toLowerCase();
    let background;

    if (characters.includes(character)) {
      background = "camp";
    } else {
      background = character;
      character = args.shift().toLowerCase();
    }

    if (!backgrounds.includes(background)) {
      channel.send(
        `Sorry, but I couldn't find \`${background}\` as a location\nAvailable backgrounds are : \`${backgroundString}\``
      );
      return;
    }

    if (!characters.includes(character)) {
      channel.send(
        `Sorry, but I don't think that \`${character}\` is a character in Camp Buddy\nAvailable characters are : \`${charactersString}\``
      );
      return;
    }

    if (args.length < 0) {
      channel.send("Please provide a message to send.");
      return;
    }

    // Gets the message by getting the rest of the args
    const text = args.join(" ");

    // Check if message is more than 120 chars
    if (text.length > 120) {
      channel.send(
        "Sorry, the message limit is 120 characters <:hiroJey:692008426842226708>"
      );
      return;
    }

    // Tests if message includes emoji or emotes
    if (
      EMOJI_REGEX.test(text) ||
      EMOTE_MENTIONS_REGEX.test(text) ||
      NONASCII_REGEX.test(text)
    ) {
      channel.send(
        "Sorry, I can't display emotes, mentions, or non-latin characters"
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://yuuto.dunctebot.com/dialog",
        { background, character, text },
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      const attachment = new MessageAttachment(
        Buffer.from(response.data),
        "result.png"
      );

      console.debug(
        `Generated image for ${character} at ${background}, took ${Date.now() -
          now}ms`
      );

      message.reply("here you go~!", attachment);
    } catch (err) {
      if (err.response.status === 429) {
        channel.send(
          "I can't handle this much load at the moment, maybe try again later? <:YoichiPlease:692008252690530334>"
        );
        return;
      }

      channel.send(
        `An error just happened in me, blame the devs <:YoichiLol:701312070880329800> - ${
          JSON.parse(err.response.data).message
        }`
      );
    }
  }
}
