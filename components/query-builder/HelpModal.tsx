'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Question, Keyboard, TreeStructure, Play, Archive, Plus, FolderPlus } from '@phosphor-icons/react';

export function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-2xl border border-accent/20 bg-surface/80 backdrop-blur-md hover:bg-accent/10 hover:border-accent/40 transition-all z-50 group cursor-pointer"
        >
          <Question size={24} weight="bold" className="text-accent group-hover:scale-110 transition-transform" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border flex max-h-[90vh] w-[calc(100vw-32px)] sm:w-full sm:max-w-2xl flex-col overflow-hidden rounded-xl border p-0 shadow-2xl">
        <DialogHeader className="border-border border-b p-4 sm:p-6 text-left">
          <DialogTitle className="text-text-primary flex items-center gap-2 text-lg sm:text-xl font-bold uppercase tracking-tight">
            <Question size={20} className="text-accent sm:size-6" weight="duotone" />
            Quick Start Guide
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-[11px] sm:text-sm font-medium">
            Learn how to master the Criteria Query Builder.
          </DialogDescription>
        </DialogHeader>

        <div className="theme-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-8 p-4 sm:p-8">
            {/* Rule & Group Building */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12">
                  <Plus size={22} className="text-accent" weight="bold" />
                </div>
                <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12">
                  <FolderPlus size={22} className="text-accent" weight="bold" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                  Building your query
                </h3>
                <p className="text-text-secondary text-[11px] leading-relaxed sm:text-sm">
                  Use the <span className="text-accent font-bold">+ Plus</span> icon to add a single <span className="underline decoration-accent/30 underline-offset-2">Rule</span> (e.g., Name equals Alice). Use the <span className="text-accent font-bold">Folder</span> icon to add a nested <span className="underline decoration-accent/30 underline-offset-2">Logic Group</span> for complex AND/OR branching.
                </p>
              </div>
            </div>

            {/* Logic Tree */}
            <div className="flex gap-4 sm:gap-6">
              <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12">
                <TreeStructure size={24} className="text-accent" weight="duotone" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                  Recursive Hierarchy
                </h3>
                <p className="text-text-secondary text-[11px] leading-relaxed sm:text-sm">
                  Queries can be nested infinitely. Drag the vertical handle on the left of any item to move it. The vertical line connects related logic levels visually.
                </p>
              </div>
            </div>

            {/* Execution Model */}
            <div className="flex gap-4 sm:gap-6">
              <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12">
                <Play size={24} className="text-accent" weight="duotone" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                  Draft vs Execution
                </h3>
                <p className="text-text-secondary text-[11px] leading-relaxed sm:text-sm">
                  The builder uses a <span className="underline decoration-accent/30 underline-offset-2">Sandbox Model</span>. Your changes won&apos;t affect the results or syntax preview until you click <span className="underline decoration-accent/30 underline-offset-2">Run Query</span>. This prevents performance lag during complex builds.
                </p>
              </div>
            </div>

            {/* Shortcuts */}
            <div className="flex gap-4 sm:gap-6">
              <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12">
                <Keyboard size={24} className="text-accent" weight="duotone" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                  Keyboard Shortcuts
                </h3>
                <div className="flex flex-wrap gap-2">
                  <kbd className="bg-background border-border rounded border px-2 py-1 text-[10px] font-black uppercase">Ctrl + Enter</kbd>
                  <span className="text-text-secondary text-[10px] font-medium pt-1">Run Query</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <kbd className="bg-background border-border rounded border px-2 py-1 text-[10px] font-black uppercase">Ctrl + Shift + Backspace</kbd>
                  <span className="text-text-secondary text-[10px] font-medium pt-1">Reset Workspace</span>
                </div>
              </div>
            </div>

            {/* Persistence */}
            <div className="flex gap-4 sm:gap-6">
              <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12">
                <Archive size={24} className="text-accent" weight="duotone" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                  Archive & Presets
                </h3>
                <p className="text-text-secondary text-[11px] leading-relaxed sm:text-sm">
                  Save frequently used queries as <span className="underline decoration-accent/30 underline-offset-2">Presets</span> or restore previous runs from your <span className="underline decoration-accent/30 underline-offset-2">Execution History</span>. All data is stored securely in your browser&apos;s local storage.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border bg-background/30 flex items-center justify-between border-t p-3 px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <div className="bg-green-500 h-1.5 w-1.5 rounded-full" />
            <span className="text-text-secondary text-[9px] font-bold tracking-widest uppercase opacity-40">
              System Ready
            </span>
          </div>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-border h-8 font-bold uppercase tracking-wider text-[10px] sm:text-xs"
            >
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
