// Requirement Files
import dotenv from "dotenv";
import { readdirSync } from "fs";
import { Client, Collection } from "@yuuto-project/discord.js";
import Command from "./commands/base/Command.js";
import "./settings/axiosSettings.js";

dotenv.config(); // configures the environment variables

export const prefix = process.env.PREFIX || "!";

// Collections and Sets
const yuuto = new Client({
  ws: {
    // Read more https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS"
    ]
  },
  // We need to fetch all members to make sure that finderUtil works properly
  fetchAllMembers: true
});
yuuto.commands = new Collection();
yuuto.aliases = new Collection();
yuuto.cooldowns = new Collection();

(async () => {
  // Load command files
  const commandsFiles = readdirSync("./commands/").filter(file =>
    file.endsWith(".js")
  );
  // Load commands
  for (const file of commandsFiles) {
    // eslint-disable-next-line no-await-in-loop
    const { default: CommandConstructor } = await import(`./commands/${file}`);

    // Checks if we actually have a command here, we don't want to register classes that are not commands
    if (!(CommandConstructor.prototype instanceof Command)) {
      console.error(
        `ERROR: command ${CommandConstructor.name} does not extend command base class, ignoring it`
      );
      continue;
    }

    const command = new CommandConstructor();

    yuuto.commands.set(command.name, command);

    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => yuuto.aliases.set(alias, command.name));
    }
  }
})().catch(console.error);

// Initialise the bot's startup
yuuto.once("ready", () => {
  console.log(`Hi, ${yuuto.user.username} is now online!`);

  const presenceFn = () => {
    console.debug("Setting presence");

    yuuto.user.setPresence({
      status: "online",
      activity: {
        name: "volleyball",
        type: "PLAYING"
      }
    });
  };

  // This math stuff is one hour in milliseconds
  // This interval makes sure that Yuuto keeps playing his games
  setInterval(presenceFn, 1000 * 60 * 60);

  presenceFn();
});

yuuto.on("message", async message => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (process.env.BOTCMDS && message.channel.id !== process.env.BOTCMDS) return; // bot channel check

  // Get the command name. or return
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (!cmd) return;

  // Find command or alias
  let command = yuuto.commands.get(cmd);

  if (!command && yuuto.aliases.has(cmd)) {
    command = yuuto.commands.get(yuuto.aliases.get(cmd));
  }

  // If we still didn't find a command, ignore it
  if (!command) return;

  // Add the command to the cooldown
  if (!yuuto.cooldowns.has(command.name)) {
    yuuto.cooldowns.set(command.name, new Collection());
  }

  // Set the cooldown's timestamp
  const now = Date.now();
  const timestamps = yuuto.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  // Check if the user is on cooldown
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
      return;
    }
  }

  // Add the author to the cooldown timestamps,
  // then remove the command after cooldown expires.
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Execute the command, and catch errors.
  try {
    await command.run(yuuto, message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

// login to Discord using the app token
yuuto.login(process.env.TOKEN).catch(console.error);
