import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { QueryGroup, QueryNode, QueryRule, Schema } from '@/types/query';
import { v4 as uuidv4 } from 'uuid';

interface QueryState {
  schema: Schema;
  rootGroup: QueryGroup;
  appliedRootGroup: QueryGroup;
  presets: QueryPreset[];
  history: QueryHistoryItem[];
  validationErrors: Record<string, string>;

  // Actions
  addRule: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeNode: (id: string) => void;
  updateRule: (id: string, updates: Partial<QueryRule>) => void;
  updateGroup: (id: string, updates: Partial<QueryGroup>) => void;
  reorderChildren: (parentId: string, activeId: string, overId: string) => void;
  importQuery: (newGroup: QueryGroup) => void;
  runQuery: () => boolean; // Returns success
  setSchema: (schema: Schema) => void;
  resetQuery: () => void;
  
  // Preset & History Actions
  savePreset: (name: string, description: string) => void;
  deletePreset: (id: string) => void;
  clearHistory: () => void;
  restoreQuery: (rootGroup: QueryGroup) => void;
}

interface QueryPreset {
  id: string;
  name: string;
  description: string;
  rootGroup: QueryGroup;
}

interface QueryHistoryItem {
  id: string;
  name: string;
  time: string;
  query: string;
  rootGroup: QueryGroup;
}

const createDefaultRule = (fieldId: string): QueryRule => ({
  id: uuidv4(),
  type: 'rule',
  fieldId,
  operator: 'equals',
  value: '',
});

const createDefaultGroup = (): QueryGroup => ({
  id: uuidv4(),
  type: 'group',
  logicalOperator: 'AND',
  children: [],
});

const initialSchema: Schema = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  {
    id: 'status',
    label: 'Status',
    type: 'enum',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  { id: 'createdAt', label: 'Created At', type: 'date' },
  { id: 'isVerified', label: 'Verified', type: 'boolean' },
];

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useQueryStore = create<QueryState>()(
  persist(
    immer((set, get) => ({
      schema: initialSchema,
      rootGroup: createDefaultGroup(),
      appliedRootGroup: createDefaultGroup(),
      presets: [],
      history: [],
      validationErrors: {},

      setSchema: (schema) =>
        set((state) => {
          state.schema = schema;
        }),

      resetQuery: () =>
        set((state) => {
          const fresh = createDefaultGroup();
          state.rootGroup = fresh;
          state.appliedRootGroup = fresh;
          state.validationErrors = {};
        }),

      runQuery: () => {
        const state = get();
        const errors: Record<string, string> = {};
        
        // Validate recursive tree
        validateNode(state.rootGroup, errors);
        
        set((s) => {
          s.validationErrors = errors;
        });

        if (Object.keys(errors).length > 0) {
          return false;
        }

        set((s) => {
          const currentQuery = JSON.parse(JSON.stringify(s.rootGroup));
          s.appliedRootGroup = currentQuery;
          
          const historyItem: QueryHistoryItem = {
            id: uuidv4(),
            name: `Execution ${s.history.length + 1}`,
            time: new Date().toLocaleTimeString(),
            query: generateSimplifiedPreview(currentQuery),
            rootGroup: currentQuery,
          };
          
          s.history.unshift(historyItem);
          if (s.history.length > 10) s.history.pop();
        });
        
        return true;
      },

      addRule: (parentId) =>
        set((state) => {
          const parent = findNode(state.rootGroup, parentId) as QueryGroup;
          if (parent && parent.type === 'group') {
            parent.children.push(createDefaultRule(state.schema[0].id));
          }
        }),

      addGroup: (parentId) =>
        set((state) => {
          const parent = findNode(state.rootGroup, parentId) as QueryGroup;
          if (parent && parent.type === 'group') {
            parent.children.push(createDefaultGroup());
          }
        }),

      removeNode: (id) =>
        set((state) => {
          if (state.rootGroup.id === id) return;
          removeNodeRecursive(state.rootGroup, id);
          delete state.validationErrors[id];
        }),

      updateRule: (id, updates) =>
        set((state) => {
          const node = findNode(state.rootGroup, id) as QueryRule;
          if (node && node.type === 'rule') {
            Object.assign(node, updates);
            // Clear error when updated
            delete state.validationErrors[id];
          }
        }),

      updateGroup: (id, updates) =>
        set((state) => {
          const node = findNode(state.rootGroup, id) as QueryGroup;
          if (node && node.type === 'group') {
            Object.assign(node, updates);
            delete state.validationErrors[id];
          }
        }),

      reorderChildren: (parentId, activeId, overId) =>
        set((state) => {
          const parent = findNode(state.rootGroup, parentId) as QueryGroup;
          if (parent && parent.type === 'group') {
            const oldIndex = parent.children.findIndex((c) => c.id === activeId);
            const newIndex = parent.children.findIndex((c) => c.id === overId);
            if (oldIndex !== -1 && newIndex !== -1) {
              const [moved] = parent.children.splice(oldIndex, 1);
              parent.children.splice(newIndex, 0, moved);
            }
          }
        }),

      importQuery: (newGroup) => {
        const normalized = normalizeQueryNode(newGroup) as QueryGroup;
        set({ rootGroup: normalized, appliedRootGroup: normalized, validationErrors: {} });
      },

      savePreset: (name, description) =>
        set((state) => {
          state.presets.push({
            id: uuidv4(),
            name,
            description,
            rootGroup: JSON.parse(JSON.stringify(state.rootGroup)),
          });
        }),

      deletePreset: (id) =>
        set((state) => {
          state.presets = state.presets.filter((p) => p.id !== id);
        }),

      clearHistory: () =>
        set((state) => {
          state.history = [];
        }),

      restoreQuery: (rootGroup) =>
        set((state) => {
          const normalized = normalizeQueryNode(rootGroup) as QueryGroup;
          state.rootGroup = normalized;
          state.appliedRootGroup = normalized;
          state.validationErrors = {};
        }),
    })),
    {
      name: 'criteria-query-storage',
      storage: createJSONStorage(() => (typeof localStorage !== 'undefined' ? localStorage : noopStorage)),
    }
  )
);

