import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// import { secretKey } from './config';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructs a new instance of the class, initializing the JwtService.
   * @param jwtService - An instance of JwtService used for JSON Web Token operations.
   */
  constructor(private jwtService: JwtService) {}

  /**
   * Checks if a user is authorized to access a certain route based on the JWT token extracted from the request header.
   * If the token is valid, it attaches the payload to the request object and returns true.
   * If the token is not present or invalid, it throws an UnauthorizedException.
   *
   * @param {ExecutionContext} context - The execution context from which the HTTP request is extracted.
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the user is authorized, otherwise throws an UnauthorizedException.
   * @throws {UnauthorizedException} - Throws an exception if the JWT token is not present or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.secretKey,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  /**
   * Extracts the token from the request header.
   * If the authorization type is 'Bearer', it returns the token, otherwise it returns undefined.
   *
   * @param {Request} request - The request object from which the token is to be extracted.
   * @returns {string | undefined} The extracted token if the authorization type is 'Bearer', otherwise undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
