const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat.routes");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("./config/morgan");

const app = express();

// Trust the first proxy (Render, Railway, etc.) so express-rate-limit
// can read the real client IP from X-Forwarded-For
app.set("trust proxy", 1);

app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);


app.use(morgan.successHandler);
app.use(morgan.errorHandler);


app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://frountend-mini-8ott4zqnb-aditya-vermas-projects-8809f241.vercel.app"
      ];
      
      // Allow any vercel preview URL or explicitly allowed origins
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        // If you define a specific CLIENT_URL in env, allow it too
        if (process.env.CLIENT_URL === origin) {
           callback(null, true);
        } else {
           callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend service is running." });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", chatRoutes);


app.use(notFound);
app.use(errorHandler);

module.exports = app;