import { 
  Catch, 
  ArgumentsHost, 
  ExceptionFilter, 
  HttpStatus 
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseFormatterService } from './response-formatter.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly formatter: ResponseFormatterService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 
      exception instanceof HttpStatus || 
      exception.status || 
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || 'Internal server error';
    const path = request.url;

    // Si es un 404, podemos personalizar el mensaje
    const finalMessage = status === HttpStatus.NOT_FOUND 
      ? 'The requested resource was not found on this server.' 
      : message;

    const formattedResponse = this.formatter.error(finalMessage, path);

    response.status(status).json(formattedResponse);
  }
}
