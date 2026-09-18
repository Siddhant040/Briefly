import { Hono } from "hono";
import { create as createShare } from "../Shares/Shares.controller.js";
import { create ,getById,update,remove} from "./Notes.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const noteRoutes = new Hono();

noteRoutes.post("/", authMiddleware, create);
noteRoutes.get("/:id", authMiddleware, getById);
noteRoutes.patch("/:id", authMiddleware, update);
noteRoutes.delete("/:id", authMiddleware, remove);
noteRoutes.post("/:id/shares", authMiddleware, createShare);


export default noteRoutes;