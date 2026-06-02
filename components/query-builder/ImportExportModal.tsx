'use client';

import React, { useRef } from 'react';
import { useQueryStore } from '@/lib/store';
import { QueryGroup } from '@/types/query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DownloadSimple, UploadSimple, Copy, CheckCircle, FileText } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function ImportExportModal() {
  const rootGroup = useQueryStore((s) => s.rootGroup);
  const importQuery = useQueryStore((s) => s.importQuery);
  
  const [copied, setCopied] = React.useState(false);
  const [jsonInput, setJsonInput] = React.useState(() => JSON.stringify(rootGroup, null, 2));
  const [open, setOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setJsonInput(JSON.stringify(rootGroup, null, 2));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopied(true);
      toast.success('Configuration copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setJsonInput(content);
        toast.info('File loaded successfully');
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleApplyImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed && typeof parsed === 'object') {
        importQuery(parsed as QueryGroup);
        setOpen(false);
        toast.success('Query imported and normalized successfully');
      } else {
        toast.error('Import failed', {
          description: 'Expected a JSON object at root level.'
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown syntax error';
      toast.error('Invalid JSON Syntax', {
        description: message
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary hover:text-text-primary h-10 w-full sm:w-auto gap-2 font-bold uppercase tracking-wider text-[10px] sm:text-xs cursor-pointer"
        >
          <DownloadSimple size={18} weight="duotone" />
          Import / Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border flex max-h-[90vh] w-[calc(100vw-32px)] sm:w-full sm:max-w-2xl flex-col overflow-hidden rounded-xl border p-0 shadow-2xl">
        <DialogHeader className="border-border border-b p-4 sm:p-6 text-left">
          <DialogTitle className="text-text-primary flex items-center gap-2 text-lg sm:text-xl font-bold uppercase tracking-tight">
            <UploadSimple size={20} className="text-accent sm:size-6" weight="duotone" />
            Query Transfer
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-[11px] sm:text-sm font-medium">
            Import or export your query configuration via JSON.
          </DialogDescription>
        </DialogHeader>

        <div className="theme-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-8">
            <div className="group relative">
              <Textarea
                className="bg-background/80 border-border focus-visible:ring-accent/30 min-h-[200px] sm:min-h-[300px] resize-none p-3 sm:p-4 font-mono text-[11px] sm:text-[13px] leading-relaxed shadow-inner"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here..."
              />
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                className="bg-surface border-border absolute top-2 right-2 h-7 w-7 sm:top-3 sm:right-3 sm:h-8 sm:gap-2 sm:w-auto sm:px-3 border opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
              >
                {copied ? (
                  <CheckCircle size={14} className="text-green-500 sm:size-4" weight="fill" />
                ) : (
                  <Copy size={14} className="sm:size-4" />
                )}
                <span className="hidden sm:inline ml-2 text-[10px] font-bold uppercase tracking-wider">Copy</span>
              </Button>
            </div>

            <div
              onClick={handleUploadClick}
              className="bg-accent/5 border-accent/20 hover:bg-accent/10 hover:border-accent/40 group flex cursor-pointer items-center gap-3 sm:gap-4 rounded-xl border border-dashed p-3 transition-all"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <div className="bg-accent/20 rounded-lg p-1.5 sm:p-2 transition-transform group-hover:scale-105">
                <FileText size={16} className="text-accent sm:size-5" weight="duotone" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                  Import File
                </span>
                <span className="text-text-secondary text-[9px] sm:text-[10px] font-medium opacity-60">
                  Select a .json from your device
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border bg-background/30 flex items-center justify-between border-t p-3 px-4 sm:px-6">
          <span className="text-text-secondary text-[9px] font-bold tracking-widest uppercase opacity-40">
            Clipboard & File Support
          </span>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-border h-8 font-bold uppercase tracking-wider text-[10px] sm:text-xs"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-accent text-accent-foreground h-8 px-4 font-black uppercase tracking-widest text-[10px] sm:text-xs"
              onClick={handleApplyImport}
            >
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
