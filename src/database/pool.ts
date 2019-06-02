import { createPool } from "promise-mysql";

const env = process.env;
const pool = createPool(
    {
        connectionLimit: 10,
        database: env.MySQLDatabase || "pirate-jim-staging",
        host: env.MySQLHost || "localhost",
        password: env.MySQLPassword || "toor",
        port: parseInt(env.MySQLPort, 10) || 3306,
        user: env.MySQLUser || "root"
    });

export default pool;
