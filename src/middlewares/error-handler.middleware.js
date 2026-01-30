import { HTTP_STATUS } from "#constants";
import { HttpException } from "#exceptions";
import { isDevelopment } from "#config";

export const errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err);

  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(isDevelopment && { stack: err.stack }),
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: "서버 내부 오류가 발생했습니다.",
    ...(isDevelopment && { stack: err.stack }),
  });
};
