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
 *              201:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "success"
 *                              result: [ 
 *                                          { 
 *                                              id: 1, 
 *                                              username: "Scott", 
 *                                              email: "example@gmail.com", 
 *                                              password: " Nnakjxnorie231m",
 *                                              permission: "basic"
 *                                           }
 *                                      ]
 *              409:
 *                  description: Conflict
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "The email is already registered!"
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
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "success"
 *                              token: "BDWINaijndkmsndviqberfb@q32jadnsf"
 *              500: 
 *                  description: Server error (database not established or Error during search account)
 *              401:
 *                  description: Invalid password
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "Invalid email or password"
 *              404:
 *                  description: Email is not registered
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "Email is not registered"
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
 *          parameters:
 *          - in: header
 *            name: Authorization
 *            required: true
 *            schema:
 *              type: string
 *            description: token for authorization
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "success"
 *                              userId: 1
 *                              permission: "admin"
 *              500: 
 *                  description: Server error 
 *              401: 
 *                  description: Token expired or no token provided
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "No token provided"
 *              403:
 *                  description: Invalid token
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "Invalid Token"
 */

router.get("/user/decode-token", 
    user.decodeToken
);
 

export default router;

