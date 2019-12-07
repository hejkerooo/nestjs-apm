import {
  CallHandler,
  NestInterceptor,
} from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { ApmService } from './apm.service';
import { catchError } from 'rxjs/operators';
@Injectable()
export class ApmErrorInterceptor implements NestInterceptor {
  constructor(protected readonly apmService: ApmService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        this.apmService.captureError(err);

        return throwError(err);
      }),
    );
  }
}
