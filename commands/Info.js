import { MessageEmbed } from "@yuuto-project/discord.js";
import Command from "./base/Command.js";

export default class Info extends Command {
  constructor() {
    super({
      name: "info",
      category: "info",
      description: "Shows information about the Yuuto bot",
      aliases: ["credits", "bot"],
      usage: `Show information about the Yuuto bot.`
    });
  }

  run(client, message) {
    const embed = new MessageEmbed()
      .setColor("#FF93CE")
      .setAuthor(
        "Yuuto from Camp Buddy",
        "https://cdn.discordapp.com/emojis/593518771554091011.png",
        "https://blitsgames.com"
      )
      .setDescription(
        "Yuuto was made and developed by the community, for the community. \n" +
          "Join the dev team and start developing on the [project website](https://iamdeja.github.io/yuuto-docs/). \n\n" +
          "Version 2.0 was made and developed by: \n" +
          "**Arch#0226**, **dunste123#0129**, **Tai Chi#4634**, **zsotroav#8941** \n \n" +
          "Quick Change log: \n" +
          "```diff\n" +
          "+ Added dialog maker \n" +
          "+ Added minigame with the first question pack. \n" +
          "+ Added ship command \n" +
          "+ Added character info (char) command \n" +
          "+ Added owoify (owo) command \n" +
          "+ Fixed Yuuto's playing status disappearing. \n```"
      )
      .setFooter("Yuuto Bot: Release 2.0 | 2020-05-04");

    message.channel.send(embed);
  }
}
