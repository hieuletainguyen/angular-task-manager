import { decodeAndGetUser, numberOfTasks } from "../helper/helper.js";
import pool from "../database/postgresql-config.js"
import configService from "../helper/config.service.js";
import bcrypt from 'bcrypt';

export const createAccount = async (req, res) => {
    const token = req.headers['authorization'];
    const { username, email, password, permission } = req.body;
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    client.query("SELECT * FROM account WHERE email = $1;", [email], (err, result) => {
        if (err) {
            client.release();
            return res.json({message: "Error during searching " + err.message})
        }
        if (result.rows.length > 0) {
            client.release();
            return res.json({ message: "The email is already registered!"})
        }
    });

    const user = await decodeAndGetUser(token);

    if (user.message !== "success") return res.status(400).json(user);

    if (user.result.permission !== "admin") {
        return res.status(401).json({ message: "You are not authorized"})
    }

    const saltRounds = parseInt(configService.get['SALT_ROUNDS'])
    const new_salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, new_salt);

    client.query("INSERT INTO account (username, email, password, permission) VALUES ($1, $2, $3, $4) RETURNING *;",
        [username, email, hashPassword, permission], 
        (err, result) => {
            if (err) {
                client.release();
                return res.status(500).json({message: "Error during adding " + err.message})
            }
            client.release();
            return res.status(201).json({ message: "success", result: result.rows})
        }
    )
}

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