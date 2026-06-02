'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { ConditionGroup } from './ConditionGroup';
import { Button } from '@/components/ui/button';
import { ArrowsCounterClockwise, Play } from '@phosphor-icons/react';
import { AdvancedInteractions } from './AdvancedInteractions';
import { ImportExportModal } from './ImportExportModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function QueryBuilder() {
  const rootGroup = useQueryStore((s) => s.rootGroup);
  const resetQuery = useQueryStore((s) => s.resetQuery);
  const runQuery = useQueryStore((s) => s.runQuery);
  const validationErrors = useQueryStore((s) => s.validationErrors);
  
  useKeyboardShortcuts();

  const handleRunQuery = () => {
<<<<<<< HEAD
    const success = runQuery();
    if (!success) {
      toast.error('Validation Error', {
        description: 'Please fix the highlighted errors before running the query.'
      });
    } else {
      toast.success('Query executed successfully');
    }
=======
    runQuery();
>>>>>>> d4ce9b591296fad00a17affe38b0f431fd649595
  };

  const handleReset = () => {
    resetQuery();
    toast.info('Workspace reset');
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Builder Toolbar - Perfectly Aligned Grid for Mobile */}
      <div className="bg-surface border-border grid grid-cols-2 gap-2 rounded-2xl border p-2 shadow-sm sm:flex sm:items-center sm:justify-between sm:p-4 sm:gap-4">
        {/* Left Side Group (Secondary) */}
        <div className="contents sm:flex sm:items-center sm:gap-2">
          <div className="col-span-1">
            <AdvancedInteractions />
          </div>
          <div className="col-span-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-text-primary h-10 w-full gap-2 border border-transparent font-bold uppercase tracking-wider text-[10px] hover:border-border sm:w-auto sm:text-xs cursor-pointer"
                  onClick={handleReset}
                >
                  <ArrowsCounterClockwise size={18} /> Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-bold uppercase tracking-widest">
                Ctrl + Shift + Backspace
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right Side Group (Primary) */}
        <div className="contents sm:flex sm:items-center sm:justify-end sm:gap-3">
          <div className="w-full sm:w-auto">
            <ImportExportModal />
          </div>
          <div className="col-span-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleRunQuery}
                  className={cn(
                    "bg-accent text-accent-foreground h-10 w-full gap-2 px-4 font-black uppercase tracking-widest text-[10px] sm:w-auto sm:px-6 sm:text-xs cursor-pointer transition-all active:scale-95",
                    hasErrors && "ring-2 ring-destructive ring-offset-2 ring-offset-background"
                  )}
                >
                  <Play size={18} weight="fill" /> Run Query
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-bold uppercase tracking-widest">
                {hasErrors ? "Fix errors to run" : "Ctrl + Enter"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Builder Canvas */}
      <div className="bg-surface/30 border-border min-h-[400px] rounded-2xl border p-4 sm:p-6 overflow-x-hidden">
        <ConditionGroup group={rootGroup} />
      </div>
    </div>
  );
}
