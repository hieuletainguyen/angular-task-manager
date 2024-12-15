import { decodeAndGetUser, numberOfTasks } from "../helper/helper.js";
import pool from "../database/postgresql-config.js"


export const getAccounts = async (req, res) => {
    const token = req.headers['authorization'];
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    if (user.result.permission !== "admin") {
        return res.status(401).json({ message: "You are not authorized"})
    }

    client.query("SELECT * FROM account WHERE permission = 'basic';", async (err, result) => {
        if (err) {
            client.release();
            return res.status(500).json({ message: "Error: " + err.message});
        }
        client.release();
        const newResult = []
        for (const account of result.rows ) {
            const resultNumberOfTasks = await numberOfTasks(account.id);
            newResult.push({ ...account, ...resultNumberOfTasks})
        }
        return res.json({ message: "success", result: newResult})
    })
}

export const modifyAccount = async (req, res) => {
    const token = req.headers['authorization'];
    const {id, username, email } = req.body;
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    } 

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.result.permission !== "admin") {
        return res.status(401).json({ message: "You are not authorized"})
    }

    if (user.message !== "success") return res.status(400).json(user);

    const query = `UPDATE account SET username = $1, email = $2 WHERE id = $3 RETURNING *;`;

    client.query(query, [username, email, id], (err, result) => {
        if (err) {
            client.release();
            return res.status(500).json({ message: "Error while updating info. " + err.message });
        }
        client.release();
        return res.status(200).json({ message: "success", result: result.rows });
    })
}

export const deleteUser = async (req, res) => {
    const token = req.headers['authorization'];
    const { accountId } = req.body; 
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    if (user.result.permission !== "admin") {
        return res.status(401).json({ message: "You are not authorized"})
    }

    const query = `DELETE FROM account WHERE id = $1 RETURNING *;`;

    client.query(query, [accountId], (err, result) => {
        if (err) {
            client.release();
            return res.status(500).json({ message: "Error while deleting info. " + err.message });
        }
        client.release();
        return res.status(200).json({ message: "success", result: result.rows });
    })
}