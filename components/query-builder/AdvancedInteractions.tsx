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
  const { presets, history, savePreset, deletePreset, clearHistory, restoreQuery } = useQueryStore();
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
          className="border-border text-text-secondary hover:text-text-primary h-10 w-full sm:w-auto gap-2 font-bold uppercase tracking-wider text-[10px] sm:text-xs"
        >
          <Archive size={18} weight="duotone" />
          Archive
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border flex max-h-[90vh] w-[calc(100vw-32px)] sm:w-full sm:max-w-3xl flex-col overflow-hidden rounded-2xl border p-0 shadow-2xl">
        {/* Understated Header */}
        <div className="border-border flex shrink-0 items-center justify-between border-b bg-background/40 p-4 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="bg-accent h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <DialogTitle className="text-text-primary text-base sm:text-lg font-black uppercase tracking-tight">
                Archive Engine
              </DialogTitle>
            </div>
            <DialogDescription className="text-text-secondary text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60">
              Persistent storage for presets and logs
            </DialogDescription>
          </div>
          <div className="bg-accent/10 border-accent/20 rounded-lg border px-2 py-0.5 sm:px-3 sm:py-1 hidden xs:block">
            <span className="text-accent text-[8px] sm:text-[9px] font-black uppercase tracking-widest">v1.2.0</span>
          </div>
        </div>

        {/* Scrollable Container (Native) */}
        <div className="theme-scrollbar flex-1 overflow-y-auto bg-background/5 p-4 sm:p-8">
          <div className="flex flex-col gap-8 sm:gap-12">
            
            {/* Presets Section */}
            <section className="flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <BookmarkSimple size={16} weight="fill" className="text-accent sm:size-4.5" />
                  <h3 className="text-text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]">Saved Presets</h3>
                </div>
                {!showSaveForm && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSaveForm(true)}
                    className="h-7 sm:h-8 gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-accent/10 px-2 sm:px-3"
                  >
                    <Plus size={12} weight="bold" className="sm:size-3.5" /> <span className="hidden sm:inline">Create New</span><span className="sm:hidden">Add</span>
                  </Button>
                )}
              </div>

              {showSaveForm && (
                <div className="bg-surface border-accent/20 animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 rounded-xl border p-4 sm:p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-accent text-[9px] font-black uppercase tracking-widest">Configure Preset</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => setShowSaveForm(false)} className="h-5 w-5 sm:h-6 sm:w-6">
                      <X size={12} className="sm:size-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Enter preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="bg-background border-border h-10 sm:h-11 text-xs sm:text-sm font-bold focus-visible:ring-accent/30 flex-1 px-3 sm:px-4"
                    />
                    <Button 
                      onClick={handleSave} 
                      disabled={!presetName} 
                      className="bg-accent text-accent-foreground h-10 sm:h-11 px-4 sm:px-6 font-black uppercase tracking-widest text-[10px] sm:text-xs"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {presets.length === 0 && !showSaveForm && (
                  <div className="py-8 sm:py-10 text-center opacity-30">
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">No presets found</p>
                  </div>
                )}
                {presets.map((preset) => (
                  <div key={preset.id} className="group bg-surface/50 border-border hover:border-accent/40 flex items-center justify-between rounded-xl border p-3 sm:p-5 transition-all">
                    <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
                      <span className="text-text-primary text-xs sm:text-sm font-bold truncate">{preset.name}</span>
                      <span className="text-text-secondary text-[8px] sm:text-[9px] font-medium uppercase opacity-50">Local Config</span>
                    </div>
                    <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                      <Button variant="secondary" size="icon-xs" onClick={() => handleRestore(preset.rootGroup)} className="h-7 w-7 sm:h-9 sm:w-9">
                        <Play size={14} className="sm:size-4" weight="fill" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" onClick={() => deletePreset(preset.id)} className="h-7 w-7 sm:h-9 sm:w-9 hover:text-destructive">
                        <Trash size={14} className="sm:size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* History Section */}
            <section className="flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <ClockCounterClockwise size={16} weight="bold" className="text-text-secondary sm:size-4.5" />
                  <h3 className="text-text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]">Recent Logs</h3>
                </div>
                <Button variant="ghost" size="xs" onClick={clearHistory} className="text-text-secondary hover:text-destructive text-[8px] sm:text-[10px] font-black uppercase tracking-widest">
                  Clear All
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {history.length === 0 && (
                  <div className="py-8 sm:py-10 text-center opacity-30">
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">History is empty</p>
                  </div>
                )}
                {history.map((item) => (
                  <div key={item.id} className="group/item border-border hover:border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-background/20 p-3 sm:p-5 gap-3 sm:gap-0 transition-all">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-tight truncate">{item.name}</span>
                        <span className="text-text-secondary text-[8px] sm:text-[9px] font-bold uppercase opacity-30 shrink-0">{item.time}</span>
                      </div>
                      <code className="text-text-secondary bg-background/50 border-border block truncate rounded-lg border px-2 py-1.5 sm:px-3 sm:py-2 font-mono text-[9px] sm:text-[10px] opacity-60">
                        {item.query}
                      </code>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => handleRestore(item.rootGroup)}
                      className="text-accent hover:text-accent/80 sm:ml-4 h-auto p-0 text-[9px] sm:text-[10px] font-black uppercase tracking-widest no-underline hover:underline w-fit"
                    >
                      Restore <ArrowSquareOut size={11} weight="bold" className="ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="border-border bg-background/40 flex shrink-0 items-center justify-center border-t py-3 sm:py-4 backdrop-blur-md">
           <p className="text-text-secondary text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-30">
            Secure Local Query Archive v1.0
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
