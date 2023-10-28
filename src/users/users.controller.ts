import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { User } from './schemas/user.schema';
import { AuthResponse, RegisterResponse, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(
    @Body() body: { name: string; username: string; password: string },
  ): Promise<RegisterResponse> {
    const { name, username, password } = body;
    const response = await this.usersService.registerUser(
      name,
      username,
      password,
    );
    return response;
  }

  @Post('login')
  async loginUser(
    @Body() body: { username: string; password: string },
  ): Promise<AuthResponse> {
    const { username, password } = body;
    // const token = await this.usersService.loginUser(username, password);
    const authResponse = await this.usersService.loginUser(username, password);
    return authResponse;
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  // future feat:
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
