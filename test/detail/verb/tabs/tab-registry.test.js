import { describe, it, expect } from 'vitest';
import { TABS } from '@detail/verb/tabs/tab-registry.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

describe('Tab Registry', () => {
  it('should have correct tab configurations', () => {
    expect(TABS[TAB_KEY.ACTIVE]).toBeDefined();
    expect(TABS[TAB_KEY.PASSIVE]).toBeDefined();
    expect(TABS[TAB_KEY.PARTICIPLE]).toBeDefined();
  });

  it('should have render functions for each tab', () => {
    for (const tab of Object.values(TABS)) {
      expect(typeof tab.render).toBe('function');
      expect(typeof tab.dataSource).toBe('string');
    }
  });

  it('should use correct data sources', () => {
    expect(TABS[TAB_KEY.ACTIVE].dataSource).toBe('conjugations');
    expect(TABS[TAB_KEY.PASSIVE].dataSource).toBe('conjugations');
    expect(TABS[TAB_KEY.PARTICIPLE].dataSource).toBe('participles');
  });
});