import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Auth API',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
