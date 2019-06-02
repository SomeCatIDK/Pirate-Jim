import { TextChannel } from "discord.js";
import path from "path";
import { format } from "sqlstring";
import settings from "../database/settings";
import client from "../index";
import ICommand from "../model/command/command";
import ECommandResult from "../model/command/command-result";
import * as fs from "../utility/fs-utility";

const commandRegistry = new Map<string, ICommand>();

const regex = /[\\""](.+?)[\\""]|([^ ]+)/ig;

fs.gatherAllFiles(path.join(__dirname, "..", "commands"), []).forEach((x) => {
    const command = require(x);
    registerCommand(new command.default());
});

client.on("message", async (message) => {
    if (!(message.channel instanceof TextChannel)) {
        return;
    }

    const prefix = await getPrefix(message.guild.id);

    if (!message.content.startsWith(prefix)) {
        client.emit("nonCommandMessage", message);
        return;
    }

    const messageString = message.content.substr(prefix.length);

    if (messageString.length === 0) {
        client.emit("nonCommandMessage", message);
        return;
    }

    const untrimmedMatches = messageString.match(regex);

    if (untrimmedMatches === null) {
        client.emit("nonCommandMessage", message);
        return;
    }

    const matches: string[] = [];

    untrimmedMatches.forEach((x) => {
        matches.push(x.trim().replace("\"", ""));
    });

    const command = commandRegistry.get(matches[0].toLowerCase());

    if (!command) {
        client.emit("nonCommandMessage", [message]);
        return;
    }

    const textChannel = message.channel as TextChannel;

    let result = await command.execute(
        message.member,
        textChannel,
        matches.slice(1, matches.length)
    ).catch((err) => {
        result = ECommandResult.INTERNAL_ERROR;
        console.error(err);
    });

    switch (result) {
        case ECommandResult.NOT_ENOUGH_PERMISSION:
            textChannel.send("**You don't have the required permissions to execute this command!**");
            break;
        case ECommandResult.INVALID_SYNTAX:
            textChannel.send(
                `**The syntax you supplied for the command was incorrect!**\n` +
                `Please do \`${prefix + "help " + command.name}\` for the proper usage of this command.`
            );
            break;
        case ECommandResult.INTERNAL_ERROR:
            textChannel.send("**There was an internal error, please contact an administrator.**");
            break;
    }
});

function registerCommand(command: ICommand) {
    commandRegistry.set(command.name.toLowerCase(), command);
    console.log(`Registered the command '${command.name}'.`);

    command.aliases.forEach((x) => {
        if (!commandRegistry.has(x.toLowerCase())) {
            commandRegistry.set(x.toLowerCase(), command);
            console.log(`Registered the command '${command.name}' with the alias '${x}'.`);
        }
    });
}

async function getPrefix(guild: string): Promise<string> {
    const values = await settings.queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "prefix"]));

    if (values.has(guild)) {
        return values.get(guild).find((x) => x[0] === "prefix")[1];
    }

    return "s.";
}

export default commandRegistry;
