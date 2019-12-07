import * as APM from 'elastic-apm-node';

let instance: any | undefined;

export const initializeAPMAgent = (config: object): void => {
  instance = APM.start(config);
};

export const getInstance = () => {
  if (!instance) {
    throw new Error('APM Agent is not initialized (run initializeAPMAgent) ');
  }

  return instance;
};
