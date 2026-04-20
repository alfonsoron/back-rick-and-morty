import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { errorResponse } from '../formatters/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        response.status(status).json(errorResponse(exceptionResponse, status));
        return;
      }

      const payload = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };
      const message = Array.isArray(payload.message)
        ? payload.message.join(', ')
        : (payload.message ?? payload.error ?? 'Request failed');

      response.status(status).json(errorResponse(message, status));
      return;
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
