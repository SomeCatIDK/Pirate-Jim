import { createPool } from "promise-mysql";
import config from "../config";

const pool = createPool(
    {
        connectionLimit: 10,
        database: config.MySQL.database,
        host: config.MySQL.address,
        password: config.MySQL.password,
        port: config.MySQL.port,
        user: config.MySQL.user
    });

export default pool;
