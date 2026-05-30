'use client';

import React from 'react';
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

export function ConditionGroup({ group, depth = 0 }: ConditionGroupProps) {
  const { addRule, addGroup, removeNode, updateGroup, rootGroup, reorderChildren } =
    useQueryStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  const isRoot = group.id === rootGroup.id;
  const isCollapsed = group.isCollapsed ?? false;

  const toggleCollapse = () => {
    updateGroup(group.id, { isCollapsed: !isCollapsed });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderChildren(group.id, active.id as string, over.id as string);
    }
  };

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
        'group/container flex flex-col gap-4 transition-all',
        !isRoot && 'relative ml-6 pt-2 pl-8'
      )}
    >
      {/* Visual Indentation Line */}
      {!isRoot && (
        <div className="bg-border group-hover/container:bg-accent/40 absolute top-0 bottom-0 left-0 w-0.5 transition-colors" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isRoot && (
            <div
              {...attributes}
              {...listeners}
              className="text-text-secondary hover:text-text-primary flex cursor-grab items-center justify-center active:cursor-grabbing"
            >
              <DotsSixVertical size={20} weight="bold" />
            </div>
          )}
          <Button
            variant="secondary"
            size="icon-sm"
            className="text-text-secondary bg-background/50 border-border h-8 w-8 rounded-md border"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <CaretRight size={14} weight="bold" />
            ) : (
              <CaretDown size={14} weight="bold" />
            )}
          </Button>

          <Select
            value={group.logicalOperator}
            onValueChange={(value) =>
              updateGroup(group.id, { logicalOperator: value as LogicalOperator })
            }
          >
            <SelectTrigger className="bg-accent text-accent-foreground h-8 w-[90px] border-none text-[11px] font-black tracking-widest uppercase shadow-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND" className="text-[11px] font-bold tracking-widest uppercase">
                And
              </SelectItem>
              <SelectItem value="OR" className="text-[11px] font-bold tracking-widest uppercase">
                Or
              </SelectItem>
            </SelectContent>
          </Select>

          {!isRoot && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-text-secondary hover:text-destructive hover:bg-destructive/10 h-8 w-8"
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
            className="border-border bg-surface/50 hover:bg-accent/10 hover:border-accent/30 h-8 gap-2 text-[10px] font-bold tracking-wider uppercase"
            onClick={() => addRule(group.id)}
          >
            <Plus size={14} weight="bold" /> Add Rule
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border bg-surface/50 hover:bg-accent/10 hover:border-accent/30 h-8 gap-2 text-[10px] font-bold tracking-wider uppercase"
            onClick={() => addGroup(group.id)}
          >
            <FolderPlus size={14} weight="bold" /> Add Group
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={group.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {group.children.length === 0 ? (
                <div className="border-border bg-background/20 flex flex-col items-center justify-center rounded-xl border border-dashed p-8">
                  <p className="text-text-secondary text-[11px] font-bold tracking-[0.2em] uppercase opacity-50">
                    Empty Logical Group
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
}
