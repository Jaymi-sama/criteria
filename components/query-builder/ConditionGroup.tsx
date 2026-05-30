'use client';

import React, { memo, useCallback } from 'react';
import { useQueryStore } from '@/lib/store';
import { QueryGroup, LogicalOperator } from '@/types/query';
import {
  Plus,
  FolderPlus,
  Trash,
  CaretDown,
  CaretRight,
  DotsSixVertical,
} from '@phosphor-icons/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

export const ConditionGroup = memo(({ group, depth = 0 }: ConditionGroupProps) => {
  const addRule = useQueryStore((s) => s.addRule);
  const addGroup = useQueryStore((s) => s.addGroup);
  const removeNode = useQueryStore((s) => s.removeNode);
  const updateGroup = useQueryStore((s) => s.updateGroup);
  const rootGroupId = useQueryStore((s) => s.rootGroup.id);
  const reorderChildren = useQueryStore((s) => s.reorderChildren);
  const validationErrors = useQueryStore((s) => s.validationErrors);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });

  const error = validationErrors[group.id];

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  const isRoot = group.id === rootGroupId;
  const isCollapsed = group.isCollapsed ?? false;

  const toggleCollapse = useCallback(() => {
    updateGroup(group.id, { isCollapsed: !isCollapsed });
  }, [group.id, isCollapsed, updateGroup]);

  const handleLogicalOperatorChange = useCallback(
    (value: string) => {
      updateGroup(group.id, { logicalOperator: value as LogicalOperator });
    },
    [group.id, updateGroup]
  );

  const handleAddRule = useCallback(() => {
    addRule(group.id);
  }, [group.id, addRule]);

  const handleAddGroup = useCallback(() => {
    addGroup(group.id);
  }, [group.id, addGroup]);

  const handleRemove = useCallback(() => {
    removeNode(group.id);
  }, [group.id, removeNode]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        reorderChildren(group.id, active.id as string, over.id as string);
      }
    },
    [group.id, reorderChildren]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/container flex flex-col gap-3 sm:gap-4 transition-all',
        !isRoot && 'relative ml-3 pt-1 pl-4 sm:ml-6 sm:pl-8 sm:pt-2',
        error && 'border-destructive/30 bg-destructive/5 rounded-2xl border p-2'
      )}
    >
      {/* Visual Indentation Line */}
      {!isRoot && (
        <div className="bg-border group-hover/container:bg-accent/40 absolute top-0 bottom-0 left-0 w-0.5 transition-colors" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-3">
          {!isRoot && (
            <div
              {...attributes}
              {...listeners}
              className="text-text-secondary hover:text-text-primary flex cursor-grab items-center justify-center active:cursor-grabbing"
            >
              <DotsSixVertical size={16} weight="bold" className="sm:size-5" />
            </div>
          )}
          <Button
            variant="secondary"
            size="icon-xs"
            className="text-text-secondary bg-background/50 border-border h-7 w-7 rounded-md border sm:h-8 sm:w-8"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <CaretRight size={12} weight="bold" className="sm:size-3.5" />
            ) : (
              <CaretDown size={12} weight="bold" className="sm:size-3.5" />
            )}
          </Button>

          <Select value={group.logicalOperator} onValueChange={handleLogicalOperatorChange}>
            <SelectTrigger className="bg-accent text-white h-7 w-[65px] sm:h-8 sm:w-[90px] border-none text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND" className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                And
              </SelectItem>
              <SelectItem value="OR" className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                Or
              </SelectItem>
            </SelectContent>
          </Select>

          {!isRoot && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-text-secondary hover:text-destructive hover:bg-destructive/10 h-7 w-7 sm:h-8 sm:w-8"
              onClick={handleRemove}
            >
              <Trash size={14} className="sm:size-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="xs"
            className="border-border bg-surface/50 hover:bg-accent/10 hover:border-accent/30 h-7 gap-1 px-1.5 text-[8px] font-bold uppercase tracking-wider sm:h-8 sm:gap-2 sm:px-3 sm:text-[10px]"
            onClick={handleAddRule}
          >
            <Plus size={10} weight="bold" className="sm:size-3.5" /> <span className="hidden xs:inline">Add Rule</span>
          </Button>
          <Button
            variant="outline"
            size="xs"
            className="border-border bg-surface/50 hover:bg-accent/10 hover:border-accent/30 h-7 gap-1 px-1.5 text-[8px] font-bold uppercase tracking-wider sm:h-8 sm:gap-2 sm:px-3 sm:text-[10px]"
            onClick={handleAddGroup}
          >
            <FolderPlus size={10} weight="bold" className="sm:size-3.5" /> <span className="hidden xs:inline">Add Group</span>
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={group.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {group.children.length === 0 ? (
                <div
                  className={cn(
                    'border-border bg-background/20 flex flex-col items-center justify-center rounded-xl border border-dashed p-6 sm:p-8',
                    error && 'border-destructive/50 bg-destructive/10'
                  )}
                >
                  <p
                    className={cn(
                      'text-text-secondary text-[10px] sm:text-[11px] font-bold opacity-50 uppercase tracking-[0.2em]',
                      error && 'text-destructive opacity-100 animate-pulse'
                    )}
                  >
                    {error || 'Empty Logical Group'}
                  </p>
                </div>
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
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
});

ConditionGroup.displayName = 'ConditionGroup';
