import { ERROR_MESSAGE } from "#constants";
import { BadRequestException } from "#exceptions";
import { flattenError } from "zod";
import { isProduction } from "#config";

export const validate = (target, schema) => {
  if (!["body", "query", "params"].includes(target)) {
    throw new Error(
      `[validate middleware] Invalid target: "${target}". Expected "body", "query", or "params".`,
    );
  }
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
        const { fieldErrors } = flattenError(result.error);

        if (isProduction) {
          throw new BadRequestException(ERROR_MESSAGE.INVALID_INPUT);
        }

        throw new BadRequestException(
          ERROR_MESSAGE.VALIDATION_FAILED,
          fieldErrors,
        );
      }

      // 검증된 데이터로 덮어쓰기 (Express 5에서도 객체 내부 속성 변경은 가능)
      Object.assign(req[target], result.data);
      next();
    } catch (error) {
      next(error);
    }
  };
};
