import owoify from "owoify-js";
import Command from "./base/Command.js";
import { EMOTE_ID_REGEX } from "../utils/discordPatterns.js";

export default class Owoify extends Command {
  #intensities = {
    easy: "owo",
    medium: "uwu",
    hard: "uvu"
  };

  constructor() {
    super({
      name: "owoify",
      category: "fun",
      description: "This command will owoify your text",
      usage: `Run \`owoify <text>\` or \`owoify <intensity> <text>\` to owoify any text!\nIntensities available are \`easy\` (default), \`medium\`, and \`hard\`.`
    });
  }

  run(client, message, args) {
    let level = "owo";

    if (!args.length) {
      message.channel.send(
        `${message.author}, can you please provide me a message? <:YoichiPlease:692008252690530334>`
      );
      return;
    }

    if (this.#intensities[args[0]]) {
      level = this.#intensities[args.shift()];
    }

    let cursedText = "";
    const charCount = args.map(a => a.length).reduce((a, b) => a + b, 0);

    if (charCount > 1000) {
      message.channel.send("Sorry, but the character limit is 1000~!");
      return;
    }

    args.forEach(arg => {
      if (!EMOTE_ID_REGEX.test(arg)) {
        cursedText += `${owoify.default(arg, level)} `;
      } else {
        cursedText += `${arg} `;
      }
    });

    message.channel.send(
      `OwO-ified for ${message.author}~!\n\n${cursedText.replace(/`/g, "\\`")}`
    );
  }
}
