import express from "express";
import { getUserForSideBar ,getMessages , sendMessage } from "../controllers/message.controller.js";
 import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();
router.get("/users",protectRoute , getUserForSideBar);
router.get("/:id",protectRoute ,getMessages) ;
router.post("/send/:id", protectRoute, sendMessage)
export default router;