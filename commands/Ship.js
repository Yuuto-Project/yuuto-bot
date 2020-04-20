import axios from "axios";
import { existsSync, readFileSync } from "fs";
import { MessageEmbed, MessageAttachment } from "@yuuto-project/discord.js";
import Command from "./base/Command.js";
import { findMembers } from "../utils/finderUtil.js";
import { sendTyping, escapeUsername } from "../utils/utils.js";
import messages from "../assets/ship_messages.json";

export default class Ship extends Command {
  #riggedPairs;

  constructor() {
    super({
      name: "ship",
      category: "fun",
      description: "Ship two users",
      usage: `Run \`ship <user1> <user2>\` to find out the compatibility between the two users!`
    });

    // Fetch rigged pairs if file exists
    const filepath = "./databases/riggedShips.json";

    if (existsSync(filepath)) {
      const rawdata = readFileSync(filepath, "utf8");
      this.#riggedPairs = JSON.parse(rawdata);
    } else {
      this.#riggedPairs = [];
    }
  }

  shouldBeRigged(target1, target2) {
    const id1 = target1.id;
    const id2 = target2.id;

    return this.#riggedPairs.some(
      ids =>
        (ids[0] === id1 && ids[1] === id2) || (ids[0] === id2 && ids[1] === id1)
    );
  }

  findMessage(score) {
    return messages.find(obj => score <= obj.max_score).message;
  }

  calcScore(user1, user2) {
    let score;

    if (this.shouldBeRigged(user1, user2)) {
      score = 100;
    } else {
      score = ((parseInt(user1.id, 10) + parseInt(user2.id, 10)) / 7) % 100;
    }

    return {
      score,
      scoreMessage: this.findMessage(score)
    };
  }

  getAvatarUrl(entity) {
    return entity.user.displayAvatarURL({
      format: "png",
      size: 128
    });
  }

  findNextUserIfSame(firstUser, listOfSeconds) {
    // There is no point in searching if we don't have any users
    if (!listOfSeconds.length) {
      return null;
    }

    // If we only found one user we need to return that one
    if (listOfSeconds.length === 1) {
      return listOfSeconds[0];
    }

    for (const user of listOfSeconds) {
      if (user.id === firstUser.id) {
        continue;
      }

      return user;
    }

    return null;
  }

  async run(client, message, args) {
    const { channel, guild } = message;

    // Why are we not using channel.startTyping?
    // Because it is the buggiest shit that I've ever seen
    await sendTyping(channel);

    if (args.length < 2) {
      channel.send(
        "This command requires two arguments: `ship <user1> <user2>`."
      );
      return;
    }

    const [target1] = findMembers(args[0], guild);

    if (!target1) {
      channel.send(`No user found for input ${args[0]}`);
      return;
    }

    const seconds = findMembers(args[1], guild);
    const target2 = this.findNextUserIfSame(target1, seconds);

    if (!target2) {
      channel.send(`No user found for input ${args[1]}`);
      return;
    }

    let data;

    if (target1.id === target2.id) {
      data = {
        score: 100,
        scoreMessage: "You're a perfect match... for yourself!"
      };
    } else {
      data = this.calcScore(target1, target2);
    }

    const { score, scoreMessage } = data;
    const img1 = this.getAvatarUrl(target1);
    const img2 = this.getAvatarUrl(target2);
    const { data: image } = await axios.get(
      `https://api.alexflipnote.dev/ship?user=${img1}&user2=${img2}`,
      {
        responseType: "arraybuffer"
      }
    );

    const name1 = escapeUsername(target1);
    const name2 = escapeUsername(target2);

    // We're uploading the image to discord to release strain on the image api
    const attachment = new MessageAttachment(Buffer.from(image), "love.png");
    const embed = new MessageEmbed()
      .setTitle(`${name1} and ${name2}`)
      .addField(
        `Your love score is ${score}%`,
        scoreMessage.replace("{name}", name1).replace("{name2}", name2),
        false
      )
      .setImage("attachment://love.png");

    channel.send({
      embed,
      files: [attachment]
    });
  }
}
