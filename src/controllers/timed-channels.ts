import { TextChannel } from "discord.js";
import { format } from "sqlstring";
import { insertKeyValue, modifyValue as modifySettingsValue, queryValues as querySettingsValues } from "../database/settings";
import { insertTimedChannelMessage, modifyValue, queryValues } from "../database/timed-channels";
import app from "../index";
import GuildSetting from "../model/settings";
import TimedChannel from "../model/timed-channel";
import TimedChannelMessage from "../model/timed-channel-message";

let settings: Map<string, GuildSetting[]>;
let timedChannelMessages: TimedChannelMessage[];

const seperator = "|";

async function __init() {
    settings = await querySettingsValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "timed-channel"]));
    timedChannelMessages = await queryValues(format("SELECT * FROM ??", ["timed-channel-messages"]));
}

__init();

app.on("message", async (message) => {
    if (message.author.bot === true) {
        return;
    }

    const channels = settings.get(message.guild.id).find((x) => x.key === "timed-channel");

    if (channels !== undefined) {
        const ids = parseIds(channels.value);
        const timedChannel = ids.find((x) => x.channelId === message.channel.id);

        if (timedChannel) {
            let timedChannelMessage = timedChannelMessages.find((x) => x.userId === message.author.id && x.channelId === message.channel.id);

            if (timedChannelMessage) {
                if (Date.now() - timedChannelMessage.timeSent > (timedChannel.waitTime * 1000)) {
                    await modifyValue(message.author.id, message.channel.id, Date.now());

                    timedChannelMessages.splice(timedChannelMessages.indexOf(timedChannelMessage, 1));
                    timedChannelMessage.timeSent = Date.now();
                    timedChannelMessages.push(timedChannelMessage);
                } else {
                    await message.delete();
                }
            } else {
                timedChannelMessage = new TimedChannelMessage();

                timedChannelMessage.userId = message.author.id;
                timedChannelMessage.channelId = message.channel.id;
                timedChannelMessage.timeSent = Date.now();

                await insertTimedChannelMessage(timedChannelMessage.userId, timedChannelMessage.channelId, timedChannelMessage.timeSent);

                timedChannelMessages.push(timedChannelMessage);
            }
        }
    }
});

export async function setTimedChannel(channel: TextChannel, time: number | null): Promise<boolean | null> {
    const channels = settings.get(channel.guild.id).find((x) => x.key === "timed-channel");

    if (channels !== undefined) {
        const ids = parseIds(channels.value);
        let result: boolean;

        let timedChannel = ids.find((x) => x.channelId === channel.id);

        if (timedChannel) {
            ids.splice(ids.indexOf(timedChannel), 1);
            result = false;
        } else {
            if (time != null) {
                timedChannel = new TimedChannel();

                timedChannel.channelId = channel.id;
                timedChannel.waitTime = time;

                ids.push(timedChannel);

                result = true;
            } else {
                channel.sendMessage("Invalid syntax! Please assign a number in seconds to define the wait-time of the channel.");
                return null;
            }
        }

        const newVal = compileIds(ids);
        settings.get(channel.guild.id).find((x) => x.key === "timed-channel").value = newVal;
        await modifySettingsValue(channel.guild.id, "timed-channel", newVal);
        return result;
    } else if (time != null) {
        const guildSetting = new GuildSetting();

        guildSetting.key = "timed-channel";
        guildSetting.value = [channel.id, time.toString].join(":");

        settings.set(channel.guild.id, [guildSetting]);

        await insertKeyValue(channel.guild.id, "timed-channel", [channel.id, time.toString].join(":"));
        return true;
    }

    channel.sendMessage("Invalid syntax! Please assign a number in seconds to define the wait-time of the channel.");
    return null;
}

function parseIds(value: string): TimedChannel[] {
    const pairs = value.split(seperator);

    const list: TimedChannel[] = [];

    pairs.forEach((x) => {
        const values = x.split(":");

        if (values.length === 2) {
            const time = parseInt(values[1], 10);

            if (!isNaN(time)) {
                const timedChannel = new TimedChannel();

                timedChannel.channelId = values[0];
                timedChannel.waitTime = time;

                list.push(timedChannel);
            }
        }
    });

    return list;
}

function compileIds(array: TimedChannel[]): string {
    const values: string[] = [];

    array.forEach((x) => {
        const innerValues = [x.channelId, x.waitTime.toString()];
        values.push(innerValues.join(":"));
    });

    return values.join(seperator);
}
