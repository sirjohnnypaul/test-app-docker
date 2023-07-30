import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ApiModel } from '../../models/api.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof ApiModel.ValidationDTOError) {
      this._httpBadRequestHandler(exception, host);
    } else if (exception instanceof HttpException) {
      this._httpExceptionHandler(exception, host);
    } else {
      this._unknownExceptionHandler(exception, host);
    }
  }

  private _httpBadRequestHandler(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: HttpStatus = exception.getStatus();

    this._logger.error(exception);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Bad request error',
      error: exception.message,
    });
  }

  private _httpExceptionHandler(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: HttpStatus = exception.getStatus();

    this._logger.error(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception?.message,
    });
  }

  private _unknownExceptionHandler(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionContext: string | null =
      exception instanceof Error ? exception.stack : null;

    this._logger.error(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
