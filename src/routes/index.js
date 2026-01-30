import express from "express";
import { movieRouter } from "./movies/index.js";
import { HTTP_STATUS } from "#constants";
import { registry } from "../config/swagger.js";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const router = express.Router();

// Health Check API 문서 등록
registry.registerPath({
  method: "get",
  path: "/api",
  summary: "API 상태 확인",
  tags: ["Health"],
  responses: {
    200: {
      description: "API 정상 동작",
      content: {
        "application/json": {
          schema: z.object({
            now: z.string(),
            message: z.string(),
          }),
        },
      },
    },
  },
});

router.get("/", (_req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .json({ now: new Date().toISOString(), message: "Movie Review API" });
});

router.use("/movies", movieRouter);
