import { Client } from "discord.js";

const client = new Client();

client.on("ready", async () => {
    await client.user.setPresence({ game: { type: "WATCHING", name: "Safety Jim's Treasure!" } });
    console.log("Ready!");
});

client.login(process.env.TOKEN);
