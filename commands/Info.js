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
          "Version 1.0 was made and developed by: \n" +
          "**Arch#0226**, **Dé-Jà-Vu#1004**, **dunste123#0129**, **zsotroav#8941**"
      )
      .setFooter("Yuuto Bot: Release 1.0 | 2020-04-12");

    message.channel.send(embed);
  }
}
