import express from "express";
import cors from "cors";

import adminTasks from "./routes/admin.tasks";
import contributorTasks from "./routes/contributor.tasks";

const app = express();

// ✅ SINGLE CORS MIDDLEWARE (THIS HANDLES OPTIONS AUTOMATICALLY)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ JSON body parser
app.use(express.json());

// ✅ Routes
app.use("/admin/tasks", adminTasks);
app.use("/contributor/tasks", contributorTasks);

export default app;
