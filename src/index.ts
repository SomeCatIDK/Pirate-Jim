import { Client } from "discord.js";
import config from "./config";

const app = new Client();
export default app;

import "./controllers/channel/image-channels";
import "./controllers/channel/timed-channels";
import "./controllers/commands";

app.on("ready", async () => {
    await app.user.setPresence({ game: { type: "WATCHING", name: "Safety Jim's Treasure!" } });
    console.log("Ready!");
});

app.login(config.Token);
