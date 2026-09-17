import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import {db} from "./db/index.js";
import { ApiError } from "./utils/api-error.js";
import { errorHandler } from "./middleware/error-handler.js";


const app = new Hono();
app.onError(errorHandler);

app.get("/health", (c) => {
  return c.json({
    status: "ok",
  });
});
app.get("/test-error", async () => {
  throw new Error("Test error");
});
app.get("/test-api-error", () => {
  throw new ApiError(
    "Note not found",
    404,
    "NOTE_NOT_FOUND",
  );
});
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