import { ApmAsyncOptions } from '../../lib/apm/interface';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApmModule } from '../../lib/apm/apm.module';

export const createApp = async (
  options?: ApmAsyncOptions,
): Promise<INestApplication> => {
  const { initializeAPMAgent } = require('../../lib/apm/apm.util');

  initializeAPMAgent({});

  const module = await Test.createTestingModule({
    imports: [ApmModule.forRootAsync(options)],
    controllers: [],
  }).compile();

  const app = module.createNestApplication();
  await app.init();

  return app;
};
