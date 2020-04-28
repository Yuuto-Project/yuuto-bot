import Command from "./base/Command.js";
import { findMembers, findUsers } from "../utils/finderUtil.js";

export default class Avatar extends Command {
  constructor() {
    super({
      name: "avatar",
      category: "util",
      description: "Returns the avatar of the requested user",
      aliases: ["pfp"],
      usage:
        "Run `avatar <token>` to get a high-resolution URL to the user's PFP. `<token>` can be a username, nickname, or tag."
    });
  }

  run(client, message, args) {
    // Joins the whole argument onto spaces
    const messageArgs = args.join(" ");
    let member;

    if (args.length) {
      // Uses the user query
      member =
        findMembers(messageArgs, message.guild)[0] ||
        findUsers(messageArgs, client)[0];
    } else {
      // Uses the sender avatar instead
      member = message.author;
    }

    // If query not found
    if (!member) {
      message.channel.send("Sorry, but I couldn't find that...");
      return;
    }

    // Gets the user object from member
    const user = member.user || member;
    // Gets the user avatar url
    const avatarURL = user.displayAvatarURL({
      dynamic: true,
      format: "png",
      size: 2048
    });

    // Sends it back to the user
    if (member === message.author) {
      message.reply(`here's your avatar~!\n${avatarURL}`);
    } else {
      message.reply(`here's the avatar for ${user.tag}\n${avatarURL}`);
    }
  }
}