function validateNode(node: QueryNode, errors: Record<string, string>) {
  if (node.type === 'rule') {
    if (node.value === undefined || node.value === '' || node.value === null) {
      if (node.operator !== 'is_null' && node.operator !== 'is_not_null') {
        errors[node.id] = 'Value is required';
      }
    }
  } else {
    if (node.children.length === 0) {
      errors[node.id] = 'Group cannot be empty';
    }
    node.children.forEach(child => validateNode(child, errors));
  }
}

function generateSimplifiedPreview(node: QueryNode): string {
  if (node.type === 'rule') {
    return `${node.fieldId} ${node.operator} ${node.value}`;
  }
  if (node.children.length === 0) return '(empty)';
  return `(${node.children.map(c => generateSimplifiedPreview(c)).join(` ${node.logicalOperator} `)})`;
}

function normalizeQueryNode(node: unknown): QueryNode {
  if (!node || typeof node !== 'object') {
    return createDefaultGroup();
  }

  const data = node as Record<string, unknown>;
  const id = (data.id as string) || uuidv4();

  if (data.fieldId || data.type === 'rule') {
    return {
      id,
      type: 'rule',
      fieldId: (data.fieldId as string) || 'name',
      operator: (data.operator as QueryRule['operator']) || 'equals',
      value: (data.value as QueryRule['value']) ?? '',
    };
  }

  const children = Array.isArray(data.children)
    ? data.children.map((child: unknown) => normalizeQueryNode(child))
    : [];

  return {
    id,
    type: 'group',
    logicalOperator: (data.logicalOperator as QueryGroup['logicalOperator']) || 'AND',
    children,
    isCollapsed: !!data.isCollapsed,
  };
}

function findNode(node: QueryNode, id: string): QueryNode | undefined {
  if (node.id === id) return node;
  if (node.type === 'group') {
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return undefined;
}

function removeNodeRecursive(parent: QueryGroup, id: string): boolean {
  const index = parent.children.findIndex((child) => child.id === id);
  if (index !== -1) {
    parent.children.splice(index, 1);
    return true;
  }
  for (const child of parent.children) {
    if (child.type === 'group') {
      if (removeNodeRecursive(child, id)) return true;
    }
  }
  return false;
}
