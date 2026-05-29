'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { QueryGroup, LogicalOperator } from '@/types/query';
import { Plus, FolderPlus, Trash, CaretDown, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionRule } from './ConditionRule';
import { cn } from '@/lib/utils';

interface ConditionGroupProps {
  group: QueryGroup;
  depth?: number;
}

export function ConditionGroup({ group, depth = 0 }: ConditionGroupProps) {
  const { addRule, addGroup, removeNode, updateGroup, rootGroup } = useQueryStore();

  const isRoot = group.id === rootGroup.id;
  const isCollapsed = group.isCollapsed ?? false;

  const toggleCollapse = () => {
    updateGroup(group.id, { isCollapsed: !isCollapsed });
  };

  return (
    <div
      className={cn(
        'border-border bg-background/50 flex flex-col gap-2 rounded-lg border p-3 transition-all',
        depth > 0 && 'border-l-accent/30 ml-4 border-l-2'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary h-6 w-6"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <CaretRight size={14} /> : <CaretDown size={14} />}
          </Button>

          <Select
            value={group.logicalOperator}
            onValueChange={(value) =>
              updateGroup(group.id, { logicalOperator: value as LogicalOperator })
            }
          >
            <SelectTrigger className="bg-accent text-accent-foreground h-8 w-[80px] border-none text-[10px] font-bold tracking-wider uppercase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">And</SelectItem>
              <SelectItem value="OR">Or</SelectItem>
            </SelectContent>
          </Select>

          {!isRoot && (
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary hover:text-destructive h-8 w-8"
              onClick={() => removeNode(group.id)}
            >
              <Trash size={16} />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border h-8 gap-1 border-dashed text-[11px] font-medium"
            onClick={() => addRule(group.id)}
          >
            <Plus size={14} /> Add Rule
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border h-8 gap-1 border-dashed text-[11px] font-medium"
            onClick={() => addGroup(group.id)}
          >
            <FolderPlus size={14} /> Add Group
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-1 flex flex-col gap-3">
          {group.children.length === 0 ? (
            <p className="text-text-secondary px-9 py-2 text-[11px] italic">
              No rules or groups added yet.
            </p>
          ) : (
            group.children.map((child) =>
              child.type === 'rule' ? (
                <ConditionRule key={child.id} rule={child} />
              ) : (
                <ConditionGroup key={child.id} group={child} depth={depth + 1} />
              )
            )
          )}
        </div>
      )}
    </div>
  );
}
