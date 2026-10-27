import { 
  Injectable, 
  BadRequestException, 
  ForbiddenException, 
  InternalServerErrorException, 
  Logger 
} from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as rateLimit from 'express-rate-limit'; // Nota: Para NestJS se recomienda usar @nestjs/throttler, pero implementaremos la lógica de control aquí

interface ProxyConfig {
  targetBaseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  allowedMethods?: string[];
  blockedIps?: string[];
}

@Injectable()
export class GenericProxyService {
  private readonly logger = new Logger(GenericProxyService.name);
  private axiosInstance: AxiosInstance;

  constructor(private config: ProxyConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.targetBaseUrl,
      timeout: config.timeout || 10000,
      headers: config.headers || {},
    });
  }

  /**
   * Ejecuta una petición proxy con reglas de seguridad robustas.
   */
  async request<T>(
    method: string, 
    endpoint: string, 
    payload?: any, 
    options: AxiosRequestConfig = {}, 
    clientIp?: string
  ): Promise<T> {
    
    // 1. Regla de Protección: Validación de Métodos Permitidos
    if (this.config.allowedMethods && !this.config.allowedMethods.includes(method.toUpperCase())) {
      this.logger.warn(`Blocked unauthorized method: ${method} from IP ${clientIp}`);
      throw new ForbiddenException(`HTTP method ${method} is not allowed through this proxy.`);
    }

    // 2. Regla de Protección: Lista Negra de IPs (Blacklist)
    if (this.config.blockedIps && this.config.blockedIps.includes(clientIp)) {
      this.logger.error(`Blocked request from blacklisted IP: ${clientIp}`);
      throw new ForbiddenException('Access denied from your IP address.');
    }

    // 3. Regla de Protección: Sanitización de Endpoint (Prevención de SSRF)
    if (endpoint.includes('..') || endpoint.includes('http') || endpoint.includes('localhost')) {
      this.logger.error(`Potential SSRF attack detected in endpoint: ${endpoint} from IP ${clientIp}`);
      throw new BadRequestException('Invalid endpoint path provided.');
    }

    try {
      this.logger.log(`Proxying ${method} request to ${endpoint} for IP ${clientIp}`);
      
      const response: AxiosResponse<T> = await this.axiosInstance({
        method,
        url: endpoint,
        data: payload,
        ...options,
      });

      return response.data;
    } catch (error) {
      this.handleProxyError(error);
    }
  }

  private handleProxyError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // El servidor respondió con un código fuera del rango 2xx
        this.logger.error(`Target server responded with error: ${error.response.status}`);
        throw new InternalServerErrorException(
          `Target server error: ${error.response.data?.message || error.response.statusText}`
        );
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta (Timeout)
        this.logger.error(`No response received from target server: ${error.message}`);
        throw new InternalServerErrorException('Target server is unreachable or timed out.');
      }
    }
    
    this.logger.error(`Unexpected Proxy Error: ${error.message}`);
    throw new InternalServerErrorException('An unexpected error occurred in the proxy layer.');
  }
}
