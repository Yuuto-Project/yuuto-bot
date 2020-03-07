export const command = {
  name: "ping",
  category: "info",
  description: "Returns latency and API ping",
  run: async (client, message) => {
    const msg = await message.channel.send(`🏓 Pinging....`);
    await msg.edit(
      `🏓 Pong!\nLatency is ${msg.createdTimestamp -
        message.createdTimestamp}ms. API Latency is ${Math.round(
        client.ws.ping
      )}ms`
    );
  }
};
