'use client';

import React, { useState } from 'react';
import { useQueryStore } from '@/lib/store';
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
import { Archive, Play, Trash, BookmarkSimple, ClockCounterClockwise } from '@phosphor-icons/react';

export function AdvancedInteractions() {
  const presets = useQueryStore((s) => s.presets);
  const history = useQueryStore((s) => s.history);
  const savePreset = useQueryStore((s) => s.savePreset);
  const deletePreset = useQueryStore((s) => s.deletePreset);
  const clearHistory = useQueryStore((s) => s.clearHistory);
  const restoreQuery = useQueryStore((s) => s.restoreQuery);

  const [presetName, setPresetName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    savePreset(presetName, 'Manual save');
    setPresetName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary hover:text-text-primary h-10 w-full sm:w-auto gap-2 font-bold uppercase tracking-wider text-[10px] sm:text-xs cursor-pointer"
        >
          <Archive size={18} weight="duotone" />
          Archive
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border flex max-h-[90vh] w-[calc(100vw-32px)] sm:w-full sm:max-w-2xl flex-col overflow-hidden rounded-xl border p-0 shadow-2xl">
        <DialogHeader className="border-border border-b p-4 sm:p-6 text-left">
          <DialogTitle className="text-text-primary flex items-center gap-2 text-lg sm:text-xl font-bold uppercase tracking-tight">
            <Archive size={20} className="text-accent sm:size-6" weight="duotone" />
            Query Archive
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-[11px] sm:text-sm font-medium">
            Manage your saved presets and execution history.
          </DialogDescription>
        </DialogHeader>

        <div className="theme-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-4 sm:p-8">
            {/* Presets Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <BookmarkSimple size={16} className="text-accent" weight="bold" />
                  <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                    Saved Presets
                  </h3>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  className="bg-background border-border focus-visible:ring-accent/30 h-9 flex-1 rounded-lg border px-3 text-[10px] font-bold uppercase tracking-wider sm:h-10 sm:text-xs"
                  placeholder="Preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
                <Button
                  onClick={handleSavePreset}
                  className="bg-accent text-accent-foreground h-9 px-4 font-black uppercase tracking-widest text-[10px] sm:h-10 sm:px-6 sm:text-xs"
                >
                  Save
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {presets.length === 0 ? (
                  <div className="bg-background/20 col-span-full rounded-xl border border-dashed border-border p-8 text-center">
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest opacity-30">
                      No presets saved
                    </p>
                  </div>
                ) : (
                  presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="bg-background border-border group flex items-center justify-between rounded-xl border p-3 transition-colors hover:border-accent/40"
                    >
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-text-primary truncate text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                          {preset.name}
                        </span>
                        <span className="text-text-secondary text-[8px] font-medium opacity-60">
                          {preset.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-text-secondary hover:text-accent h-7 w-7"
                          onClick={() => {
                            restoreQuery(preset.rootGroup);
                            setOpen(false);
                          }}
                        >
                          <Play size={14} weight="fill" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-text-secondary hover:text-destructive h-7 w-7"
                          onClick={() => deletePreset(preset.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* History Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <ClockCounterClockwise size={16} className="text-accent" weight="bold" />
                  <h3 className="text-text-primary text-[10px] font-black uppercase tracking-widest sm:text-xs">
                    Execution History
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-text-secondary hover:text-destructive text-[8px] font-black uppercase tracking-widest sm:text-[9px]"
                  onClick={clearHistory}
                >
                  Clear All
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {history.length === 0 ? (
                  <div className="bg-background/20 rounded-xl border border-dashed border-border p-8 text-center">
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest opacity-30">
                      Empty history
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-background border-border group flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors hover:border-accent/40"
                      onClick={() => {
                        restoreQuery(item.rootGroup);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-text-primary truncate text-[10px] font-black tracking-tighter uppercase sm:text-xs">
                          {item.query}
                        </span>
                        <span className="text-text-secondary text-[8px] font-bold opacity-40 uppercase tracking-widest">
                          Executed at {item.time}
                        </span>
                      </div>
                      <ArrowForwardIcon size={14} className="text-text-secondary opacity-0 transition-all group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border bg-background/30 flex items-center justify-between border-t p-3 px-4 sm:px-6">
          <span className="text-text-secondary text-[9px] font-bold tracking-widest uppercase opacity-40">
            Local Storage Persistence
          </span>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-border h-8 font-bold uppercase tracking-wider text-[10px] sm:text-xs"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ArrowForwardIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 14}
      height={size || 14}
      fill="currentColor"
      viewBox="0 0 256 256"
      className={className}
    >
      <path d="M200,128a8,8,0,0,1-8,8H71.31l31.35,31.35a8,8,0,0,1-11.32,11.32l-45.25-45.26a8,8,0,0,1,0-11.32l45.25-45.26a8,8,0,0,1,11.32,11.32L71.31,120H192A8,8,0,0,1,200,128Z" transform="rotate(180 128 128)"></path>
    </svg>
  );
}
