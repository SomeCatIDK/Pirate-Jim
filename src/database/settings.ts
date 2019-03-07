import pool from "./pool";
import { format } from "sqlstring";

/*
CREATE TABLE `settings` (
	`guild` VARCHAR(20) NOT NULL,
	`key` VARCHAR(20) NOT NULL,
	`value` VARCHAR(512) NOT NULL
);
*/

async function __init() {
    const result = await pool.query(format("SHOW TABLES LIKE ?", ["settings"]));

    if (result === []) {
        console.error("Couldn't find table with the name \'settings\'!");
        process.exit(1);
    }
}

export async function queryValues(query: string): Promise<Map<string, Map<string, string>>> {
    const result = await pool.query(query);

    return null;
}

export async function insertKeyValue(guild: string, key: string, value: string) {
    await pool.query(format("INSERT INTO ? VALUES (?, ?, ?)", ["settings", guild, key, value]));
}

export async function modifyValue(guild: string, key: string, value: string) {
    await pool.query(format("UPDATE ? SET ?? = ? WHERE ?? = ? AND ?? = ?", ["settings", "value", value, "guild", guild, "key", key]));
}
__init();