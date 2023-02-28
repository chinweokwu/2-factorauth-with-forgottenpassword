import express from "express";
import {passwordLink, verifyUrl, resetPassword} from "../controller/forgetPasswordController.js";
const router = express.Router();

router.post("/passwordreset", passwordLink)
router.get("/:id/:token",verifyUrl);
router.post("/:id/:token",resetPassword);
export default router;
