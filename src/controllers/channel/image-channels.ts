import { TextChannel } from "discord.js";
import { format } from "sqlstring";
import { insertKeyValue, modifyValue, queryValues } from "../../database/settings";
import app from "../../index";
import GuildSetting from "../../model/settings";

let settings: Map<string, GuildSetting[]>;

const whitelistTypes = [".png", ".jpg", ".gif", ".mp4"];
const seperator = "|";

async function __init() {
    settings = await queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "image-channel"]));
}

__init();

app.on("message", async (message) => {
    if (message.author.bot === true) {
        return;
    }

    const channels = settings.get(message.guild.id).find((x) => x.key === "image-channel");

    if (channels !== undefined) {
        const ids = parseIds(channels.value);
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
    const channels = settings.get(channel.guild.id).find((x) => x.key === "image-channel");

    if (channels !== undefined) {
        const ids = parseIds(channels.value);
        let result: boolean;

        if (ids.find((x) => x === channel.id)) {
            ids.splice(ids.indexOf(channel.id), 1);
            result = false;
        } else {
            ids.push(channel.id);
            result = true;
        }

        const newVal = compileIds(ids);
        settings.get(channel.guild.id).find((x) => x.key === "image-channel").value = newVal;
        await modifyValue(channel.guild.id, "image-channel", newVal);
        return result;
    } else {
        const guildSetting = new GuildSetting();

        guildSetting.key = "image-channel";
        guildSetting.value = channel.id;

        settings.set(channel.guild.id, [guildSetting]);

        await insertKeyValue(channel.guild.id, "image-channel", channel.id);
        return true;
    }
}

function parseIds(value: string): string[] {
    return value.split(seperator);
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
