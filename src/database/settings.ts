import { format } from "sqlstring";
import GuildSettings from "../model/settings";
import pool from "./pool";

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

export async function queryValues(query: string): Promise<Map<string, GuildSettings[]>> {
    const result = await pool.query(query) as any[];

    const map = new Map<string, GuildSettings[]>();

    result.forEach((element) => {
        if (!map.has(element.guild)) {
            map.set(element.guild, []);
        }

        const setting = new GuildSettings();

        setting.key = element.key;
        setting.value = element.value;

        map.get(element.guild).push(element.key, setting);
    });

    return map;
}

export async function insertKeyValue(guild: string, key: string, value: string) {
    await pool.query(format("INSERT INTO ?? VALUES (?, ?, ?)", ["settings", guild, key, value]));
}

export async function modifyValue(guild: string, key: string, value: string) {
    await pool.query(format("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?", ["settings", "value", value, "guild", guild, "key", key]));
}

__init();
