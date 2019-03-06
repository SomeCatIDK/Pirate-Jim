"use strict";
exports.__esModule = true;
var discord_js_commando_1 = require("discord.js-commando");
var path_1 = require("path");
var sqlite_1 = require("sqlite");
var app = new discord_js_commando_1["default"].CommandoClient({ owner: "300617343334219776" });
app.on("ready", function () {
});
app.registry.registerDefaults();
app.registry.registerCommandsIn(path_1["default"].join(__dirname, "commands"));
app.setProvider(sqlite_1["default"].open(path_1["default"].join(__dirname, 'settings.sqlite3')).then(function (db) { return new discord_js_commando_1["default"].SQLiteProvider(db); }))["catch"](console.error);
app.login();
