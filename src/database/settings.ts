import { reject } from "bluebird";
import { EventEmitter } from "events";
import { format } from "sqlstring";
import pool from "./pool";

/*
CREATE TABLE `settings` (
	`guild` VARCHAR(20) NOT NULL,
	`key` VARCHAR(20) NOT NULL,
	`value` VARCHAR(512) NOT NULL
);
*/

export class Settings extends EventEmitter {
    constructor() {
        super();

        this.__init().catch((err) => {
            console.error("There was an error connecting to the database!");
            console.error(err);
        });
    }

    public async queryValues(query: string): Promise<Map<string, Array<[string, string]>>> {
        const result = await pool.query(query) as any[];

        const map = new Map<string, Array<[string, string]>>();

        result.forEach((element) => {
            if (!map.has(element.guild)) {
                map.set(element.guild, []);
            }

            const setting: [string, string] = [element.key, element.value];

            map.get(element.guild).push(element.key, setting);
        });

        return map;
    }

    public async insertKeyValue(guild: string, key: string, value: string) {
        await pool.query(format("INSERT INTO ?? VALUES (?, ?, ?)", ["settings", guild, key, value])).catch((err) => reject(err));

        this.emit("settingsChange");
    }

    public async modifyValue(guild: string, key: string, value: string) {
        await pool.query(format("UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?", ["settings", "value", value, "guild", guild, "key", key])).catch((err) => reject(err));
        this.emit("settingsChange");
    }

    private async __init() {
        const result = await pool.query(format("SHOW TABLES LIKE ?", ["settings"])).catch((err) => reject(err));

        if (result === []) {
            console.error("Couldn't find table with the name \'settings\'!");
            process.exit(1);
        }
    }
}

const instance = new Settings();

export default instance;
