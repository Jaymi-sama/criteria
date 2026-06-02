import { QueryNode, Schema, QueryRule } from '@/types/query';

export function generateSQL(node: QueryNode, schema: Schema): string {
  const predicate = buildSQLPredicate(node, schema);
  if (!predicate) return 'SELECT * FROM users;';
  return `SELECT * FROM users\nWHERE ${predicate};`;
}

function buildSQLPredicate(node: QueryNode, schema: Schema): string {
  if (node.type === 'rule') {
    const field = schema.find((f) => f.id === node.fieldId);
    if (!field) return '';

    const value = formatValue(node.value, field.type);
    const operator = getSQLOperator(node.operator);

    if (node.operator === 'is_null') return `${node.fieldId} IS NULL`;
    if (node.operator === 'is_not_null') return `${node.fieldId} IS NOT NULL`;
    if (node.operator === 'between' && Array.isArray(node.value) && node.value.length === 2) {
      const v1 = formatValue(node.value[0], field.type);
      const v2 = formatValue(node.value[1], field.type);
      return `${node.fieldId} BETWEEN ${v1} AND ${v2}`;
    }

    return `${node.fieldId} ${operator} ${value}`;
  }

  if (node.children.length === 0) return '';

  const childrenSql = node.children
    .map((child) => buildSQLPredicate(child, schema))
    .filter((sql) => sql !== '')
    .join(`\n  ${node.logicalOperator} `);

  return childrenSql ? `(${childrenSql})` : '';
}

export function generateMongo(node: QueryNode): Record<string, unknown> {
  if (node.type === 'rule') {
    const operator = getMongoOperator(node.operator);
    if (node.operator === 'equals') return { [node.fieldId]: node.value };
    if (node.operator === 'is_null') return { [node.fieldId]: null };
    if (node.operator === 'is_not_null') return { [node.fieldId]: { $ne: null } };
    if (node.operator === 'between' && Array.isArray(node.value) && node.value.length === 2) {
      return { [node.fieldId]: { $gte: node.value[0], $lte: node.value[1] } };
    }

    return { [node.fieldId]: { [operator]: node.value } };
  }

  if (node.children.length === 0) return {};

  const childrenMongo = node.children
    .map((child) => generateMongo(child))
    .filter((obj) => Object.keys(obj).length > 0);

  if (childrenMongo.length === 0) return {};

  const key = node.logicalOperator === 'AND' ? '$and' : '$or';
  return { [key]: childrenMongo };
}

function formatValue(value: QueryRule['value'], type: string): string {
  if (type === 'string' || type === 'date' || type === 'enum') {
    return `'${value}'`;
  }
  return String(value);
}
function getSQLOperator(op: string): string {
  switch (op) {
    case 'equals':
      return '=';
    case 'not_equals':
      return '!=';
    case 'contains':
      return 'LIKE';
    case 'greater_than':
      return '>';
    case 'less_than':
      return '<';
    case 'greater_than_equals':
      return '>=';
    case 'less_than_equals':
      return '<=';
    case 'regex':
      return '~';
    default:
      return '=';
  }
}

function getMongoOperator(op: string): string {
  switch (op) {
    case 'equals':
      return '$eq';
    case 'not_equals':
      return '$ne';
    case 'greater_than':
      return '$gt';
    case 'less_than':
      return '$lt';
    case 'greater_than_equals':
      return '$gte';
    case 'less_than_equals':
      return '$lte';
    case 'in':
      return '$in';
    case 'regex':
      return '$regex';
    default:
      return '$eq';
  }
}
