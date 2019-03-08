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
    const result = await pool.query(format("SHOW TABLES LIKE ?", ["infractions"]));

    if (result === []) {
        console.error("Couldn't find table with the name \'infractions\'!");
        process.exit(1);
    }
}

__init();