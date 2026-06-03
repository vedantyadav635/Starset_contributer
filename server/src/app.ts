import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import adminTasks from "./routes/admin.tasks";
import adminStats from "./routes/admin.stats";
import adminSubmissions from "./routes/admin.submissions";
import contributorTasks from "./routes/contributor.tasks";
import submissions from "./routes/submissions";
import userSubmissions from "./routes/user.submissions";
import userStats from "./routes/user.stats";
import adminExport from "./routes/admin.export";

import { requireAuth, requireAdmin } from "./middleware/requireAuth";

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

// ✅ Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use(globalLimiter);

// ✅ Health check route (used to keep Render free-tier awake)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ✅ SECURE ROUTES
// Admin routes: Require valid token AND admin role
app.use("/admin/tasks", requireAuth, requireAdmin, adminTasks);
app.use("/admin/stats", requireAuth, requireAdmin, adminStats);
app.use("/admin/submissions", requireAuth, requireAdmin, adminSubmissions);
app.use("/admin/export", requireAuth, requireAdmin, adminExport);

// Contributor/User routes: Require valid token
app.use("/contributor/tasks", requireAuth, contributorTasks);
app.use("/submissions", requireAuth, submissions);
app.use("/user/submissions", requireAuth, userSubmissions);
app.use("/user/stats", requireAuth, userStats);

export default app;
