import { QueryNode, QueryRule } from '@/types/query';

export function executeQuery(
  data: Record<string, unknown>[],
  node: QueryNode
): Record<string, unknown>[] {
  if (data.length === 0) return [];

  return data.filter((item) => evaluateNode(item, node));
}

function evaluateNode(item: Record<string, unknown>, node: QueryNode): boolean {
  if (node.type === 'rule') {
    return evaluateRule(item, node);
  }

  if (node.children.length === 0) {
    return true; // Empty groups don't filter out data by default
  }

  if (node.logicalOperator === 'AND') {
    return node.children.every((child) => evaluateNode(item, child));
  } else {
    return node.children.some((child) => evaluateNode(item, child));
  }
}

function evaluateRule(item: Record<string, unknown>, rule: QueryRule): boolean {
  const value = item[rule.fieldId];
  const target = rule.value;

  switch (rule.operator) {
    case 'equals':
      return String(value).toLowerCase() === String(target).toLowerCase();
    case 'not_equals':
      return String(value).toLowerCase() !== String(target).toLowerCase();
    case 'contains':
      return String(value).toLowerCase().includes(String(target).toLowerCase());
    case 'not_contains':
      return !String(value).toLowerCase().includes(String(target).toLowerCase());
    case 'starts_with':
      return String(value).toLowerCase().startsWith(String(target).toLowerCase());
    case 'ends_with':
      return String(value).toLowerCase().endsWith(String(target).toLowerCase());
    case 'greater_than':
      return Number(value) > Number(target);
    case 'less_than':
      return Number(value) < Number(target);
    case 'greater_than_equals':
      return Number(value) >= Number(target);
    case 'less_than_equals':
      return Number(value) <= Number(target);
    case 'is_null':
      return value === null || value === undefined || value === '';
    case 'is_not_null':
      return value !== null && value !== undefined && value !== '';
    case 'in': {
      const array = String(target)
        .split(',')
        .map((s) => s.trim().toLowerCase());
      return array.includes(String(value).toLowerCase());
    }
    case 'regex':
      try {
        const re = new RegExp(String(target), 'i');
        return re.test(String(value));
      } catch {
        return false;
      }
    default:
      return true;
  }
}
