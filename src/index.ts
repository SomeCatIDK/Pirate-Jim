import { Client } from "discord.js";

const app = new Client();
export default app;

import CommandSetImageChannel from "./commands/setimagechannel";
import { registerCommand } from "./controllers/commands";

require("./controllers/image-channel-controller");

app.on("ready", async () => {
    registerCommand(new CommandSetImageChannel());
    await app.user.setPresence({ game: { type: "WATCHING", name: "Safety Jim's Treasure!" } });
    console.log("Ready!");
});

app.login(process.env.BotToken);
