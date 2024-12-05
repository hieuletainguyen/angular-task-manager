import { Router } from "express";
import * as tasks from "../controllers/task.js";

const router = Router();

router.post("/tasks/add-task",
    tasks.addTask
)

router.get("/tasks/get-tasks", 
    tasks.getTasks
)

router.get("/tasks/get-task/:id", 
    tasks.getTask
)

router.put("/tasks/modify-task/:id",
    tasks.modifyTask
)

router.delete("/tasks/delete-task/:id",
    tasks.deleteTask
)

export default router;