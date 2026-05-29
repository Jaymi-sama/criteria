'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { QueryRule, Operator, FieldType } from '@/types/query';
import { Trash, DotsSixVertical } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const OPERATORS_BY_TYPE: Record<FieldType, { label: string; value: Operator }[]> = {
  string: [
    { label: 'Equals', value: 'equals' },
    { label: 'Not Equals', value: 'not_equals' },
    { label: 'Contains', value: 'contains' },
    { label: 'Starts With', value: 'starts_with' },
    { label: 'Ends With', value: 'ends_with' },
    { label: 'Is Null', value: 'is_null' },
    { label: 'Is Not Null', value: 'is_not_null' },
  ],
  number: [
    { label: '=', value: 'equals' },
    { label: '!=', value: 'not_equals' },
    { label: '>', value: 'greater_than' },
    { label: '<', value: 'less_than' },
    { label: '>=', value: 'greater_than_equals' },
    { label: '<=', value: 'less_than_equals' },
    { label: 'Between', value: 'between' },
  ],
  enum: [
    { label: 'Equals', value: 'equals' },
    { label: 'Not Equals', value: 'not_equals' },
    { label: 'In', value: 'in' },
  ],
  date: [
    { label: 'On', value: 'equals' },
    { label: 'Before', value: 'less_than' },
    { label: 'After', value: 'greater_than' },
    { label: 'Between', value: 'between' },
  ],
  boolean: [{ label: 'Is', value: 'equals' }],
};

interface ConditionRuleProps {
  rule: QueryRule;
}

export function ConditionRule({ rule }: ConditionRuleProps) {
  const { schema, updateRule, removeNode } = useQueryStore();

  const currentField = schema.find((f) => f.id === rule.fieldId);
  const operators = currentField ? OPERATORS_BY_TYPE[currentField.type] : [];

  const handleFieldChange = (fieldId: string) => {
    const newField = schema.find((f) => f.id === fieldId);
    if (newField) {
      updateRule(rule.id, {
        fieldId,
        operator: OPERATORS_BY_TYPE[newField.type][0].value,
        value: newField.type === 'boolean' ? true : '',
      });
    }
  };

  return (
    <div className="group bg-surface border-border hover:border-accent/50 flex items-center gap-2 rounded-md border px-3 py-2 shadow-sm transition-all">
      <div className="text-text-secondary hover:text-text-primary cursor-grab active:cursor-grabbing">
        <DotsSixVertical size={18} weight="bold" />
      </div>

      <Select value={rule.fieldId} onValueChange={handleFieldChange}>
        <SelectTrigger className="bg-background border-border h-9 w-[160px]">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {schema.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(value) => updateRule(rule.id, { operator: value as Operator })}
      >
        <SelectTrigger className="bg-background border-border h-9 w-[140px]">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="min-w-[120px] flex-1">
        {currentField?.type === 'enum' ? (
          <Select
            value={rule.value as string}
            onValueChange={(value) => updateRule(rule.id, { value })}
          >
            <SelectTrigger className="bg-background border-border h-9 w-full">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {currentField.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : currentField?.type === 'boolean' ? (
          <Select
            value={String(rule.value)}
            onValueChange={(value) => updateRule(rule.id, { value: value === 'true' })}
          >
            <SelectTrigger className="bg-background border-border h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            className="bg-background border-border h-9"
            type={currentField?.type === 'number' ? 'number' : 'text'}
            value={rule.value as string}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
            placeholder="Value..."
          />
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-text-secondary hover:text-destructive hover:bg-destructive/10 h-9 w-9"
        onClick={() => removeNode(rule.id)}
      >
        <Trash size={18} />
      </Button>
    </div>
  );
}
