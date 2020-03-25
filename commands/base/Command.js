export default class Command {
  #name = null;
  #category = null;
  #description = null;

  constructor(options) {
    if (!options.name || !options.category || !options.description) {
      throw new Error("One of the configuration options is missing");
    }

    this.#name = options.name;
    this.#category = options.category;
    this.#description = options.description;
  }

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
}
