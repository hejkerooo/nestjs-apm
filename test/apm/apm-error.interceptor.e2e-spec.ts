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
import { ApmErrorInterceptor } from '../../lib/apm/service/apm-error.interceptor';

@Controller()
class TestController {
  @Get('/')
  public get() {
    throw Error();
  }
}

describe('ApmErrorInterceptor', () => {
  let app: INestApplication;
  let apmInstance: any;
  let apmService: ApmService;

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
        imports: [ApmModule.forRootAsync()],
        controllers: [TestController],
        providers: [
          {
            provide: APP_INTERCEPTOR,
            useValue: new ApmErrorInterceptor(new ApmService(apmInstance)),
          },
        ],
      }).compile();

      apmService = module.get(ApmService);

      app = module.createNestApplication();
      await app.init();
    });

    it('Test if captureError was called', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(() => {
          expect(apmInstance.captureError).toBeCalledTimes(1);
        });
    });
  });
});
