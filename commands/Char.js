import { MessageEmbed } from "@yuuto-project/discord.js";
import Command from "./base/Command.js";
// Adapted from: https://github.com/dunste123/hirobot/blob/master/valentines.json
import chars from "../assets/chars.json";

export default class Char extends Command {
  constructor() {
    super({
      name: "char",
      category: "info",
      aliases: ["character", "characters"],
      description: "Show information about a specific character.",
      usage: "Run `char <character>` to see information about a character."
    });
  }

  run(client, { channel }, args) {
    if (!args.length) {
      channel.send("Please provide a character.");
      return;
    }
    const characterName = args[0];
    const characterInfo = this.getCharacterInfo(characterName.toLowerCase());

    if (!characterInfo) {
      channel.send(
        `Sorry, but I don't think ${characterName} is a character in Camp Buddy.`
      );
      return;
    }

    channel.send(this.getEmbed(characterInfo));
  }

  getCharacterInfo(nameToFind) {
    return chars.find(({ name }) => name.toLowerCase().includes(nameToFind));
  }

  getEmbed(character) {
    return new MessageEmbed()
      .setAuthor(
        character.name,
        `https://cdn.discordapp.com/emojis/${character.cuteEmoteId}.png`
      )
      .setColor(character.color)
      .setDescription(character.description)
      .addField("Age", character.age, true)
      .addField("Birthday", character.birthday, true)
      .addField("Animal Motif", character.animal, true)
      .addField("Height", character.height, true)
      .addField("Weight", character.weight, true)
      .addField("Blood Type", character.blood_type, true);
  }
}
