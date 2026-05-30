'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Clock,
  BookmarkSimple,
  Trash,
  Play,
  ArrowSquareOut,
  PlusCircle,
  X,
} from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useQueryStore } from '@/lib/store';
import { Input } from '@/components/ui/input';

export function AdvancedInteractions() {
  const { presets, history, savePreset, deletePreset, clearHistory, restoreQuery } = useQueryStore();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDesc, setPresetDesc] = useState('');

  const handleSave = () => {
    if (!presetName) return;
    savePreset(presetName, presetDesc);
    setPresetName('');
    setPresetDesc('');
    setShowSaveForm(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-text-secondary hover:text-text-primary border-border h-10 gap-2 font-bold uppercase tracking-wider"
        >
          <Clock size={18} weight="duotone" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-surface border-border p-0 shadow-2xl sm:w-[540px]">
        <SheetHeader className="border-border bg-background/40 p-8 border-b backdrop-blur-md">
          <SheetTitle className="text-text-primary flex items-center gap-3 text-2xl font-black tracking-tighter uppercase">
            <BookmarkSimple size={28} className="text-accent" weight="duotone" />
            Archive
          </SheetTitle>
          <SheetDescription className="text-text-secondary text-sm font-medium">
            Manage your persistent query presets and execution logs.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-[calc(100vh-160px)] flex-col">
          <ScrollArea className="flex-1 theme-scrollbar">
            <div className="flex flex-col gap-10 p-8">
              {/* Presets Section */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-text-primary flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase">
                    <span className="bg-accent h-4 w-1 rounded-full" />
                    Saved Presets
                  </h4>
                  <Badge
                    variant="outline"
                    className="border-accent/30 text-accent bg-accent/5 text-[10px] font-black"
                  >
                    {presets.length} STORED
                  </Badge>
                </div>

                {showSaveForm ? (
                  <div className="bg-background/40 border-border flex flex-col gap-4 rounded-xl border p-5 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <span className="text-accent text-[10px] font-black uppercase tracking-widest">
                        New Preset Configuration
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon-xs" 
                        onClick={() => setShowSaveForm(false)}
                        className="h-6 w-6 opacity-50 hover:opacity-100"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Input
                        placeholder="Preset Name (e.g. Q4 Audit)"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        className="bg-background border-border h-10 font-bold"
                      />
                      <Input
                        placeholder="Short description..."
                        value={presetDesc}
                        onChange={(e) => setPresetDesc(e.target.value)}
                        className="bg-background border-border h-10 text-xs"
                      />
                      <Button 
                        className="bg-accent text-accent-foreground w-full font-black uppercase tracking-widest"
                        onClick={handleSave}
                        disabled={!presetName}
                      >
                        Confirm Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="border-border border-dashed py-6 gap-2 text-text-secondary hover:text-accent hover:border-accent/50 transition-all font-bold uppercase tracking-widest text-[10px]"
                    onClick={() => setShowSaveForm(true)}
                  >
                    <PlusCircle size={18} weight="duotone" />
                    Create New Preset
                  </Button>
                )}

                <div className="grid gap-4">
                  {presets.length === 0 && !showSaveForm && (
                    <p className="text-text-secondary py-4 text-center text-xs italic opacity-50">
                      No presets saved yet.
                    </p>
                  )}
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="group bg-background/40 border-border hover:border-accent/40 hover:bg-accent/5 rounded-xl border p-5 transition-all"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-text-primary group-hover:text-accent text-sm font-bold transition-colors">
                          {preset.name}
                        </span>
                        <div className="flex translate-x-2 gap-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-text-secondary hover:text-accent h-7 w-7"
                            onClick={() => restoreQuery(preset.rootGroup)}
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
                      <p className="text-text-secondary text-xs leading-relaxed opacity-70">
                        {preset.description || 'No description provided.'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-border/50" />

              {/* History Section */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-text-primary flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase">
                    <span className="bg-border h-4 w-1 rounded-full" />
                    Recent Activity
                  </h4>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-text-secondary hover:text-destructive text-[10px] font-black uppercase tracking-widest"
                    onClick={clearHistory}
                  >
                    Purge Logs
                  </Button>
                </div>
                <div className="flex flex-col gap-6">
                  {history.length === 0 && (
                    <p className="text-text-secondary py-4 text-center text-xs italic opacity-50">
                      Execution history is empty.
                    </p>
                  )}
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="group/item border-border hover:border-accent relative flex flex-col gap-3 border-l py-1 pl-6 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-text-primary text-xs font-black tracking-tight uppercase">
                          {item.name}
                        </span>
                        <span className="text-text-secondary text-[10px] font-bold uppercase opacity-50">
                          {item.time}
                        </span>
                      </div>
                      <div className="relative">
                        <code className="text-text-secondary bg-background/60 border-border block truncate rounded-lg border p-3 font-mono text-[11px] group-hover/item:border-accent/30 transition-colors">
                          {item.query}
                        </code>
                      </div>
                      <Button
                        variant="link"
                        size="xs"
                        className="text-accent w-fit h-auto p-0 text-[10px] font-black tracking-widest gap-1.5 no-underline hover:underline uppercase"
                        onClick={() => restoreQuery(item.rootGroup)}
                      >
                        Restore Session <ArrowSquareOut size={12} weight="bold" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="border-border bg-background/40 mt-auto border-t p-8 backdrop-blur-md">
            <Button 
              className="bg-accent text-accent-foreground h-12 w-full font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              onClick={() => setShowSaveForm(true)}
              disabled={showSaveForm}
            >
              <BookmarkSimple size={20} weight="fill" />
              Save Environment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
