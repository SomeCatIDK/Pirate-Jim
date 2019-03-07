import { createPool as CreatePool } from "promise-mysql";

const env = process.env;
const pool = CreatePool(
    {
        connectionLimit: 10,
        database: env.MySQLDatabase || "pirate-jim",
        host: env.MySQLHost || "localhost",
        password: env.MySQLPassword || "toor",
        port: parseInt(env.MySQLPort, 10) || 3306,
        user: env.MySQLUser || "root"
    });

export default pool;