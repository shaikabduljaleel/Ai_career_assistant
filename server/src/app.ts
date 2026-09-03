import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from 'cookie-parser';
import passport from "./config/passport.js";
import profileRoutes from "./routes/profile.routes.js";
import documentRoutes from "./routes/document.routes.js";
import searchRoutes from "./routes/search.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import careerIntelligenceRoutes from "./routes/career-intelligence.routes.js";

const app = express();

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use(
  "/api/career-intelligence",
  careerIntelligenceRoutes
);
app.use(
  "/api/documents",
  documentRoutes
);
app.use("/api/search", searchRoutes);
app.use(
  "/api/chat",
  chatRoutes
);

export default app;