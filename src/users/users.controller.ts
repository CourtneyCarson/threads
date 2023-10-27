import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(
    @Body() body: { username: string; password: string },
  ): Promise<{ message: string }> {
    const { username, password } = body;
    await this.usersService.registerUser(username, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async loginUser(
    @Body() body: { username: string; password: string },
  ): Promise<{ message: string; token: string }> {
    const { username, password } = body;
    const token = await this.usersService.loginUser(username, password);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

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
