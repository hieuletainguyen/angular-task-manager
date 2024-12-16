import { Router } from "express";
import * as tasks from "../controllers/task.js";

const router = Router();

/**
 *  @swagger
 *  /tasks/add-task:
 *      post:
 *          summary: Register a new task
 *          tags: 
 *          - Task
 *          parameters:
 *          - in: header
 *            name: Authorization
 *            required: true
 *            schema:
 *              type: string
 *            description: Token for authorization
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          required:
 *                              - title
 *                              - description
 *                              - isCompleted
 *                              - priority
 *                              - dueDate
 *                          properties:
 *                              title:
 *                                  type: string
 *                                  description: The title of the new task
 *                              description:
 *                                  type: string
 *                                  description: The description of the new task
 *                              priority:
 *                                  type: string
 *                                  description: The priority for the new task
 *                              isCompleted:
 *                                  type: boolean
 *                                  description: Indicates if the task is completed
 *                              dueDate:
 *                                  type: string
 *                                  format: date
 *                                  description: The due date of the new task
 *          responses:
 *              201:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "success"
 *                              result: 
 *                                  - id: 3
 *                                    title: "Fix robot arm"
 *                                    description: "Fix the motor wire on the left bicep"
 *                                    priority: "high priority"
 *                                    dueDate: "2024-12-08"
 *                                    isCompleted: false
 *                                    userId: 1
 *              401:
 *                  description: No token provided
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "No token provided"
 *              500: 
 *                  description: Server error (database not established)
 */
router.post("/tasks/add-task", 
    tasks.addTask
);

/**
 *  @swagger
 *  /tasks/get-tasks:
 *      get:
 *          summary: Get all tasks
 *          tags: 
 *          - Task
 *          parameters:
 *          - in: header
 *            name: Authorization
 *            required: true
 *            schema:
 *              type: string
 *            description: Token for authorization
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "success"
 *                              result:
 *                                  - id: 3
 *                                    title: "Fix robot arm"
 *                                    description: "Fix the motor wire on the left bicep"
 *                                    priority: "high priority"
 *                                    dueDate: "2024-12-08"
 *                                    isCompleted: false
 *                                    userId: 1
 *                                  - id: 24
 *                                    title: "Path planning algo"
 *                                    description: "Complete path planning algorithm"
 *                                    priority: "low priority"
 *                                    dueDate: "2025-01-02"
 *                                    isCompleted: false
 *                                    userId: 1
 *              401:
 *                  description: No token provided
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "No token provided"
 *              500: 
 *                  description: Server error (database not established)
 */
router.get("/tasks/get-tasks", 
    tasks.getTasks
);

/**
 *  @swagger
 *  /tasks/get-task/{id}:
 *      get:
 *          summary: Get a task by ID
 *          tags: 
 *          - Task
 *          parameters:
 *          - in: header
 *            name: Authorization
 *            required: true
 *            schema:
 *              type: string
 *            description: Token for authorization
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: The ID of the task to retrieve
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "success"
 *                              result:
 *                                  - id: 3
 *                                    title: "Fix robot arm"
 *                                    description: "Fix the motor wire on the left bicep"
 *                                    priority: "high priority"
 *                                    dueDate: "2024-12-08"
 *                                    isCompleted: false
 *                                    userId: 1
 *              401:
 *                  description: No token provided
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "No token provided"
 *              500: 
 *                  description: Server error (database not established)
 */
router.get("/tasks/get-task/:id", 
    tasks.getTask
);

/**
 *  @swagger
 *  /tasks/modify-task/{id}:
 *      put:
 *          summary: Modify a task
 *          tags: 
 *          - Task
 *          parameters:
 *          - in: header
 *            name: Authorization
 *            required: true
 *            schema:
 *              type: string
 *            description: Token for authorization
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: The ID of the task to modify
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              title:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              priority:
 *                                  type: string
 *                              isCompleted:
 *                                  type: boolean
 *                              dueDate:
 *                                  type: string
 *                                  format: date
 *          responses:
 *              200:
 *                  description: Task modified successfully
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "Task updated successfully"
 *                              result:
 *                                  - id: 3
 *                                    title: "Fix robot arm"
 *                                    description: "Fix the motor wire on the left bicep"
 *                                    priority: "high priority"
 *                                    dueDate: "2024-12-08"
 *                                    isCompleted: TRUE
 *                                    userId: 1
 *              401:
 *                  description: No token provided
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "No token provided"
 *              500:
 *                  description: Server error
 */
router.put("/tasks/modify-task/:id", 
    tasks.modifyTask
);

/**
 *  @swagger
 *  /tasks/delete-task/{id}:
 *      delete:
 *          summary: Delete a task
 *          tags: 
 *          - Task
 *          parameters:
 *          - in: header
 *            name: Authorization
 *            required: true
 *            schema:
 *              type: string
 *            description: Token for authorization
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: The ID of the task to delete
 *          responses:
 *              200:
 *                  description: Task deleted successfully
 *                  content:
 *                      application/json:
 *                          example:
 *                              message: "Task deleted successfully"
 *                              result:
 *                                  - id: 3
 *                                    title: "Fix robot arm"
 *                                    description: "Fix the motor wire on the left bicep"
 *                                    priority: "high priority"
 *                                    dueDate: "2024-12-08"
 *                                    isCompleted: false
 *                                    userId: 1
 *              401:
 *                  description: No token provided
 *                  content:
 *                      application/json:
 *                          example: 
 *                              message: "No token provided"
 *              500:
 *                  description: Server error
 */
router.delete("/tasks/delete-task/:id", 
    tasks.deleteTask
);

export default router;
