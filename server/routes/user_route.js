import { Router } from "express";
import * as user from "../controllers/user.js"
import { body } from "express-validator"

const router = Router();

router.post("/user/register-user", 
    body('username').not().isEmpty().escape(),
    body("email").not().isEmpty().escape(), 
    body("password").not().isEmpty().escape(),
    user.registerUser
)

router.post("/user/auth",  
    body('email').not().isEmpty().escape(),
    body('password').not().isEmpty().escape(),
    user.login
)

router.post("/user/logout", 
    user.logout
);

router.put("/user/account", 
    user.modifyAccount
) 

router.get("/user/decode-token", 
    user.decodeToken
);
 
router.get("/user/get-accounts",
    user.getAccounts
)

router.delete("/user", 
    user.deleteUser
)

export default router;

