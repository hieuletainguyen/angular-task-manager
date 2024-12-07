import pkg from 'pg';
import configService from "../helper/config.service.js";

const { Pool } = pkg;

const pool = new Pool({
    connectionString: configService.get("DB_URL"),
    ssl: {
        rejectUnauthorized: false,
    }
})

export default pool;