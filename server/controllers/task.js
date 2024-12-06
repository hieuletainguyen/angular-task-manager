import pool from "../database/postgresql-config.js";
import configService from "../helper/config.service.js";
import { decodeAndGetUser } from "../helper/helper.js";

const jwtSecretKey = configService.get["JWT_SECRET_KEY"]

export const addTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const { title, description, priority, dueDate } = req.body;
    const client = await pool.connect();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    client.query("INSERT INTO tasks (title, description, priority, dueDate, isCompleted, userId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [title, description, priority, dueDate, false, user.userId],
        (err, result) => {
            if (err) {
                client.release();
                return res.status(500).json({ message: "Error during adding task. " + err.message});
            }
            client.release();
            return res.json({ message: "success", result: result.rows});
        }
    )
}

export const getTasks = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const client = await pool.connect();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    const user = decodeAndGetUser(token);
    console.log("user of get tasks: ", user);

    if (user.message !== "sucess") return res.status(400).json(user);

    const result = client.query("SELECT * FROM tasks WHERE userId = $1;",
        [user.userId],
        (err, result) => {
            if (err) {
                client.release();
                return res.status(500).json({ message: "Error during adding task. " + err.message});
            }
            console.log(result)
            client.release();
            return res.json({ message: "success", result: result.rows});
        }
    )
}

export const getTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const taskId  = req.params["id"];
    const client = await pool.connect();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    client.query("SELECT * FROM tasks WHERE userId = $1 AND id = $2;",
        [user.userId, taskId],
        (err, result) => {
            if (err) {
                client.release();
                return res.status(500).json({ message: "Error during adding task. " + err.message});
            }
            client.release();
            return res.json({ message: "success", result: result.rows});
        }
    )
}

export const modifyTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const taskId  = req.params["id"];
    const {isCompleted, priority, dueDate, description, title} = req.body;
    const client = await pool.connect();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    const fieldsToUpdate = {}
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (isCompleted) fieldsToUpdate.isCompleted = isCompleted;
    if (priority) fieldsToUpdate.priority = priority;
    if (dueDate) fieldsToUpdate.dueDate = dueDate;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    if (keys.length === 0) {
        return res.status(400).send('No valid fields to update');
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    client.query(`UPDATE tasks SET ${setClause} WHERE id = ${taskId} RETURNING *;`,
        [...values, user.userId],
        (err, result) => {
            if (err) {
                client.release();
                return res.status(500).json({ message: "Error during adding task. " + err.message});
            }
            client.release();
            return res.json({ message: "success", result: result.rows});
        }
    )
}

export const deleteTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const taskId  = req.params["id"];
    const client = await pool.connect();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    client.query("DELETE FROM tasks WHERE userId = $1 AND id = $2 RETURNING *;",
        [user.userId, taskId],
        (err, result) => {
            if (err) {
                client.release();
                return res.status(500).json({ message: "Error during adding task. " + err.message});
            }
            client.release();
            return res.json({ message: "success", result: result.rows});
        }
    )
}