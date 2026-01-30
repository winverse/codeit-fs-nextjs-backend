import express from "express";
import swaggerUi from "swagger-ui-express";
import { prisma } from "./db/prisma.js";
import { config } from "#config";
import { generateOpenApiSpec } from "./config/swagger.js";
import { router as apiRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";
import { errorHandler, cors } from "#middlewares";
import { setupGracefulShutdown } from "#utils";

const app = express();

// JSON 파싱
app.use(express.json());

// 쿠키 파싱
app.use(cookieParser());

// CORS
app.use(cors);

// API 라우터 등록
app.use("/api", apiRouter);

// Swagger UI
// apiRouter가 등록된 후 호출해야 스키마가 레지스트리에 등록됨
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(generateOpenApiSpec()));

// 에러 핸들러
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
  console.log(
    `[${config.NODE_ENV}] Swagger UI: http://localhost:${config.PORT}/api-docs`,
  );
});

// Graceful shutdown
setupGracefulShutdown(server, prisma);
