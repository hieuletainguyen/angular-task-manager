import db from "../database/postgresql-config.js"
import jwt from "jsonwebtoken";


export const decodeAndGetUser = async (token) => {
    const result = jwt.verify(token, jwtSecretKey, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError" ) {
                return { message: "Token Expired"};
            }
            return { message: "Invalid Token" };
        }
        db.pool.query("SELECT * FROM account WHERE id = $1", 
            [decoded.userId],
            (err, result) => {
                if (err) return {message: "Cannot find the user. Error: " + err.message};
                return {message: "success", result: result[0]}
            }
        )
    })

    return result;
}