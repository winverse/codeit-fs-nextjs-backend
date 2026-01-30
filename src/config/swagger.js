import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import pkg from "../../package.json" with { type: "json" };
import { config } from "./config.js";

// 1. 레지스트리 초기화 (이 객체에 스키마와 경로를 등록)
export const registry = new OpenAPIRegistry();

// 2. 기본 보안 스키마나 공통 컴포넌트 등록 (필요 시)
// registry.registerComponent('securitySchemes', 'bearerAuth', {
//   type: 'http',
//   scheme: 'bearer',
//   bearerFormat: 'JWT',
// });

// 3. OpenAPI 문서 생성 함수
export const generateOpenApiSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "영화 리뷰 API",
      version: pkg.version, // package.json의 버전 사용
      description: "Next.js 학습용 TMDB 연동 영화 리뷰 백엔드 API (Zod 기반)",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "개발 서버",
      },
    ],
  });
};
