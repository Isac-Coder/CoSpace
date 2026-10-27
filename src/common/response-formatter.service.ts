import { Injectable } from '@nestjs/common';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
}

@Injectable()
export class ResponseFormatterService {
  /**
   * Formatea una respuesta exitosa de manera estandarizada.
   */
  success<T>(data: T, message: string = 'Operation completed successfully', path?: string): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Formatea una respuesta de error de manera estandarizada.
   */
  error(message: string, path?: string): ApiResponse {
    return {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      path,
    };
  }
}
