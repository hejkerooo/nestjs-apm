import { Inject, Injectable } from '@nestjs/common';
import { APM_INSTANCE } from '../constants';
import { ApmError, ApmFilter } from '../interface';

@Injectable()
export class ApmService {
  constructor(
    @Inject(APM_INSTANCE)
    protected readonly apmInstance: any,
  ) {}

  public startTransaction(name?: string, type?: string): any {
    return this.apmInstance.startTransaction(name, type);
  }

  public addFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.apmInstance.addFilter(filter);
    } else {
      this.apmInstance.addFilter(filter.filter);
    }
  }

  public addErrorFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.apmInstance.addErrorFilter(filter);
    } else {
      this.apmInstance.addErrorFilter(filter.filter);
    }
  }

  public addTransactionFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.apmInstance.addTransactionFilter(filter);
    } else {
      this.apmInstance.addTransactionFilter(filter.filter);
    }
  }

  public addSpanFilter(filter: ApmFilter): void {
    if (typeof filter === 'function') {
      this.apmInstance.addSpanFilter(filter);
    } else {
      this.apmInstance.addSpanFilter(filter.filter);
    }
  }

  public captureError(error: ApmError): void {
    this.apmInstance.captureError(error);
  }

  public flush(callback: (err: Error) => void): void {
    this.apmInstance.flush(callback);
  }

  public setUserContext(
    id?: string | number,
    email?: string,
    username?: string,
  ): void {
    this.apmInstance.setUserContext({
      id,
      email,
      username,
    });
  }
}
