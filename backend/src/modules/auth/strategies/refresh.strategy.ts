import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const token = req?.cookies?.refresh_token;
        if (!token) throw new UnauthorizedException('Refresh token missing');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return token;
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'default_secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // On récupère le token brut pour pouvoir le comparer au hash en BDD plus tard
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies?.refresh_token;
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      id: payload.sub,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: payload.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refreshToken,
    };
  }
}
