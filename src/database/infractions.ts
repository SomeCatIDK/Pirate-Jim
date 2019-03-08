import { format } from "sqlstring";
import pool from "./pool";

async function __init() {
    const result = await pool.query(format("SHOW TABLES LIKE ?", ["infractions"]));

    if (result === []) {
        console.error("Couldn't find table with the name \'infractions\'!");
        process.exit(1);
    }
}

__init();
