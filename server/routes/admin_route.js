import { Router } from "express";
import * as admin from "../controllers/admin.js"
import { body } from "express-validator";

const router = Router();

/**
 *  @swagger
 *  /user/register-user:
 *      post:
 *          summary: Register a new user
 *          tags: 
 *          - Admin
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
 *                              - permission
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: The username of the new user assigned by admin
 *                              email:
 *                                  type: string
 *                                  description: The email of the new user assigned by admin
 *                              password:
 *                                  type: string
 *                                  description: The password for the new user assigned by admin
 *                              permission:
 *                                  type: string
 *                                  description: The permission for the new user assigned by admin
 *                      example:
 *                          username: "john_doe"
 *                          email: "john.doe@gmail.com"
 *                          password: "securepassword123"
 *                          permission: "admin"
 *          responses:
 *              201:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "success"
 *              500: 
 *                  description: Server error (database not established)
 */

router.post("/admin/create-account", 
    body("email").not().isEmpty().escape(),
    body("username").not().isEmpty().escape(), 
    body("password").not().isEmpty().escape(), 
    body("permission").not().isEmpty().escape(),
    admin.createAccount
)

/**
 *  @swagger
 *  /user/register-user:
 *      get:
 *          summary: Register a new user
 *          tags: 
 *          - Admin
 *          responses:
 *              200:
 *                  description: Successful response
 *              401: 
 *                  description: No token provided or you are not authorized
 *              500: 
 *                  description: Server error
 */
router.get("/admin/get-accounts",
    admin.getAccounts
)

/**
 *  @swagger
 *  /user/register-user:
 *      put:
 *          summary: Register a new user
 *          tags: 
 *          - Admin
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          required:
 *                              - username
 *                              - email
 *                              - id
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: The username of the user
 *                              email:
 *                                  type: string
 *                                  description: The email of the user
 *                              id:
 *                                  type: string
 *                                  description: The id for the user
 * 
 *          responses:
 *              200:
 *                  description: Successful response
 *              401: 
 *                  description: No token provided or you are not authorized
 *              500: 
 *                  description: Server error
 */

router.put("/admin/update-account", 
    body('id').not().isEmpty().escape(),
    body('username').not().isEmpty().escape(),
    body('email').not().isEmpty().escape(),
    admin.modifyAccount
) 

/**
 *  @swagger
 *  /user/register-user:
 *      delete:
 *          summary: Register a new user
 *          tags: 
 *          - Admin
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          required:
 *                              - accountId
 *                          properties:
 *                              accountId:
 *                                  type: string
 *                                  description: The id for the user
 * 
 *          responses:
 *              200:
 *                  description: Successful response
 *              401:
 *                  description: No token provided or you are not authorized
 *              500: 
 *                  description: Server error (database not established)
 */

router.delete("/admin/delete-account", 
    body('accountId').not().isEmpty(),
    admin.deleteUser
)


export default router;