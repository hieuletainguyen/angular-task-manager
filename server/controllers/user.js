import db from "../database/postgresql-config.js"
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import configService from "../helper/config.service.js";
import { decodeAndGetUser } from "../helper/helper.js";

dotenv.config();

const jwtSecretKey = configService.get('JWT_SECRET_KEY');

export const registerUser = async (req, res) => {
    const {username, email, password } = req.body;
    const permission = req.body.permission || "basic"
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    } 

    db.pool.query("SELECT * FROM account WHERE email = $1;", [email], (req, res) => {
        if (err) {
            return res.json({message: "Error during searching " + err.message})
        }
        return res.json({ message: "The email is already registered!"})
    });

    const saltRounds = parseInt(configService.get['SALT_ROUNDS'])
    const new_salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, new_salt);

    db.pool.query("INSERT INTO account (username, email, password, permission) VALUES ($1, $2, $3, $4) RETURNING *;",
        [username, email, hashPassword, permission], 
        (err, result) => {
            if (err) {
                return res.json({message: "Error during adding " + err.message})
            }

            return res.status(200).json({ message: "success", result: result})
        }
    )
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    db.pool.query("SELECT * FROM account WHERE email = $1;", [email], (req, res) => {
        if (result.length === 0) {
            return res.json({ message: "You need to register first!"});
        }

        const hashPassword = result[0].password;
        const userId = result[0].id;
        const match = bcrypt.compare(password, hashPassword);

        if (match) {
            const token = jwt.sign({userId: userId}, jwtSecretKey, {expiresIn: "12h"});
        
            res.cookie("TOKENS", token, {httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000});
            return res.json({message: "success"});
        } else {
            return res.json({message: "Invalid email or password"});
        }
    })
}


export const logout = (req, res) => {
    res.clearCookie("TOKENS");
    return res.status(200).json({ message: "success"});
}

export const decodeToken = async (req, res) => {
    const token = req.cookies?.TOKENS;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, jwtSecretKey, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError" ) {
                return res.json({ message: "Token Expired"});
            }
            return res.json({ message: "Invalid Token" });
        }
        return res.status(200).json({ message: "sucess", userId: decoded.userId});
    });
}


export const getAccounts = async (req, res) => {
    const token = req.cookie?.TOKENS;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    console.log("user: ", user);
    if (user.permission !== "admin") {
        return res.status(401).json({ message: "You are not authorized"})
    }

    db.pool.query("SELECT * FROM account", (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error: " + err.message});
        }
        return res.json({ message: "success", result: result})
    })
}

export const modifyAccount = async (req, res) => {
    const token = req.cookie?.TOKENS;
    const {username, password, email } = req.body;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (password) fieldsToUpdate.password = password;
    if (email) fieldsToUpdate.email = email;

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
        return res.status(400).send('No valid fields to update');
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(fieldsToUpdate);

    const query = `UPDATE account SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

    db.pool.query(query, [...values, user.userId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error while updating info. " + err.message });
        return res.json({ message: "success", result: result });
    })
}

export const deleteUser = async (req, res) => {
    const token = req.cookie?.TOKENS;
    const { accounts } = req.body; // Ex: accounts = [1, 2, 3]

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = decodeAndGetUser(token);

    if (user.message !== "sucess") return res.status(400).json(user);

    console.log("user: ", user);
    if (user.permission !== "admin") {
        return res.status(401).json({ message: "You are not authorized"})
    }

    const placeholder = accounts.map((_, index) => `$${index+1}`).join(',');
    const query = `DELETE FROM users WHERE id IN (${placeholder}) RETURNING *`;

    db.pool.query(query, accounts, async (err, result) => {
        if (err) return res.status(500).json({ message: "Error while deleting info. " + err.message });
        return res.json({ message: "success", result: result });
    })
}
