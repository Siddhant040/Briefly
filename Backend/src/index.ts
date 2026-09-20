import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import {db} from "./db/index.js";

import { errorHandler } from "./middleware/error-handler.js";
import userRoutes from "./modules/Users/Users.routes.js";
import noteRoutes from "./modules/Notes/Notes.routes.js";
import shareRoutes from "./modules/Shares/Shares.routes.js";


const app = new Hono();
app.onError(errorHandler);

app.route("/auth", userRoutes);
app.route("/notes", noteRoutes);
app.route("/share", shareRoutes);
app.get("/db-health", async(c)=>{
    try {
        await db.execute("SELECT 1")
        return c.json(
            {
            status:"ok",
            database:"connected"
        },
        
    )
        
    } catch (error) {
        console.error("Database Connection Error",error)
        return c.json(
            {
            status:"error",
            database:"disconnected"
        },
        500,
    )
        
    }
})

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
  hostname: "0.0.0.0",
});

console.log(
  `Server running on port ${process.env.PORT || 3000}`
);