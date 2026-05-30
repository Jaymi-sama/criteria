'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { QueryRule, Operator, FieldType } from '@/types/query';
import { Trash, DotsSixVertical } from '@phosphor-icons/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rule.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-surface border-border hover:border-accent/40 animate-in fade-in slide-in-from-left-2 flex flex-wrap items-center gap-4 rounded-xl border p-4 shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-text-secondary hover:text-text-primary flex cursor-grab items-center justify-center active:cursor-grabbing"
      >
        <DotsSixVertical size={20} weight="bold" />
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
          <span className="text-text-secondary pl-1 text-[10px] font-black tracking-widest uppercase">
            Field
          </span>
          <Select value={rule.fieldId} onValueChange={handleFieldChange}>
            <SelectTrigger className="bg-background border-border h-11 w-full font-bold">
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
        </div>

        <div className="flex min-w-[120px] flex-1 flex-col gap-1.5">
          <span className="text-text-secondary pl-1 text-[10px] font-black tracking-widest uppercase">
            Operator
          </span>
          <Select
            value={rule.operator}
            onValueChange={(value) => updateRule(rule.id, { operator: value as Operator })}
          >
            <SelectTrigger className="bg-background border-border h-11 w-full font-bold">
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
        </div>

        <div className="flex min-w-[180px] flex-[2] flex-col gap-1.5">
          <span className="text-text-secondary pl-1 text-[10px] font-black tracking-widest uppercase">
            Value
          </span>
          {currentField?.type === 'enum' ? (
            <Select
              value={rule.value as string}
              onValueChange={(value) => updateRule(rule.id, { value })}
            >
              <SelectTrigger className="bg-background border-border h-11 w-full font-bold">
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
              <SelectTrigger className="bg-background border-border h-11 w-full font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              className="bg-background border-border h-11 font-bold"
              type={currentField?.type === 'number' ? 'number' : 'text'}
              value={rule.value as string}
              onChange={(e) => updateRule(rule.id, { value: e.target.value })}
              placeholder="Enter value..."
            />
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-text-secondary hover:text-destructive hover:bg-destructive/10 mt-5 h-10 w-10"
        onClick={() => removeNode(rule.id)}
      >
        <Trash size={20} />
      </Button>
    </div>
  );
}
