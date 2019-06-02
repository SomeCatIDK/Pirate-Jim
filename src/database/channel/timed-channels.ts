import { format } from "sqlstring";
import pool from "../pool";

/*
CREATE TABLE `timed-channels` (
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

export async function queryValues(query: string): Promise<Array<[string, string, number]>> {
    const result = await pool.query(query) as any[];

    const list: Array<[string, string, number]> = [];

    result.forEach((element) => {
        list.push([element.userId, element.channelId, element.timeSent]);
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
