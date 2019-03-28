import { Client } from "discord.js";

const app = new Client();
export default app;

import CommandSetImageChannel from "./commands/setimagechannel";
import { registerCommand } from "./controllers/commands";
import CommandSetTimedChannel from "./commands/settimedchannel";

require("./controllers/image-channels");
require("./controllers/timed-channels");

app.on("ready", async () => {
    registerCommand(new CommandSetImageChannel());
    registerCommand(new CommandSetTimedChannel());
    await app.user.setPresence({ game: { type: "WATCHING", name: "Safety Jim's Treasure!" } });
    console.log("Ready!");
});

app.login(process.env.BotToken);
