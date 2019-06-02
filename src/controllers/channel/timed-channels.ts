import { Message, TextChannel } from "discord.js";
import { format } from "sqlstring";
import { insertTimedChannelMessage, modifyValue, queryValues } from "../../database/channel/timed-channels";
import settings from "../../database/settings";
import client from "../../index";

let settingsMap: Map<string, Array<[string, string]>>;

const seperator = "|";

async function __init() {
    settingsMap = await settings.queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "timed-channel"]));
}

__init();

settings.on("settingsChange", async () => {
    settingsMap = await settings.queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "timed-channel"]));
});

client.on("nonCommandMessage", async (message: Message) => {
    if (message.author.bot === true) {
        return;
    }

    const channels = settingsMap.get(message.guild.id).find((x) => x[0] === "timed-channel");

    if (channels !== undefined) {
        const ids = parseIds(channels[1]);
        const timedChannel = ids.find((x) => x[0] === message.channel.id);

        if (timedChannel) {
            const timedChannelMessage = await queryValues(format("SELECT * FROM ?? WHERE ?? = ? AND ?? = ?", ["timed-channel-messages", "userId", message.author.id, "channelId", message.channel.id]));

            if (timedChannelMessage.length !== 0) {
                if (Date.now() - timedChannelMessage[0][2] > (timedChannel[1] * 1000)) {
                    await modifyValue(message.author.id, message.channel.id, Date.now());
                } else {
                    await message.delete();
                }
            } else {
                await insertTimedChannelMessage(message.author.id, message.channel.id, Date.now());
            }
        }
    }
});

export async function setTimedChannel(channel: TextChannel, time: number | null): Promise<boolean | null> {
    const channels = settingsMap.get(channel.guild.id).find((x) => x[0] === "timed-channel");

    if (channels !== undefined) {
        const ids = parseIds(channels[1]);
        let result: boolean;

        let timedChannel = ids.find((x) => x[0] === channel.id);

        if (timedChannel) {
            ids.splice(ids.indexOf(timedChannel), 1);
            result = false;
        } else {
            if (time != null) {
                timedChannel = [channel.id, time];
                ids.push(timedChannel);

                result = true;
            } else {
                return null;
            }
        }

        const newVal = compileIds(ids);
        await settings.modifyValue(channel.guild.id, "timed-channel", newVal);
        return result;
    } else if (time != null) {
        await settings.insertKeyValue(channel.guild.id, "timed-channel", [channel.id, time.toString].join(":"));
        return true;
    }

    return null;
}

function parseIds(value: string): Array<[string, number]> {
    const pairs = value.split(seperator);

    const list: Array<[string, number]> = [];

    pairs.forEach((x) => {
        const values = x.split(":");

        if (values.length === 2) {
            const time = parseInt(values[1], 10);

            if (!isNaN(time)) {
                list.push([values[0], time]);
            }
        }
    });

    return list;
}

function compileIds(array: Array<[string, number]>): string {
    const values: string[] = [];

    array.forEach((x) => {
        const innerValues = [x[0], x[1].toString()];
        values.push(innerValues.join(":"));
    });

    return values.join(seperator);
}
