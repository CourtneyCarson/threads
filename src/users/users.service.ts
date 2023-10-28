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

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface AuthResponse {
  user?: User;
  token: string;
  message: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async registerUser(
    name: string,
    username: string,
    password: string,
  ): Promise<RegisterResponse> {
    try {
      const hash = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({ name, username, password: hash });
      const user = await newUser.save();

      const response: RegisterResponse = {
        message: 'User registered successfully',
        user,
      };

      return response;
    } catch (error) {
      throw new Error('An error occurred while registering the user');
    }
  }

  async loginUser(username: string, password: string): Promise<AuthResponse> {
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

      const authResponse: AuthResponse = {
        user,

        token,
        message: 'User logged in successfully',
      };

      return authResponse;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('An error occurred while logging in');
    }
  }

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
}
