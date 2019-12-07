import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ApmService } from './service/apm.service';
import { Observable } from 'rxjs';

export abstract class ApmInterceptorConstructor implements NestInterceptor {
  protected constructor(
    protected readonly apmService: ApmService,
    protected readonly mapFunction?: (request: any) => UserContextKeys,
  ) {}

  public abstract intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>>;
}

export interface UserContextKeys {
  id?: string | number;
  username?: string;
  email?: string;
}

export type ApmFunctionFilter<T = any> = (payload: T) => void;

export interface ApmClassFilter<T = any> {
  filter: ApmFunctionFilter<T>;
}

export type ApmFilter<T = any> = ApmClassFilter<T> | ApmFunctionFilter<T>;

export type ApmError = string | Error | { message: string; params: any[] };

export interface ApmOptions {
  httpUserMapFunction?: (request: any) => UserContextKeys;
}

export interface ApmAsyncOptions {
  useFactory?: (...args: any[]) => Promise<ApmOptions> | ApmOptions;
  inject?: any;
}
