import { describe, it, expect } from 'vitest';
import { generateSQL, generateMongo } from '@/lib/query-generator';
import { QueryGroup, Schema } from '@/types/query';

describe('query-generator', () => {
  const schema: Schema = [
    { id: 'name', label: 'Name', type: 'string' },
    { id: 'age', label: 'Age', type: 'number' },
    { id: 'status', label: 'Status', type: 'enum' },
  ];

  const mockQuery: QueryGroup = {
    id: 'root',
    type: 'group',
    logicalOperator: 'AND',
    children: [
      {
        id: '1',
        type: 'rule',
        fieldId: 'age',
        operator: 'greater_than',
        value: 18,
      },
      {
        id: '2',
        type: 'group',
        logicalOperator: 'OR',
        children: [
          {
            id: '3',
            type: 'rule',
            fieldId: 'status',
            operator: 'equals',
            value: 'active',
          },
          {
            id: '4',
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
    expect(sql).toContain('SELECT * FROM users');
    expect(sql).toContain('WHERE (age > 18');
    expect(sql).toContain('AND (status = \'active\'');
    expect(sql).toContain('OR status = \'pending\'))');
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

  it('should support Mongo string operators and arrays', () => {
    const stringQuery: QueryGroup = {
      id: 'root',
      type: 'group',
      logicalOperator: 'AND',
      children: [
        { id: '1', type: 'rule', fieldId: 'name', operator: 'contains', value: 'alice' },
        { id: '2', type: 'rule', fieldId: 'status', operator: 'in', value: 'active, pending' }
      ]
    };
    
    const mongo = generateMongo(stringQuery);
    expect(mongo).toEqual({
      $and: [
        { name: { $regex: 'alice', $options: 'i' } },
        { status: { $in: ['active', 'pending'] } }
      ]
    });
  });

  it('should support regex operator', () => {
    const regexQuery: QueryGroup = {
      id: 'root',
      type: 'group',
      logicalOperator: 'AND',
      children: [
        { id: '1', type: 'rule', fieldId: 'name', operator: 'regex', value: '^ali' }
      ]
    };
    
    const sql = generateSQL(regexQuery, schema);
    expect(sql).toContain("name ~ '^ali'");
    
    const mongo = generateMongo(regexQuery);
    expect(mongo).toEqual({ name: { $regex: '^ali', $options: 'i' } });
  });
});
