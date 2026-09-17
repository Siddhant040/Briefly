import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import {db} from "./db/index.js";

import { errorHandler } from "./middleware/error-handler.js";
import userRoutes from "./modules/Users/Users.routes.js";
import noteRoutes from "./modules/Notes/Notes.routes.js";


const app = new Hono();
app.onError(errorHandler);

app.route("/auth", userRoutes);
app.route("/notes", noteRoutes);
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
  port: 3000,
});

console.log("Server running on http://localhost:3000");