import express from "express";
import cors from "cors";

import adminTasks from "./routes/admin.tasks";
import adminStats from "./routes/admin.stats";
import contributorTasks from "./routes/contributor.tasks";
import submissions from "./routes/submissions";
import userSubmissions from "./routes/user.submissions";
import userStats from "./routes/user.stats";

const app = express();

// ✅ CORS MIDDLEWARE - Allow all origins (API is protected via Supabase auth)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ JSON body parser
app.use(express.json());

// ✅ Health check route (used to keep Render free-tier awake)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ✅ Routes
app.use("/admin/tasks", adminTasks);
app.use("/admin/stats", adminStats);
app.use("/contributor/tasks", contributorTasks);
app.use("/submissions", submissions);
app.use("/user/submissions", userSubmissions);
app.use("/user/stats", userStats);

export default app;
