import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApmService } from './apm.service';
import { ApmInterceptorConstructor, UserContextKeys } from '../interface';

@Injectable()
export class ApmHttpUserContextInterceptor extends ApmInterceptorConstructor {
  constructor(
    protected readonly apmService: ApmService,
    protected readonly mapFunction?: (request: any) => UserContextKeys,
  ) {
    super(apmService);
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const httpArgumentsHost = context.switchToHttp();
    const request = httpArgumentsHost.getRequest();

    if (this.mapFunction) {
      const { email, id, username } = this.mapFunction(request);

      this.apmService.setUserContext(id, email, username);
    }

    return next.handle();
  }
}
