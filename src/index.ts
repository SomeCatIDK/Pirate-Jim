import { Client } from "discord.js";

const app = new Client();

app.on("ready", () => {
    console.log("Ready!");
});

app.login(process.env.BotToken);