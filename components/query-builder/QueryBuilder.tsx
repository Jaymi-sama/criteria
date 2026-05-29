'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { ConditionGroup } from './ConditionGroup';
import { Button } from '@/components/ui/button';
import { ArrowsCounterClockwise, Play, FileCode } from '@phosphor-icons/react';
import { AdvancedInteractions } from './AdvancedInteractions';

export function QueryBuilder() {
  const { rootGroup, resetQuery } = useQueryStore();

  return (
    <div className="bg-surface border-border mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-xl border p-6 shadow-xl">
      <div className="border-border flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-primary text-xl font-bold tracking-tight">Query Editor</h2>
          <p className="text-text-secondary text-xs font-medium">
            Build complex filters with nested logic
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdvancedInteractions />
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary h-9 gap-2"
            onClick={resetQuery}
          >
            <ArrowsCounterClockwise size={18} /> Reset
          </Button>
          <Button variant="secondary" size="sm" className="h-9 gap-2">
            <FileCode size={18} /> Preview
          </Button>
          <Button variant="accent" size="sm" className="h-9 gap-2 font-bold">
            <Play size={18} weight="fill" /> Run Query
          </Button>
        </div>
      </div>

      <div className="min-h-[300px] overflow-x-auto">
        <ConditionGroup group={rootGroup} />
      </div>
    </div>
  );
}
