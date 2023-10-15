import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// controller defines the route where you want to go
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
