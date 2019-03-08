import { Client } from "discord.js";

const app = new Client();
export default app;

require("./controllers/image-channel-controller");

app.on("ready", async () => {
    console.log("Ready!");
    await app.user.setPresence({game: {type: "WATCHING", name: "Safety Jim's Treasure!"}});
});

app.login(process.env.BotToken);
