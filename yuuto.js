// Requirement Files
import dotenv from "dotenv";
import { readdirSync, readFileSync } from "fs";
import Discord from "discord.js";

const { Client, Collection } = Discord; // outdated Discord.js node workaround

dotenv.config(); // configures the environment variables

// Collections and Sets
const yuuto = new Client();
yuuto.commands = new Collection();
yuuto.aliases = new Collection();
yuuto.cooldowns = new Collection();

yuuto.once("ready", async () => {
  // Load command files
  const commandsFiles = readdirSync("./commands/").filter(file =>
    file.endsWith(".js")
  );
  // Load commands
  for (const file of commandsFiles) {
    // eslint-disable-next-line no-await-in-loop
    const { command } = await import(`./commands/${file}`);
    yuuto.commands.set(command.name, command);

    if (command.aliases && Array.isArray(command.aliases))
      command.aliases.forEach(alias => yuuto.aliases.set(alias, command.name));
  }
});

// Load the prefix | cannot import from json without node flag at the time of 13.9.0
const { prefix } = JSON.parse(readFileSync("./config.json", "utf-8")) || "!";

// Initialise the bot's startup
yuuto.once("ready", () => {
  console.log(`Hi, ${yuuto.user.username} is now online!`);

  yuuto.user.setPresence({
    status: "online",
    game: {
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
      await message.reply(
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
    command.run(yuuto, message, args);
  } catch (error) {
    console.error(error);
    await message.reply("there was an error trying to execute that command!");
  }
});

// login to Discord using the app token
yuuto.login(process.env.TOKEN);
