import { HTTP_STATUS } from '#constants';

export class HttpException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class NotFoundException extends HttpException {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = '잘못된 요청입니다.') {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export class InternalServerException extends HttpException {
  constructor(message = '서버 내부 오류가 발생했습니다.') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
