import { Client, TextChannel } from "discord.js";

const app = new Client();
export default app;

require("./controllers/image-channel-controller");

app.on("ready", () => {
    console.log("Ready!");
});

app.login(process.env.BotToken);