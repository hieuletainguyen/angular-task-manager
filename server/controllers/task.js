import db from "../database/postgresql-config";
import configService from "../helper/config.service";
import { decodeAndGetUser } from "../helper/helper";
const jwtSecretKey = configService.get["JWT_SECRET_KEY"]

export const addTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const { task } = req.body;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    db.pool.query("INSERT INTO tasks (task, isCompleted, userId) VALUES ($1, $2, $3) RETURNING *",
        [task, false, user.userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error during adding task. " + err.message});
            return res.json({ message: "success", result: result});
        }
    )
}

export const getTasks = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const { task } = req.body;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    db.pool.query("SELECT * FROM tasks WHERE userId = $1",
        [user.userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error during adding task. " + err.message});
            return res.json({ message: "success", result: result});
        }
    )
}

export const getTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const taskId  = req.params["id"];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    db.pool.query("SELECT * FROM tasks WHERE userId = $1 AND id = $2",
        [user.userId, taskId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error during adding task. " + err.message});
            return res.json({ message: "success", result: result});
        }
    )
}

export const modifyTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const taskId  = req.params["id"];
    const {task, isCompleted} = req.body;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    const fieldsToUpdate = {}
    if (task) fieldsToUpdate.task = task;
    fieldsToUpdate.isCompleted = isCompleted;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    if (keys.length === 0) {
        return res.status(400).send('No valid fields to update');
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    db.pool.query(`UPDATE tasks SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, user.userId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error during adding task. " + err.message});
            return res.json({ message: "success", result: result});
        }
    )
}

export const deleteTask = async (req, res) => {
    const token = req.cookies?.TOKENS;
    const taskId  = req.params["id"];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    db.pool.query("DELETE FROM tasks WHERE userId = $1 AND id = $2 RETURNING *",
        [user.userId, taskId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error during adding task. " + err.message});
            return res.json({ message: "success", result: result});
        }
    )
}