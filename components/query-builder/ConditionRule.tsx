'use client';

import React, { memo, useCallback } from 'react';
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
import { cn } from '@/lib/utils';

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

export const ConditionRule = memo(({ rule }: ConditionRuleProps) => {
  const schema = useQueryStore((s) => s.schema);
  const updateRule = useQueryStore((s) => s.updateRule);
  const removeNode = useQueryStore((s) => s.removeNode);
  const validationErrors = useQueryStore((s) => s.validationErrors);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rule.id,
  });

  const error = validationErrors[rule.id];

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  const currentField = schema.find((f) => f.id === rule.fieldId);
  const operators = currentField ? OPERATORS_BY_TYPE[currentField.type] : [];

  const handleFieldChange = useCallback(
    (fieldId: string) => {
      const newField = schema.find((f) => f.id === fieldId);
      if (newField) {
        updateRule(rule.id, {
          fieldId,
          operator: OPERATORS_BY_TYPE[newField.type][0].value,
          value: newField.type === 'boolean' ? true : '',
        });
      }
    },
    [rule.id, schema, updateRule]
  );

  const handleOperatorChange = useCallback(
    (value: string) => {
      updateRule(rule.id, { operator: value as Operator });
    },
    [rule.id, updateRule]
  );

  const handleValueChange = useCallback(
    (value: string | number | boolean | string[] | number[]) => {
      updateRule(rule.id, { value });
    },
    [rule.id, updateRule]
  );

  const handleRemove = useCallback(() => {
    removeNode(rule.id);
  }, [rule.id, removeNode]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/rule bg-surface border-border hover:border-accent/40 animate-in fade-in slide-in-from-left-2 flex flex-col gap-4 rounded-xl border p-3 transition-all duration-200 sm:flex-row sm:items-center sm:p-4',
        error && 'border-destructive/50 bg-destructive/5'
      )}
    >
      <div className="flex items-center justify-between sm:justify-start sm:gap-2">
        <div
          {...attributes}
          {...listeners}
          className="text-text-secondary hover:text-text-primary flex cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <DotsSixVertical size={20} weight="bold" />
        </div>

        {/* Mobile Delete Button */}
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-text-secondary hover:text-destructive hover:bg-destructive/10 h-8 w-8 sm:hidden"
          onClick={handleRemove}
        >
          <Trash size={18} />
        </Button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <span className="text-text-secondary pl-1 text-[9px] font-black tracking-widest uppercase">
            Field
          </span>
          <Select value={rule.fieldId} onValueChange={handleFieldChange}>
            <SelectTrigger className="bg-background border-border text-text-primary h-9 w-full font-bold sm:h-10">
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

        <div className="flex flex-col gap-1.5 md:col-span-1">
          <span className="text-text-secondary pl-1 text-[9px] font-black tracking-widest uppercase">
            Operator
          </span>
          <Select value={rule.operator} onValueChange={handleOperatorChange}>
            <SelectTrigger className="bg-background border-border text-text-primary h-9 w-full font-bold sm:h-10">
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

        <div className="flex flex-col gap-1.5 xs:col-span-2 md:col-span-2">
          <div className="flex items-center justify-between pl-1">
            <span className="text-text-secondary text-[9px] font-black tracking-widest uppercase">
              Value
            </span>
            {error && (
              <span className="text-destructive animate-pulse text-[8px] font-bold uppercase">
                {error}
              </span>
            )}
          </div>
          {currentField?.type === 'enum' ? (
            <Select value={rule.value as string} onValueChange={handleValueChange}>
              <SelectTrigger
                className={cn(
                  'bg-background border-border text-text-primary h-9 w-full font-bold sm:h-10',
                  error && 'border-destructive'
                )}
              >
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
            <Select value={String(rule.value)} onValueChange={(val) => handleValueChange(val === 'true')}>
              <SelectTrigger className="bg-background border-border text-text-primary h-9 w-full font-bold sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              className={cn(
                'bg-background border-border text-text-primary h-9 font-bold sm:h-10',
                error && 'border-destructive focus-visible:ring-destructive/20'
              )}
              type={currentField?.type === 'number' ? 'number' : 'text'}
              value={rule.value as string}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Enter value..."
            />
          )}
        </div>
      </div>

      {/* Desktop Delete Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-text-secondary hover:text-destructive hover:bg-destructive/10 hidden h-10 w-10 sm:flex"
        onClick={handleRemove}
      >
        <Trash size={20} />
      </Button>
    </div>
  );
});

ConditionRule.displayName = 'ConditionRule';
