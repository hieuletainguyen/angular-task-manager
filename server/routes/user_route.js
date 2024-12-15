import { Router } from "express";
import * as user from "../controllers/user.js"
import { body } from "express-validator"

const router = Router();

/**
 *  @swagger
 *  /user/register-user:
 *      post:
 *          summary: Register a new user
 *          tags: 
 *          - User
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          required:
 *                              - username
 *                              - email
 *                              - password
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: The username of the new user
 *                              email:
 *                                  type: string
 *                                  description: The email of the new user
 *                              password:
 *                                  type: string
 *                                  description: The password for the new user
 * 
 *          responses:
 *              200:
 *                  description: Successful response
 *              500: 
 *                  description: Server error (database not established)
 */

router.post("/user/register-user", 
    body('username').not().isEmpty().escape(),
    body("email").not().isEmpty().escape(), 
    body("password").not().isEmpty().escape(),
    user.registerUser
)

/**
 *  @swagger
 *  /user/auth:
 *      post:
 *          summary: Login into account
 *          tags: 
 *          - User
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          required:
 *                              - email
 *                              - password
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  description: The email of the new user
 *                              password:
 *                                  type: string
 *                                  description: The password for the new user
 * 
 *          responses:
 *              200:
 *                  description: Successful response
 *              500: 
 *                  description: Server error (database not established or Error during search account)
 *              401:
 *                  description: Invalid password
 *              404:
 *                  description: Email is not registered
 */

router.post("/user/auth",  
    body('email').not().isEmpty().escape(),
    body('password').not().isEmpty().escape(),
    user.login
)

/**
 *  @swagger
 *  /user/register-user:
 *      get:
 *          summary: decode the token to get user info
 *          tags: 
 *          - User
 *      
 *          responses:
 *              200:
 *                  description: Successful response
 *              500: 
 *                  description: Server error 
 *              401: 
 *                  description: Token expired or no toke  provided
 *              403:
 *                  description: Invalid token
 */

router.get("/user/decode-token", 
    user.decodeToken
);
 

export default router;

