import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQueryStore } from '@/lib/store';
import { QueryRule } from '@/types/query';

// Mock localStorage for Vitest environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('useQueryStore', () => {
  beforeEach(() => {
    useQueryStore.getState().resetQuery();
  });

  it('should initialize with an empty root group', () => {
    const { rootGroup } = useQueryStore.getState();
    expect(rootGroup.type).toBe('group');
    expect(rootGroup.children).toHaveLength(0);
    expect(rootGroup.logicalOperator).toBe('AND');
  });

  it('should add a rule to the root group', () => {
    const { rootGroup, addRule } = useQueryStore.getState();
    addRule(rootGroup.id);

    const updatedRoot = useQueryStore.getState().rootGroup;
    expect(updatedRoot.children).toHaveLength(1);
    expect(updatedRoot.children[0].type).toBe('rule');
  });

  it('should add a nested group', () => {
    const { rootGroup, addGroup } = useQueryStore.getState();
    addGroup(rootGroup.id);

    const updatedRoot = useQueryStore.getState().rootGroup;
    expect(updatedRoot.children).toHaveLength(1);
    expect(updatedRoot.children[0].type).toBe('group');
  });

  it('should remove a node', () => {
    const { rootGroup, addRule, removeNode } = useQueryStore.getState();
    addRule(rootGroup.id);
    const ruleId = useQueryStore.getState().rootGroup.children[0].id;

    removeNode(ruleId);
    expect(useQueryStore.getState().rootGroup.children).toHaveLength(0);
  });

  it('should update a rule', () => {
    const { rootGroup, addRule, updateRule } = useQueryStore.getState();
    addRule(rootGroup.id);
    const ruleId = useQueryStore.getState().rootGroup.children[0].id;

    updateRule(ruleId, { value: 'test-value' });
    const rule = useQueryStore.getState().rootGroup.children[0] as QueryRule;
    expect(rule.value).toBe('test-value');
  });
});
