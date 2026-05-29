import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { QueryGroup, QueryNode, QueryRule, Schema } from '@/types/query';
import { v4 as uuidv4 } from 'uuid';

interface QueryState {
  schema: Schema;
  rootGroup: QueryGroup;

  // Actions
  addRule: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeNode: (id: string) => void;
  updateRule: (id: string, updates: Partial<QueryRule>) => void;
  updateGroup: (id: string, updates: Partial<QueryGroup>) => void;
  setSchema: (schema: Schema) => void;
  resetQuery: () => void;
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

export const useQueryStore = create<QueryState>()(
  immer((set) => ({
    schema: initialSchema,
    rootGroup: createDefaultGroup(),

    setSchema: (schema) =>
      set((state) => {
        state.schema = schema;
      }),

    resetQuery: () =>
      set((state) => {
        state.rootGroup = createDefaultGroup();
      }),

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
        if (state.rootGroup.id === id) return; // Can't remove root
        removeNodeRecursive(state.rootGroup, id);
      }),

    updateRule: (id, updates) =>
      set((state) => {
        const node = findNode(state.rootGroup, id) as QueryRule;
        if (node && node.type === 'rule') {
          Object.assign(node, updates);
        }
      }),

    updateGroup: (id, updates) =>
      set((state) => {
        const node = findNode(state.rootGroup, id) as QueryGroup;
        if (node && node.type === 'group') {
          Object.assign(node, updates);
        }
      }),
  }))
);

// Helper functions for recursive traversal
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
