import express from "express";
import cors from "cors";

import adminTasks from "./routes/admin.tasks";
import contributorTasks from "./routes/contributor.tasks";
import submissions from "./routes/submissions";
import userSubmissions from "./routes/user.submissions";

const app = express();

// ✅ CORS MIDDLEWARE - Allow network access
app.use(
  cors({
    // Allow localhost and network IPs (e.g., 192.168.x.x, 10.0.x.x)
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }

      // Allow local network IPs (192.168.x.x, 10.0.x.x, 172.16-31.x.x)
      const localNetworkRegex = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+$/;
      if (localNetworkRegex.test(origin)) {
        return callback(null, true);
      }

      // Reject other origins
      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ JSON body parser
app.use(express.json());

// ✅ Routes
app.use("/admin/tasks", adminTasks);
app.use("/contributor/tasks", contributorTasks);
app.use("/submissions", submissions);
app.use("/user/submissions", userSubmissions);

export default app;
