import { Hono } from "hono";
import { register,login, me, logout } from "./Users.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const userRoutes = new Hono();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/me", authMiddleware, me);
userRoutes.post("/logout",authMiddleware ,logout);

export default userRoutes;