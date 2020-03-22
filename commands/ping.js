export const command = {
  name: "ping",
  category: "info",
  description: "Returns latency and API ping",
  run: async (client, message) => {
    const now = Date.now();
    const msg = await message.channel.send(`🏓 Pinging....`);
    await msg.edit(
      `🏓 Pong!\nLatency is ${Date.now() - now}ms. API Latency is ${Math.round(
        client.ws.ping
      )}ms`
    );
  }
};
