import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  /**
   * Constructs a new instance of the class, initializing the `usersService` property.
   * @param usersService - An instance of UsersService to be used for user-related operations.
   */
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  /**
   * Registers a new user with the provided username and password.
   *
   * @param body - An object containing the username and password of the new user.
   * @returns A promise that resolves to an object with a success message.
   */
  async registerUser(
    @Body() body: { username: string; password: string },
  ): Promise<{ message: string }> {
    const { username, password } = body;
    await this.usersService.registerUser(username, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  /**
   * Logs in a user by validating their username and password.
   *
   * @param body - An object containing the username and password of the user.
   * @returns A promise that resolves to an object containing a success message and a token.
   *
   * @example
   * loginUser({ username: 'testUser', password: 'testPassword' })
   * // Returns: { message: 'Login successful', token: 'abc123' }
   */
  async loginUser(
    @Body() body: { username: string; password: string },
  ): Promise<{ message: string; token: string }> {
    const { username, password } = body;
    const token = await this.usersService.loginUser(username, password);
    return { message: 'Login successful', token };
  }

  @Get('users')
  @UseGuards(AuthGuard)
  /**
   * Retrieves a list of all users.
   *
   * @returns A promise that resolves to an array of User objects.
   */
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
