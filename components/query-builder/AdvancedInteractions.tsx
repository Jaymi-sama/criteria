'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  BookmarkSimple,
  Trash,
  Play,
  ArrowSquareOut,
  Plus,
  Archive,
  ClockCounterClockwise,
  X,
} from '@phosphor-icons/react';
import { useQueryStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { QueryGroup } from '@/types/query';

export function AdvancedInteractions() {
  const { presets, history, savePreset, deletePreset, clearHistory, restoreQuery } =
    useQueryStore();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!presetName) return;
    savePreset(presetName, '');
    setPresetName('');
    setShowSaveForm(false);
  };

  const handleRestore = (query: QueryGroup) => {
    restoreQuery(query);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary hover:text-text-primary h-10 gap-2 font-bold tracking-wider uppercase"
        >
          <Archive size={18} weight="duotone" />
          Archive
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border p-0 shadow-2xl">
        {/* Understated Header */}
        <div className="border-border bg-background/40 flex shrink-0 items-center justify-between border-b p-8 backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="bg-accent h-3 w-3 animate-pulse rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <DialogTitle className="text-text-primary text-lg font-black tracking-tight uppercase">
                Archive Engine
              </DialogTitle>
            </div>
            <DialogDescription className="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">
              Persistent storage for presets and logs
            </DialogDescription>
          </div>
          <div className="bg-accent/10 border-accent/20 rounded-lg border px-3 py-1">
            <span className="text-accent text-[9px] font-black tracking-widest uppercase">
              v1.2.0
            </span>
          </div>
        </div>

        {/* Scrollable Container (Native) */}
        <div className="bg-background/5 flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-12">
            {/* Presets Section */}
            <section className="flex flex-col gap-6">
              <div className="border-border/50 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <BookmarkSimple size={18} weight="fill" className="text-accent" />
                  <h3 className="text-text-primary text-[11px] font-black tracking-[0.2em] uppercase">
                    Saved Presets
                  </h3>
                </div>
                {!showSaveForm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSaveForm(true)}
                    className="text-accent hover:bg-accent/10 h-8 gap-2 text-[10px] font-bold tracking-widest uppercase"
                  >
                    <Plus size={14} weight="bold" /> Create New
                  </Button>
                )}
              </div>

              {showSaveForm && (
                <div className="bg-surface border-accent/20 animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 rounded-xl border p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-accent text-[9px] font-black tracking-widest uppercase">
                      Configure Preset
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setShowSaveForm(false)}
                      className="h-5 w-5"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="bg-background border-border focus-visible:ring-accent/30 h-11 text-sm font-bold"
                    />
                    <Button
                      onClick={handleSave}
                      disabled={!presetName}
                      className="bg-accent text-accent-foreground h-11 px-6 font-black tracking-widest uppercase"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {presets.length === 0 && !showSaveForm && (
                  <div className="py-10 text-center opacity-30">
                    <p className="text-[10px] font-black tracking-widest uppercase">
                      No presets found
                    </p>
                  </div>
                )}
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="group bg-surface/50 border-border hover:border-accent/40 flex items-center justify-between rounded-xl border p-5 transition-all"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-text-primary truncate text-sm font-bold">
                        {preset.name}
                      </span>
                      <span className="text-text-secondary text-[9px] font-medium uppercase opacity-50">
                        Local Configuration
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 transition-all group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => handleRestore(preset.rootGroup)}
                        className="h-9 w-9"
                      >
                        <Play size={16} weight="fill" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deletePreset(preset.id)}
                        className="hover:text-destructive h-9 w-9"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* History Section */}
            <section className="flex flex-col gap-6">
              <div className="border-border/50 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <ClockCounterClockwise size={18} weight="bold" className="text-text-secondary" />
                  <h3 className="text-text-primary text-[11px] font-black tracking-[0.2em] uppercase">
                    Recent Logs
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={clearHistory}
                  className="text-text-secondary hover:text-destructive text-[10px] font-black tracking-widest uppercase"
                >
                  Clear All
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {history.length === 0 && (
                  <div className="py-10 text-center opacity-30">
                    <p className="text-[10px] font-black tracking-widest uppercase">
                      History is empty
                    </p>
                  </div>
                )}
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group/item border-border hover:border-accent/30 bg-background/20 flex items-center justify-between rounded-xl border p-5 transition-all"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-text-primary text-[10px] font-black tracking-tight uppercase">
                          {item.name}
                        </span>
                        <span className="text-text-secondary text-[9px] font-bold uppercase opacity-30">
                          {item.time}
                        </span>
                      </div>
                      <code className="text-text-secondary bg-background/50 border-border block truncate rounded-lg border px-3 py-2 font-mono text-[10px] opacity-60">
                        {item.query}
                      </code>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => handleRestore(item.rootGroup)}
                      className="text-accent hover:text-accent/80 ml-4 h-auto p-0 text-[10px] font-black tracking-widest uppercase no-underline hover:underline"
                    >
                      Restore <ArrowSquareOut size={12} weight="bold" className="ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border bg-background/40 flex shrink-0 items-center justify-center border-t py-4 backdrop-blur-md">
          <p className="text-text-secondary text-[8px] font-black tracking-[0.4em] uppercase opacity-30">
            Secure Local Query Archive v1.0
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
