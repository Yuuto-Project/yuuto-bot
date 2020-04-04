import convert from "convert-length";
import { prefix } from "../yuuto.js";
import Command from "./base/Command.js";

const INPUT_PATTERN = /(-?\d+)(\D{1,2})/;
const LENGTHS = ["mm", "cm", "m", "pc", "pt", "in", "ft", "px"];
const TEMPS = ["c", "f", "k"];
const VALID_UNITS = [...TEMPS, ...LENGTHS];
// https://pastebin.com/jqP8GMpE

export default class Cvt extends Command {
  constructor() {
    super({
      name: "cvt",
      category: "util",
      description: "Helps converting stuff"
    });
  }

  run(client, message, args) {
    const { channel } = message;
    const deleteOpts = { timeout: 15 * 1000 };

    message.delete(deleteOpts).catch(() => {
      /* errors ignored */
    });

    if (args[0] && args[0].toLowerCase() === "handegg") {
      channel
        .send("Americans call the handegg a football.")
        .then(m => m.delete(deleteOpts));
      return;
    }

    if (args.length < 2) {
      channel
        .send(
          `Temperature units to convert to are \`${TEMPS.join(
            ", "
          )}\` from those values.
Height units to convert to are \`${LENGTHS.join(
            ", "
          )}\` from those same values as well.
The syntax is \`${prefix}cvt <unit-to-convert-to> <value>\``.trim()
        )
        .then(m => m.delete(deleteOpts));
      return;
    }

    const targetUnit = args[0].toLowerCase();

    if (!VALID_UNITS.includes(targetUnit)) {
      channel
        .send(
          `<a:ConnorShake:588014274555936788> Valid units are \`${VALID_UNITS.join(
            ", "
          )}\`.`
        )
        .then(m => m.delete(deleteOpts));
      return;
    }

    const input = args[1].toLowerCase();

    if (!INPUT_PATTERN.test(input)) {
      channel
        .send(
          `<:NatsumiThink:512731583917064192> Not sure what you mean by \`${input}\`.`
        )
        .then(m => m.delete(deleteOpts));
      return;
    }

    // This first comma is kinda weird right?
    // It's there so it skips the first element since that is the same as our input variable
    // We can't name it "_" or "ignored" since eslint will complain about the variable being unused
    // Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Ignoring_some_returned_values
    const [, sourceValue, sourceUnit] = INPUT_PATTERN.exec(input);

    if (!this.areCompatible(targetUnit, sourceUnit)) {
      channel
        .send(
          "<:YoichiLOL:586763664846094336> I wish that that was possible as well mate."
        )
        .then(m => m.delete(deleteOpts));
      return;
    }

    let converted;

    // Do we need to convert a length unit?
    if (LENGTHS.includes(targetUnit)) {
      converted = this.convertLength(sourceValue, sourceUnit, targetUnit);
    } else {
      const kelvin = this.toKelvin(parseFloat(sourceValue), sourceUnit);

      if (kelvin < 0 || kelvin > 10 ** 32) {
        const highLow = kelvin < 0 ? "low" : "high";

        channel
          .send(
            `<:HiroOhGod:514698065794564099> Temperatures that ${highLow} are not possible.`
          )
          .then(m => m.delete(deleteOpts));
        return;
      }

      converted = this.toTemp(kelvin, targetUnit);
    }

    if (Number.isNaN(converted)) {
      channel
        .send(
          "<:LeeWow:593058284945145867> Those numbers are way too sizably voluminous to calculate."
        )
        .then(m => m.delete(deleteOpts));
      return;
    }

    const aboutPrecise = sourceUnit === targetUnit ? "precisely" : "about";

    channel
      .send(
        `<:LeeCute:586763383806754816> According to my calculations, \`${this.formatNum(
          sourceValue
        )}${this.unitToDisplay(
          sourceUnit
        )}\` is ${aboutPrecise} \`${this.formatNum(
          converted
        )}${this.unitToDisplay(targetUnit)}\`.`
      )
      .then(m => m.delete(deleteOpts));
  }

  formatNum(input) {
    let num = input;

    if (typeof input !== "number") {
      num = Number(input);
    }

    if (num < 10000) {
      return num.toFixed(2);
    }

    return num.toExponential(2).replace(/e\+?/, " x 10^");
  }

  unitToDisplay(input) {
    switch (input.toLowerCase()) {
      case "c":
        return "\u2103";
      case "f":
        return "\u00B0\u0046";
      case "k":
        return "K"; // Upper case K
      default:
        return input;
    }
  }

  areCompatible(target, src) {
    if (TEMPS.includes(target) && TEMPS.includes(src)) {
      return true;
    }

    // Ok so what does this comment below actually mean
    // The comment tells PHPStorm to stop complaining and telling me to just
    // use `return LENGTHS.includes(target) && LENGTHS.includes(src)` instead
    // But I want to keep it for the sake of readability
    // noinspection RedundantIfStatementJS
    if (LENGTHS.includes(target) && LENGTHS.includes(src)) {
      return true;
    }

    return false;
  }

  convertLength(value, from, to) {
    return convert(parseFloat(value), from, to);
  }

  toKelvin(temp, unit) {
    if (unit === "c") {
      return temp + 273.15;
    }

    if (unit === "f") {
      return (temp - 32) * (5 / 9) + 273.15;
    }

    if (unit === "k") {
      return temp;
    }

    throw new Error("Invalid temperature unit");
  }

  // Temp must be converted to kelvin firstly
  toTemp(temp, unit) {
    if (unit === "c") {
      return temp - 273.15;
    }

    if (unit === "f") {
      return (temp - 273.15) * (9 / 5) + 32;
    }

    if (unit === "k") {
      return temp;
    }

    throw new Error("Invalid temperature unit");
  }
}
