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
 *          - User
 * 
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