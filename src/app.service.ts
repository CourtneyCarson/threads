import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getDog(): string {
    return 'Hello Dog!';
  }

  getCat(): string {
    return 'I am a cat, let me sleep!';
  }
}
