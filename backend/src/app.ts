import express from "express";
import cors from "cors";

import adminTasks from "./routes/admin.tasks";
import adminStats from "./routes/admin.stats";
import contributorTasks from "./routes/contributor.tasks";
import submissions from "./routes/submissions";
import userSubmissions from "./routes/user.submissions";
import userStats from "./routes/user.stats";

const app = express();

// ✅ CORS MIDDLEWARE - Allow network access
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check against explicit FRONTEND_URL from env
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }

      // Allow localhost and local network
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.startsWith('http://192.168.') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }

      // Reject other origins
      // console.log('Blocked by CORS:', origin); // Optional: Debugging
      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ JSON body parser
app.use(express.json());

// ✅ Routes
app.use("/admin/tasks", adminTasks);
app.use("/admin/stats", adminStats);
app.use("/contributor/tasks", contributorTasks);
app.use("/submissions", submissions);
app.use("/user/submissions", userSubmissions);
app.use("/user/stats", userStats);

export default app;
