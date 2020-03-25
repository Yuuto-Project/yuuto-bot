import Command from "./base/Command";

export default class Ping extends Command {
  constructor() {
    super({
      name: "ping",
      category: "info",
      description: "Returns latency and API ping"
    });
  }

  async run(client, message) {
    const now = Date.now();
    const msg = await message.channel.send(`\uD83C\uDFD3 Pinging....`);
    msg.edit(
      `\uD83C\uDFD3 Pong!\nLatency is ${Date.now() -
        now}ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }
}
