jest.unmock('elastic-apm-node');

import * as APM from 'elastic-apm-node';

jest.mock('elastic-apm-node', () => ({
  start: jest.fn(() => {
    return {};
  }),
}));

describe('apm.util', () => {
  afterEach(() => {
    jest.resetModules();
  });

  describe('initializeAPMAgent', () => {
    it('should initialize connection', () => {
      const { initializeAPMAgent } = require('../../lib/apm/apm.util');

      initializeAPMAgent({});

      expect(APM.start).toBeCalledTimes(1);
    });
  });

  describe('getInstance', () => {
    it('should return agent', () => {
      const {
        initializeAPMAgent,
        getInstance,
      } = require('../../lib/apm/apm.util');

      initializeAPMAgent({});

      expect(getInstance()).toBeDefined();
      expect(APM.start).toBeCalledTimes(1);
    });

    it('should throw error, agent is not initialized', () => {
      const { getInstance } = require('../../lib/apm/apm.util');

      expect(() => {
        getInstance();
      }).toThrow();
    });
  });
});
