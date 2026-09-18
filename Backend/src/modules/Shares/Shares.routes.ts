import { Hono } from "hono";

import { accessShare, accessProtectedShare,revoke } from "./Shares.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const shareRoutes = new Hono();

shareRoutes.get("/:token", accessShare);
shareRoutes.post("/:token/access", accessProtectedShare);
shareRoutes.post("/:id/revoke", authMiddleware, revoke);
export default shareRoutes;