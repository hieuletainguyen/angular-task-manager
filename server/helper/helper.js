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
            return { message: "Invalid Token" };
        }
        const userDetail = client.query("SELECT * FROM account WHERE id = $1;", [decoded.userId]);
        console.log(userDetail);
        return {message: "success", result: userDetail}
        
    })
    console.log("result after verif: ", user)
    return user;
}