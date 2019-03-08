import { format } from "sqlstring";
import { insertKeyValue, modifyValue, queryValues } from "../database/settings";
import app from "../index";
import GuildSetting from "../model/settings";

let settings: Map<string, GuildSetting[]>;

const whitelistTypes = [".png", ".jpg", ".gif", ".mp4"];
const seperator = "|";

export async function __init() {
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

        if (message.content === "!setimagechannel" && message.member.hasPermission("MANAGE_CHANNELS")) {
            if (ids.find((x) => x === message.channel.id)) {
                ids.splice(ids.indexOf(message.channel.id), 1);
                message.channel.send("This channel is no longer an image channel!");
            } else {
                ids.push(message.channel.id);
                message.channel.send("This channel is now an image channel!");
            }

            const newVal = compileIds(ids);

            settings.get(message.guild.id).find((x) => x.key === "image-channel").value = newVal;

            await modifyValue(message.guild.id, "image-channel", newVal);

        } else if (ids.find((x) => x === message.channel.id)) {
            const attachment = message.attachments.first();

            if (attachment === undefined) {
                await message.delete().catch(console.error);
            } else if (!endsInWhitelist(attachment.filename) || message.attachments.size !== 1) {
                await message.delete().catch(console.error);
            } else {
                await message.react("👍");
                await message.react("👎");
                await message.react("\u2764");
            }
        }
    } else if (message.content === "!setimagechannel" && message.member.hasPermission("MANAGE_CHANNELS")) {
        const guildSetting = new GuildSetting();

        guildSetting.key = "image-channel";
        guildSetting.value = message.channel.id;

        settings.set(message.guild.id, [guildSetting]);

        await insertKeyValue(message.guild.id, "image-channel", message.channel.id);
    }
});

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
