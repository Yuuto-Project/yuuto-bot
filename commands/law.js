import { MessageEmbed } from "discord.js";

export const command = {
  name: "law",
  category: "info",
  description: "Shows the buddy law.",
  run: async (client, message) => {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("The Buddy Law")
      .setDescription(
        "1) A buddy should be kind, helpful and trustworthy to each other!\n" +
          "2) A buddy must be always ready for anything!\n" +
          "3) A buddy should always show a bright smile on his face!\n" +
          "||4) We leave no buddy behind!||"
      );

    message.channel.send(embed);
  }
};
