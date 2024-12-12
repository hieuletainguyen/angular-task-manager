import pool from "../database/postgresql-config.js";
import configService from "../helper/config.service.js";
import { decodeAndGetUser } from "../helper/helper.js";

const jwtSecretKey = configService.get["JWT_SECRET_KEY"]

export const addTask = async (req, res) => {
    const token = req.headers['Authorization'];
    const { title, description, isCompleted, priority, dueDate } = req.body;
    const client = await pool.connect();

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    client.query(`INSERT INTO tasks (title, description, priority, "dueDate", "isCompleted", "userId") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [title, description, priority, dueDate, isCompleted, user.result.userId],
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
    const token = req.headers['Authorization'];
    console.log("Token: ", token)
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    client.query(`SELECT * FROM tasks WHERE "userId" = $1;`,
        [user.result.userId],
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

export const getTask = async (req, res) => {
    const token = req.headers['Authorization'];
    const taskId  = req.params["id"];
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    client.query(`SELECT * FROM tasks WHERE "userId" = $1 AND id = $2;`,
        [user.result.userId, taskId],
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
    const token = req.headers['Authorization'];
    const taskId  = req.params["id"];
    const {isCompleted, priority, dueDate, description, title} = req.body;
    console.log(req.body)
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    const fieldsToUpdate = {}
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (isCompleted || isCompleted === false) fieldsToUpdate.isCompleted = isCompleted;
    if (priority) fieldsToUpdate.priority = priority;
    if (dueDate) fieldsToUpdate.dueDate = dueDate;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    if (keys.length === 0) {
        return res.status(400).send('No valid fields to update');
    }

    const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    console.log(setClause)
    console.log(values)
    client.query(`UPDATE tasks SET ${setClause} WHERE id = ${taskId} AND "userId" = $${keys.length+1} RETURNING *;`,
        [...values, user.result.userId],
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
    const token = req.headers['Authorization'];
    const taskId  = req.params["id"];
    console.log("task id: ", taskId);
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    client.query(`DELETE FROM tasks WHERE "userId" = $1 AND id = $2 RETURNING *;`,
        [user.result.userId, taskId],
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