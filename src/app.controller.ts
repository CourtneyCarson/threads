import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

// controller defines the route where you want to go
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/dog')
  getDog(): string {
    return this.appService.getDog();
  }

  @UseGuards(AuthGuard)
  @Get('/cat')
  getCat(): string {
    return this.appService.getCat();
  }
}
