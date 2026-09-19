import { Hono } from "hono";
import { create as createShare } from "../Shares/Shares.controller.js";
import { create ,getById,update,remove,getAll} from "./Notes.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getByNoteId } from "../Shares/Shares.controller.js";

const noteRoutes = new Hono();

noteRoutes.post("/", authMiddleware, create);
noteRoutes.get("/", authMiddleware, getAll);
noteRoutes.get("/:id", authMiddleware, getById);
noteRoutes.patch("/:id", authMiddleware, update);
noteRoutes.delete("/:id", authMiddleware, remove);
noteRoutes.get("/:id/shares",authMiddleware,getByNoteId);
noteRoutes.post("/:id/shares", authMiddleware, createShare);


export default noteRoutes;