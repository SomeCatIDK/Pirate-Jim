import commando from "discord.js-commando";
import path from "path";
import sqlite from "sqlite";

import { scheduleJob } from "node-schedule";

const app = new commando.CommandoClient({ owner: "300617343334219776" });

app.on("ready", () => {

});

app.registry.registerDefaults();
app.registry.registerCommandsIn(path.join(__dirname, "commands"));

app.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

app.login();