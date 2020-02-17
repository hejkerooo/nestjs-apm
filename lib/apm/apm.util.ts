import * as APM from 'elastic-apm-node';

let instance: APM.Agent | undefined;

export const initializeAPMAgent = (config: APM.AgentConfigOptions): void => {
  instance = APM.start(config);
};

export const getInstance = (): APM.Agent => {
  if (!instance) {
    throw new Error('APM Agent is not initialized (run initializeAPMAgent) ');
  }

  return instance;
};
