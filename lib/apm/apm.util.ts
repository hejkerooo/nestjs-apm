import * as APM from 'elastic-apm-node';

let instance: APM.Agent | undefined;

export const initializeAPMAgent = (config?: APM.AgentConfigOptions): void => {
  instance = config ? APM.start(config) : APM.start();
};

export const getInstance = (): APM.Agent => {
  if (!instance) {
    throw new Error('APM Agent is not initialized (run initializeAPMAgent) ');
  }

  return instance;
};
