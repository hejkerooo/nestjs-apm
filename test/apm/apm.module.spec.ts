jest.unmock('elastic-apm-node');

import * as APM from 'elastic-apm-node';

jest.mock('elastic-apm-node', () => ({
  start: jest.fn(() => {
    return {
      middleware: {
        connect: jest.fn(() => ({})),
      },
      captureError: jest.fn(),
      setUserContext: jest.fn(),
    };
  }),
}));

import { ApmUserContextInterceptor } from '../../lib/apm/service/apm-user-context.interceptor';
import {
  APM_INSTANCE,
  APM_MIDDLEWARE,
  APM_OPTIONS,
} from '../../lib/apm/constants';
import { createApp } from './test.util';

describe('apm.module', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('forRootAsync', () => {
    it('Should export APM_OPTIONS, APM_INSTANCE, APM_DEFAULT_INTERCEPTOR, APM_MIDDLEWARE, ApmUserContextInterceptor', async () => {
      const app = await createApp();

      expect(app.get(APM_OPTIONS)).toBeDefined();
      expect(app.get(APM_INSTANCE)).toBeDefined();
      expect(app.get(APM_MIDDLEWARE)).toBeDefined();
      expect(ApmUserContextInterceptor).toBeDefined();
    });
  });
});
