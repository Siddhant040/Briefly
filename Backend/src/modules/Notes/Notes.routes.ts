import { Hono } from "hono";

import { create ,getById,update,remove} from "./Notes.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const noteRoutes = new Hono();

noteRoutes.post("/", authMiddleware, create);
noteRoutes.get("/:id", authMiddleware, getById);
noteRoutes.patch("/:id", authMiddleware, update);
noteRoutes.delete("/:id", authMiddleware, remove);


export default noteRoutes;