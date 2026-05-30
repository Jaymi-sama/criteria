'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { ConditionGroup } from './ConditionGroup';
import { Button } from '@/components/ui/button';
import { ArrowsCounterClockwise, Play } from '@phosphor-icons/react';
import { AdvancedInteractions } from './AdvancedInteractions';
import { ImportExportModal } from './ImportExportModal';

export function QueryBuilder() {
  const { rootGroup, resetQuery } = useQueryStore();

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Builder Toolbar */}
      <div className="bg-surface border-border flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <AdvancedInteractions />
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-text-primary h-10 gap-2 font-bold tracking-wider uppercase"
            onClick={resetQuery}
          >
            <ArrowsCounterClockwise size={18} /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <ImportExportModal />
          <Button
            variant="accent"
            size="sm"
            className="h-10 gap-2 px-6 font-black tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Play size={18} weight="fill" /> Run Query
          </Button>
        </div>
      </div>

      {/* Main Builder Canvas */}
      <div className="bg-surface/30 border-border min-h-[400px] rounded-2xl border p-6">
        <ConditionGroup group={rootGroup} />
      </div>
    </div>
  );
}
