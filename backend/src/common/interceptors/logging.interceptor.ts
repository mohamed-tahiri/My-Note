// common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    return next.handle().pipe(
      tap(() =>
        console.log(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `[${new Date().toISOString()}] Finished ${req.method} ${req.url}`,
        ),
      ),
    );
  }
}
