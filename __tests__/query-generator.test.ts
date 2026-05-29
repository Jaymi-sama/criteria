import { describe, it, expect } from 'vitest';
import { generateSQL, generateMongo } from '@/lib/query-generator';
import { QueryGroup, Schema } from '@/types/query';

describe('query-generator', () => {
  const schema: Schema = [
    { id: 'age', label: 'Age', type: 'number' },
    { id: 'status', label: 'Status', type: 'enum' },
  ];

  const mockQuery: QueryGroup = {
    id: 'root',
    type: 'group',
    logicalOperator: 'AND',
    children: [
      {
        id: 'r1',
        type: 'rule',
        fieldId: 'age',
        operator: 'greater_than',
        value: 18,
      },
      {
        id: 'g1',
        type: 'group',
        logicalOperator: 'OR',
        children: [
          {
            id: 'r2',
            type: 'rule',
            fieldId: 'status',
            operator: 'equals',
            value: 'active',
          },
          {
            id: 'r3',
            type: 'rule',
            fieldId: 'status',
            operator: 'equals',
            value: 'pending',
          },
        ],
      },
    ],
  };

  it('should generate correct SQL', () => {
    const sql = generateSQL(mockQuery, schema);
    expect(sql).toBe("(age > 18 AND (status = 'active' OR status = 'pending'))");
  });

  it('should generate correct Mongo query', () => {
    const mongo = generateMongo(mockQuery);
    expect(mongo).toEqual({
      $and: [
        { age: { $gt: 18 } },
        {
          $or: [{ status: 'active' }, { status: 'pending' }],
        },
      ],
    });
  });
});
