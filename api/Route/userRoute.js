import express from "express";
import {login,register, emailLink} from "../controller/userController.js";
const router = express.Router();

router.post('/api/login',login);
router.post('/api/register',register);
router.get("/:id/verify/:token", emailLink)

export default router;
