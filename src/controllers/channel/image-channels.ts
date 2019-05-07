import { Message, TextChannel } from "discord.js";
import { format } from "sqlstring";
import settings from "../../database/settings";
import client from "../../index";

let settingsMap: Map<string, Array<[string, string]>>;

const whitelistTypes = [".png", ".jpg", ".gif", ".mp4"];
const seperator = "|";

async function __init() {
    settingsMap = await settings.queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "image-channel"]));
}

__init();

settings.on("settingsChange", async () => {
    settingsMap = await settings.queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "image-channel"]));
});

client.on("nonCommandMessage", async (message: Message) => {
    if (message.author.bot === true) {
        return;
    }

    const setting = settingsMap.get(message.guild.id);

    let channels: string;

    if (setting) {
        channels = setting.find((x) => x[0] === "image-channel")[1];
    }

    if (channels !== undefined) {
        const ids = parseIds(channels);
        if (ids.find((x) => x === message.channel.id)) {
            const attachment = message.attachments.first();

            if (attachment === undefined) {
                await message.delete().catch(console.error);
            } else if (!endsInWhitelist(attachment.filename) || message.attachments.size !== 1) {
                await message.delete().catch(console.error);
            } else {
                await message.react("👍").catch(console.error);
                await message.react("👎").catch(console.error);
                await message.react("\u2764").catch(console.error);
            }
        }
    }
});

export async function setImageChannel(channel: TextChannel): Promise<boolean> {
    const setting = settingsMap.get(channel.guild.id);

    let channels: [string, string];

    if (setting) {
        channels = setting.find((x) => x[0] === "image-channel");
    }

    if (channels) {
        const ids = parseIds(channels[1]);
        let result: boolean;

        if (ids.find((x) => x === channel.id)) {
            ids.splice(ids.indexOf(channel.id), 1);
            result = false;
        } else {
            ids.push(channel.id);
            result = true;
        }

        const newVal = compileIds(ids);

        await settings.modifyValue(channel.guild.id, "image-channel", newVal);
        return result;
    } else {
        await settings.insertKeyValue(channel.guild.id, "image-channel", channel.id);
        return true;
    }
}

function parseIds(value: string): string[] {
    return value.split(seperator).filter((x) => x !== "");
}

function compileIds(array: string[]): string {
    return array.join(seperator);
}

function endsInWhitelist(attachment: string): boolean {
    for (const type in whitelistTypes) {
        if (attachment.endsWith(whitelistTypes[type])) {
            return true;
        }
    }

    return false;
}
