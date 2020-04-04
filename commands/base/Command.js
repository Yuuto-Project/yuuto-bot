export default class Command {
  #name = null;

  #category = null;

  #description = null;

  #cooldown = 3;

  #aliases = null;

  #usage = null;

  constructor(options) {
    if (
      !options.name ||
      !options.category ||
      !options.description ||
      !options.usage
    ) {
      throw new Error("One of the configuration options is missing");
    }

    this.#name = options.name;
    this.#category = options.category;
    this.#description = options.description;
    this.#usage = options.usage;
    this.#aliases = options.aliases;
    this.#cooldown = options.cooldown || 3;
  }

  // eslint-disable-next-line no-unused-vars
  run(client, message, args) {
    throw new Error(`Run function not overwritten in ${this.constructor.name}`);
  }

  get name() {
    return this.#name;
  }

  get category() {
    return this.#category;
  }

  get description() {
    return this.#description;
  }

  get cooldown() {
    return this.#cooldown;
  }

  get aliases() {
    return this.#aliases;
  }

  get usage() {
    return this.#usage;
  }
}
