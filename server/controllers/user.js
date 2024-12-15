import pool from "../database/postgresql-config.js"
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import configService from "../helper/config.service.js";

dotenv.config();

const jwtSecretKey = configService.get('JWT_SECRET_KEY');

export const registerUser = async (req, res) => {
    const {username, email, password } = req.body;
    const permission = req.body.permission || "basic"
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
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

    const saltRounds = parseInt(configService.get['SALT_ROUNDS'])
    const new_salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, new_salt);

    client.query("INSERT INTO account (username, email, password, permission) VALUES ($1, $2, $3, $4) RETURNING *;",
        [username, email, hashPassword, permission], 
        (err, result) => {
            if (err) {
                client.release();
                return res.json({message: "Error during adding " + err.message})
            }
            client.release();
            return res.status(200).json({ message: "success", result: result.rows})
        }
    )
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const client = await pool.connect();

    if (!client) {
        return res.status(500).json({ message: "Database connection is not established." });
    }

    client.query("SELECT * FROM account WHERE email = $1;", [email], async (err, result) => {
        if (err) {
            client.release();
            return res.status(500).json({message: "Error during searching " + err.message})
        }
        if (result.rows.length === 0) {
            client.release();
            return res.status(404).json({ message: "You need to register first!"});
        }
        const hashPassword = result.rows[0].password;
        const userId = result.rows[0].id;
        const permission = result.rows[0].permission;
        const match = await bcrypt.compare(password, hashPassword);

        if (match) {
            const token = jwt.sign({userId: userId, permission: permission }, jwtSecretKey, {expiresIn: "12h"});
            client.release();
            // res.cookie("TOKENS", token, {secure: true, maxAge: 12 * 60 * 60 * 1000});
            return res.status(200).json({message: "success", token: token});
        } else {
            client.release();
            return res.status(401).json({message: "Invalid email or password"});
        }
    })
}


export const logout = (req, res) => {
    res.clearCookie("TOKENS");
    return res.status(200).json({ message: "success"});
}

export const decodeToken = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, jwtSecretKey, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError" ) {
                return res.status(401).json({ message: "Token Expired"});
            }
            return res.status(403).json({ message: "Invalid Token" });
        }
        return res.status(200).json({ message: "success", userId: decoded.userId, permission: decoded.permission});
    });
}



