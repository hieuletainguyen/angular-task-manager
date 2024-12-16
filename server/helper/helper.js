import pool from "../database/postgresql-config.js"
import jwt from "jsonwebtoken";
import configService from "../helper/config.service.js";

const jwtSecretKey = configService.get('JWT_SECRET_KEY');

export const decodeAndGetUser = async (token) => {
    const client = await pool.connect();
    const user = jwt.verify(token, jwtSecretKey, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError" ) {
                return { message: "Token Expired"};
            }
            return { message: "Invalid  Token" };
        }
        return {message: "success", result: decoded};
    })

    if (user.message === 'success') {
        const userDetail = await client.query("SELECT * FROM account WHERE id = $1;", [user.result.userId]);
        return {message: "success", result: userDetail.rows}

    } else {
        return user
    }
}

export const numberOfTasks = async (userId) => {
    const client = await pool.connect();
    const completedTasks = await client.query(`SELECT COUNT(*) FROM tasks WHERE "userId" = $1 AND "isCompleted" = TRUE;`, [userId]);
    const incompletedTasks = await client.query(`SELECT COUNT(*) FROM tasks WHERE "userId" = $1 AND "isCompleted" = FALSE;`, [userId]);
    client.release();
    return { completed: completedTasks.rows[0].count, incompleted: incompletedTasks.rows[0].count }
}