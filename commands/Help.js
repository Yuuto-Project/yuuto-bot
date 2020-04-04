import Command from "./base/Command.js";

export default class Help extends Command {
  constructor() {
    super({
      name: "help",
      category: "info",
      description: "Get the usage of any other command",
      aliases: ["usage", "commands"],
      usage: `Run \`help <command>\` to get usage instructions on \`<command>\`, if it exists. Run \`help list\` to list possible commands.`
    });
  }

  run(client, message, args) {
    const commandName = args[0] || "help";

    if (commandName === "list") {
      message.channel.send(
        `Here is a list of all commands and their descriptions:\n${client.commands
          .map(command => {
            return ` - **${command.category}:** \`${command.name}\`: *${command.description}.*`;
          })
          .join("\n")}`
      );
      return;
    }

    let command = client.commands.get(commandName);

    if (!command && client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }

    if (!command) {
      message.reply("that command does not exist...");
      return;
    }

    message.channel.send(
      `**Category:** \`${command.category}\`\n**Usage For Command:** \`${
        command.name
      }\`\n${command.usage}${
        command.aliases && command.aliases.length
          ? `\n**Aliases:** \`${command.aliases}\``
          : ""
      }`
    );
  }
}
