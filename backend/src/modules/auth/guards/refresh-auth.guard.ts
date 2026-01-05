import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}
// This guard can be applied to routes or controllers to protect them using JWT refresh token authentication.
// It leverages the 'jwt-refresh' strategy defined in the AuthModule.
// Example usage:
// @UseGuards(RefreshAuthGuard)
// @Get('refresh')
// refreshToken() {
//   return "This is a protected resource that requires a valid refresh token";
// }
// Make sure to register the RefreshAuthGuard in the appropriate module providers if needed.
