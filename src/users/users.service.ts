import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
@Injectable()
export class UsersService {
  /**
   * Constructs a new instance of the class.
   *
   * @param userModel - The model representing a User, injected by Mongoose.
   * @param jwtService - Service for handling JSON Web Tokens, provided by NestJS.
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  /**
   * Registers a new user by hashing the provided password and storing the username and hashed password in the user model.
   *
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Promise<{ message: string }>} A promise that resolves to an object with a success message if the user is registered successfully.
   * @throws {Error} Throws an error if there is a problem registering the user.
   */
  async registerUser(
    username: string,
    password: string,
  ): Promise<{ message: string }> {
    try {
      const hash = await bcrypt.hash(password, 10);
      await this.userModel.create({ username, password: hash });
      return { message: 'User registered successfully' };
    } catch (error) {
      throw new Error('An error occurred while registering the user');
    }
  }

  /**
   * Asynchronously logs in a user by verifying the provided username and password.
   * If the user is found and the password matches, a JWT token is returned.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<string>} A promise that resolves to a JWT token if the login is successful.
   * @throws {NotFoundException} If the user is not found.
   * @throws {UnauthorizedException} If the login credentials are invalid or an error occurs during the login process.
   */
  async loginUser(username: string, password: string): Promise<string> {
    try {
      const user = await this.userModel.findOne({ username });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid login credentials');
      }
      const payload = { userId: user._id };
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('An error occurred while logging in');
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns A promise that resolves to an array of User objects.
   *
   * @throws Will throw an error if retrieving users from the database fails.
   */
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find({});
      return users;
    } catch (error) {
      this.logger.error(
        `An error occurred while retrieving users: ${error.message}`,
      );
      throw new Error('An error occurred while retrieving users');
    }
  }

  // create a new user, aka sign up
  // create(createUserDto: CreateUserDto) {
  //   const userToSave = new this.userModel(createUserDto);
  //   return userToSave.save();
  // }

  // // return an array of users
  // findAll() {
  //   return this.userModel.find().exec();
  // }

  // findOne(id: number) {
  //   return this.userModel.findById(id).exec();
  //   // return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
