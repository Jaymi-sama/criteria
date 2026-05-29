export type FieldType = 'string' | 'number' | 'enum' | 'date' | 'boolean';

export type Operator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_equals'
  | 'less_than_equals'
  | 'in'
  | 'not_in'
  | 'between'
  | 'is_null'
  | 'is_not_null'
  | 'regex';

export interface FieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[]; // For enums
}

export type Schema = FieldDefinition[];

export type LogicalOperator = 'AND' | 'OR';

export interface QueryRule {
  id: string;
  type: 'rule';
  fieldId: string;
  operator: Operator;
  value: string | number | boolean | string[] | number[];
}

export interface QueryGroup {
  id: string;
  type: 'group';
  logicalOperator: LogicalOperator;
  children: (QueryRule | QueryGroup)[];
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}

export type QueryNode = QueryRule | QueryGroup;

export interface QueryResult {
  data: Record<string, unknown>[];
  total: number;
  executionTime: number;
}
