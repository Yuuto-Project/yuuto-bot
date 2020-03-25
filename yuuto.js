// Requirement Files
import dotenv from "dotenv";
import { readdirSync } from "fs";
import { Client, Collection } from "discord.js";

dotenv.config(); // configures the environment variables

const prefix = process.env.PREFIX || "!";

// Collections and Sets
const yuuto = new Client();
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

  yuuto.user.setPresence({
    status: "online",
    activity: {
      name: "volleyball",
      type: "PLAYING"
    }
  });
});

yuuto.on("message", async message => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  // Get the command name. or return
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (!cmd) return;

  // Find command or alias
  let command = yuuto.commands.get(cmd);
  if (!command) command = yuuto.commands.get(yuuto.aliases.get(cmd));
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
        )} more second(s) before reusing the \`{command.name}\` command.`
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
