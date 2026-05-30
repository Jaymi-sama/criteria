import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQueryStore } from '@/lib/store';

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

describe('Validation Engine', () => {
  beforeEach(() => {
    useQueryStore.getState().resetQuery();
  });

  it('should fail validation for empty rules', () => {
    const { rootGroup, addRule, runQuery } = useQueryStore.getState();
    addRule(rootGroup.id);
    
    const success = runQuery();
    const errors = useQueryStore.getState().validationErrors;
    
    expect(success).toBe(false);
    expect(Object.keys(errors)).toHaveLength(1);
    expect(Object.values(errors)[0]).toBe('Value is required');
  });

  it('should fail validation for empty groups', () => {
    const { rootGroup, addGroup, runQuery } = useQueryStore.getState();
    addGroup(rootGroup.id);
    
    const success = runQuery();
    const errors = useQueryStore.getState().validationErrors;
    
    expect(success).toBe(false);
    // 1 error for the root group having 1 child that is empty, 
    // and 1 error for the nested group itself being empty.
    expect(Object.keys(errors)).toHaveLength(1); 
    expect(Object.values(errors)[0]).toBe('Group cannot be empty');
  });

  it('should fail for invalid numeric values', () => {
    const { rootGroup, addRule, updateRule, runQuery } = useQueryStore.getState();
    addRule(rootGroup.id);
    const ruleId = useQueryStore.getState().rootGroup.children[0].id;
    
    updateRule(ruleId, { fieldId: 'age', operator: 'greater_than', value: 'not-a-number' });
    
    const success = runQuery();
    const errors = useQueryStore.getState().validationErrors;
    
    expect(success).toBe(false);
    expect(errors[ruleId]).toBe('Must be a valid number');
  });

  it('should fail for invalid date values', () => {
    const { rootGroup, addRule, updateRule, runQuery } = useQueryStore.getState();
    addRule(rootGroup.id);
    const ruleId = useQueryStore.getState().rootGroup.children[0].id;
    
    updateRule(ruleId, { fieldId: 'createdAt', operator: 'equals', value: 'invalid-date' });
    
    const success = runQuery();
    const errors = useQueryStore.getState().validationErrors;
    
    expect(success).toBe(false);
    expect(errors[ruleId]).toBe('Must be a valid date');
  });

  it('should pass validation when all fields are correct', () => {
    const { rootGroup, addRule, updateRule, runQuery } = useQueryStore.getState();
    addRule(rootGroup.id);
    const ruleId = useQueryStore.getState().rootGroup.children[0].id;
    
    updateRule(ruleId, { fieldId: 'age', operator: 'greater_than', value: '25' });
    
    const success = runQuery();
    expect(success).toBe(true);
    expect(Object.keys(useQueryStore.getState().validationErrors)).toHaveLength(0);
  });
});
