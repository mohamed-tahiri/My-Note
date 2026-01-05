import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// This guard can be applied to routes or controllers to protect them using JWT authentication.
// It leverages the 'jwt' strategy defined in the AuthModule.
// Example usage:
// @UseGuards(JwtAuthGuard)
// @Get('protected')
// getProtectedResource() {
//   return "This is a protected resource";
// }
// Make sure to register the JwtAuthGuard in the appropriate module providers if needed.
