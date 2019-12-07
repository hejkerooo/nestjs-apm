import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ApmService } from './service/apm.service';
import {
  APM_OPTIONS,
  APM_INSTANCE,
  defaultApmOptions,
  APM_MIDDLEWARE,
} from './constants';
import { getInstance } from './apm.util';
import { ApmAsyncOptions, ApmOptions } from './interface';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { ApmUserContextInterceptor } from './service/apm-user-context.interceptor';
import { ApmErrorInterceptor } from './service/apm-error.interceptor';

const providers: Provider[] = [
  ApmService,
  ApmErrorInterceptor,
  {
    provide: APM_INSTANCE,
    useFactory: () => {
      return getInstance();
    },
  },
  {
    provide: ApmUserContextInterceptor,
    useFactory: (apmService: ApmService, apmOptions: ApmOptions) => {
      return new ApmUserContextInterceptor(
        apmService,
        apmOptions.httpUserMapFunction,
      );
    },
    inject: [ApmService, APM_OPTIONS],
  },
  {
    provide: APM_MIDDLEWARE,
    useFactory: (apmInstance: any) => {
      return apmInstance.middleware.connect();
    },
    inject: [APM_INSTANCE],
  },
];

@Global()
@Module({})
export class ApmModule {
  public static forRootAsync(options: ApmAsyncOptions = {}): DynamicModule {
    const asyncProviders: FactoryProvider = {
      provide: APM_OPTIONS,
      useFactory:
        options.useFactory ||
        (() => {
          return defaultApmOptions;
        }),
      inject: options.inject,
    };

    return {
      exports: [
        ApmService,
        APM_INSTANCE,
        APM_MIDDLEWARE,
        ApmUserContextInterceptor,
        APM_OPTIONS,
      ],
      module: ApmModule,
      providers: [asyncProviders, ...providers],
    };
  }
}
