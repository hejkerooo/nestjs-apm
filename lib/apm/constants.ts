import { ApmOptions } from './interface';

export const APM_INSTANCE = Symbol('APM_INSTANCE');
export const APM_OPTIONS = Symbol('APM_OPTIONS');
export const APM_MIDDLEWARE = Symbol('APM_MIDDLEWARE');

export const defaultApmOptions: ApmOptions = {
  httpUserMapFunction: undefined,
};
