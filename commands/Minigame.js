import { MessageEmbed } from "@yuuto-project/discord.js";

import { sleep, shuffle } from "../utils/utils.js";
import Command from "./base/Command.js";

import questions from "../assets/minigame.json";

const State = Object.freeze({
  OFF: 0,
  STARTING: 1,
  IN_PROGRESS: 2
});

// For reference, a question is made up of these fields:
// QuestionType type, String question, Array<String> answers, Array<String> wrong

// For reference, a QuestionType can be one of the following string values:
// "FILL", "MULTIPLE"

export default class Minigame extends Command {
  #state = State.OFF;

  #players;

  #countdown;

  #startingMessage;

  #questions;

  #currentQuestion;

  #answers;

  #rounds;

  #timer;

  constructor() {
    super({
      name: "minigame",
      category: "game",
      description: "Play a fun quiz with your friends!",
      usage:
        "Run `minigame` to begin a new game, and react within the countdown to join.\nRun `minigame skip` to skip a question you do not wish to answer."
    });
  }

  initialize() {
    this.#state = State.OFF;
    this.#players = new Map();
    this.#countdown = 0;
    this.#startingMessage = null;
    this.#questions = shuffle(questions);
    this.#currentQuestion = null;
    this.#answers = [];
    this.#rounds = 0;
    this.#timer = Date.now() / 1000;
  }

  async run(client, message, args) {
    if (
      this.#state === State.IN_PROGRESS &&
      args[0] === "skip" &&
      this.#players.has(message.author)
    ) {
      message.reply("skipping the question...");
      this.progress(message.client);
      return;
    }

    if (
      this.#state === State.IN_PROGRESS &&
      Date.now() / 1000 - this.#timer > 30
    ) {
      message.reply("cancelling stale game...");
      this.clean(client);
    }

    if (this.#state !== State.OFF) {
      message.reply("a game is already running...");
      return;
    }

    this.initialize();

    client.on("messageReactionAdd", this.reactionRecv, this);
    client.on("messageReactionRemove", this.reactionRetr, this);
    client.on("message", this.messageRecv, this);

    //
    // STARTING
    //
    this.#state = State.STARTING;

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Minigame Starting!")
      .setDescription(`React below to join the game! 
      \nThis game may contain spoilers or NSFW themes.\nPlease run \`minigame skip\` in order to skip a question.`);
    this.#startingMessage = await message.channel.send(embed);

    this.#startingMessage.react("🇴");

    // Currently counts down by 2
    for (this.#countdown = 10; this.#countdown > 0; this.#countdown -= 2) {
      embed.setDescription(
        `React below to join the game! \nThis game may contain spoilers or NSFW themes.\nPlease run \`minigame skip\` in order to skip a question.\nCurrent players: ${this.playersAsString()}\n${
          this.#countdown
        } seconds left!`
      );
      this.#startingMessage.edit(embed);

      // eslint-disable-next-line no-await-in-loop
      await sleep(2000);
    }

    if (this.#players.size === 0) {
      embed.setTitle("Minigame cancelled!").setDescription(`Nobody joined...`);
      this.#startingMessage.edit(embed);
      this.clean(client);
      return;
    }

    embed.setTitle("Minigame started!").setDescription(`Game has begun!`);
    this.#startingMessage.edit(embed);

    this.#state = State.IN_PROGRESS;
    this.progress(client);
  }

  reactionRetr(reaction, user) {
    if (this.#state === State.STARTING) this.#players.delete(user);
  }

  reactionRecv(reaction, user) {
    if (
      user.bot ||
      this.#players.has(user) ||
      this.#state !== State.STARTING ||
      reaction.message !== this.#startingMessage
    )
      return;

    this.#players.set(user, 0);
  }

  messageRecv(message) {
    if (
      this.#state !== State.IN_PROGRESS ||
      message.channel !== this.#startingMessage.channel ||
      !this.#players.has(message.author)
    )
      return;

    this.#timer = Date.now() / 1000;

    if (this.#answers.includes(message.content.toLowerCase())) {
      this.#players.set(message.author, this.#players.get(message.author) + 1);
      message.channel.send(`${message.author} got the point!`);
      this.#rounds += 1;
      this.progress(message.client);
    }
  }

  // This is where the actual game is played!
  progress(client) {
    if (this.#rounds >= 7) {
      this.endGame(client);
      return;
    }

    this.#currentQuestion = this.#questions.pop();
    if (!this.#currentQuestion) {
      this.endGame(client);
      return;
    }

    this.#answers = this.#currentQuestion.answers.slice();
    this.#answers = this.#answers.map(answer => answer.toLowerCase());

    if (this.#currentQuestion.type === "FILL") {
      this.#startingMessage.channel.send(this.#currentQuestion.question);
    } else if (this.#currentQuestion.type === "MULTIPLE") {
      const questionString = `${this.#currentQuestion.question}\n`;

      const answersString = shuffle(
        this.#currentQuestion.wrong.concat(this.#currentQuestion.answers)
      )
        .map((answer, i) => {
          if (this.#answers.includes(answer.toLowerCase()))
            this.#answers.push((i + 1).toString());

          return `${i + 1}) ${answer}`;
        })
        .join("\n");

      this.#startingMessage.channel.send(questionString + answersString);
    }
  }

  endGame(client) {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Minigame Ended!")
      .setDescription(`Total points:\n${this.getScoreboard()}`);
    this.#startingMessage.channel.send(embed);

    this.clean(client);
  }

  clean(client) {
    client.off("messageReactionAdd", this.reactionRecv, this);
    client.off("messageReactionRemove", this.reactionRetr, this);
    client.off("message", this.messageRecv, this);

    this.#state = State.OFF;
  }

  getScoreboard() {
    // Map#entries returns an array of [key, value]
    const sortedPlayers = Array.from(this.#players.entries()).sort((a, b) => {
      return b[1] - a[1];
    });

    return sortedPlayers
      .map(([player, points], i) => {
        return `${i + 1}) ${player} with ${points} points`;
      })
      .join("\n");
  }

  playersAsString() {
    return Array.from(this.#players.keys()).join(", ");
  }
}
