import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/Login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginAuthDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.id, user.email);

    await this.usersService.update(user.id, { lastLogin: new Date() });
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    this.setRefreshCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  async refresh(userId: number, refreshToken: string, res: Response) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    this.setRefreshCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  async logout(userId: number, res: Response) {
    await this.usersService.update(userId, {
      refreshToken: null,
    });
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET as string,
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET as string,
      expiresIn: `7d`,
    });

    return { access_token, refresh_token };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashed,
    });
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
