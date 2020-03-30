import { MessageEmbed } from "@yuuto-project/discord.js";
import Command from "./base/Command.js";
// Source: https://github.com/dunste123/hirobot/blob/master/routes.json
import routes from "../assets/routes.json";

export default class Route extends Command {
  #endings = ["perfect", "good", "bad", "worst"];

  constructor() {
    super({
      name: "route",
      category: "info",
      description: "Tells you what route to play next",
      cooldown: 5
    });
  }

  run(client, message) {
    const embed = this.getEmbed();

    embed.setAuthor(
      message.member.displayName,
      message.author.displayAvatarURL({ format: "png" })
      // "https://discord.gg/campbuddy"
    );

    message.channel.send(embed);
  }

  getRoute() {
    return routes[Math.floor(Math.random() * routes.length)];
  }

  getEnding() {
    return this.#endings[Math.floor(Math.random() * this.#endings.length)];
  }

  getEmbed() {
    const character = this.getRoute();
    const firstName = this.getFirstName(character);

    return new MessageEmbed()
      .setThumbnail(this.getEmoteUrl(character))
      .setColor(character.color)
      .setTitle(`Next: ${character.name}, ${this.getEnding()} ending`)
      .setDescription(character.description)
      .addField("Age", character.age, true)
      .addField("Birthday", character.birthday, true)
      .addField("Animal Motif", character.animal, true)
      .setFooter(`Play ${firstName}'s route next. All bois are best bois.`);
  }

  getFirstName({ name }) {
    return name.split(/\s+/)[0];
  }

  getEmoteUrl({ emoteId }) {
    return `https://cdn.discordapp.com/emojis/${emoteId}.gif?v=1`;
  }
}
