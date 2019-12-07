import { createParamDecorator } from '@nestjs/common';
import { getInstance } from './apm.util';

export const ApmCurrentTransaction = createParamDecorator((data, req) => {
  const apmInstance = getInstance();

  return apmInstance.currentTransaction;
});
