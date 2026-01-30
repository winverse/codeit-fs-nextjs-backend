import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { prisma } from './db/prisma.js';
import { config } from '#config';
import { generateOpenApiSpec } from './config/swagger.js';
import { router as apiRouter } from './routes/index.js';
import cookieParser from 'cookie-parser';
import { errorHandler, cors } from '#middlewares';
import { setupGracefulShutdown } from '#utils';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);

app.use('/api', apiRouter);

// Swagger UI
// apiRouter가 등록된 후 호출해야 스키마가 레지스트리에 등록됨
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(generateOpenApiSpec()));

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
  console.log(
    `[${config.NODE_ENV}] Swagger UI: http://localhost:${config.PORT}/api-docs`,
  );
});

setupGracefulShutdown(server, prisma);
