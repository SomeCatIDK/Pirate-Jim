import { format } from "sqlstring";
import TimedChannelMessage from "../../model/channels/timed-channel-message";
import pool from "../pool";

/*
CREATE TABLE `settings` (
	`userId` VARCHAR(20) NOT NULL,
	`channelId` VARCHAR(20) NOT NULL,
	`timeSent` BIGINT NOT NULL
);
*/

async function __init() {
    const result = await pool.query(format("SHOW TABLES LIKE ?", ["timed-channel-messages"]));

    if (result === []) {
        console.error("Couldn't find table with the name \'timed-channel-messages\'!");
        process.exit(1);
    }
}

export async function queryValues(query: string): Promise<TimedChannelMessage[]> {
    const result = await pool.query(query) as any[];

    const list: TimedChannelMessage[] = [];

    result.forEach((element) => {
        const timedChannelMessage = new TimedChannelMessage();

        timedChannelMessage.userId = element.userId;
        timedChannelMessage.channelId = element.channelId;
        timedChannelMessage.timeSent = element.timeSent;

        list.push(timedChannelMessage);
    });

    return list;
}

export async function insertTimedChannelMessage(userId: string, channelId: string, timeSent: number) {
    await pool.query(format("INSERT INTO ?? VALUES (?, ?, ?)", ["timed-channel-messages", userId, channelId, timeSent]));
}

export async function modifyValue(userId: string, channelId: string, timeSent: number) {
    await pool.query(format("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?", ["timed-channel-messages", "timeSent", timeSent, "userId", userId, "channelId", channelId]));
}

__init();
