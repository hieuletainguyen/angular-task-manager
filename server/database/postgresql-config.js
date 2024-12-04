import pkg from 'pg';
import configService from "../helper/config.service.js";

const { Pool } = pkg;

const pool = new Pool({
    user: configService.get("DB_USER"),
    host: configService.get("DB_HOST"), 
    database: configService.get("DB_DATABASE"),
    password: configService.get("DB_PASSWORD"),
    port: configService.get("DB_PORT")
})

export default pool;