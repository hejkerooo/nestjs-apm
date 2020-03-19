import { ApmService } from '../../lib/apm/service/apm.service';

jest.unmock('elastic-apm-node');

import * as APM from 'elastic-apm-node';

jest.mock('elastic-apm-node', () => ({
  start: jest.fn(() => {
    return {
      middleware: {
        connect: jest.fn(),
      },
      captureError: jest.fn(),
      setUserContext: jest.fn(),
    };
  }),
}));

import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApmModule } from '../../lib/apm/apm.module';
import { ApmHttpUserContextInterceptor } from '../../lib/apm/service/apm-http-user-context-interceptor.service';

@Controller()
class TestController {
  @Get('/')
  public get() {
    return {
      test: 1,
    };
  }
}

describe('ApmHttpInterceptor', () => {
  let app: INestApplication;
  let apmInstance: any;
  let apmService: ApmService;
  let spiedSetUserContext: any;

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('intercept', () => {
    beforeEach(async () => {
      const {
        initializeAPMAgent,
        getInstance,
      } = require('../../lib/apm/apm.util');

      initializeAPMAgent({});
      apmInstance = getInstance();

      const module = await Test.createTestingModule({
        imports: [
          ApmModule.forRootAsync({
            useFactory: () => {
              return {
                httpUserMapFunction: () => {
                  return {
                    id: 1,
                    username: 'test',
                    email: 'test',
                  };
                },
              };
            },
          }),
        ],
        controllers: [TestController],
        providers: [
          {
            provide: APP_INTERCEPTOR,
            useExisting: ApmHttpUserContextInterceptor,
          },
        ],
      }).compile();

      apmService = module.get(ApmService);

      spiedSetUserContext = jest.spyOn(apmService, 'setUserContext');

      app = module.createNestApplication();
      await app.init();
    });

    it('Test if user context was applied', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(() => {
          expect(APM.start).toBeCalledTimes(1);
          expect(apmInstance.setUserContext).toBeCalledTimes(1);
          expect(spiedSetUserContext).toBeCalledTimes(1);
          expect(spiedSetUserContext).toBeCalledWith(1, 'test', 'test');
        });
    });
  });
});
