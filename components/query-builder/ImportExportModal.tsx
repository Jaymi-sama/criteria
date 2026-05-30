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

export function ImportExportModal() {
  const { rootGroup, importQuery } = useQueryStore();
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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
      }
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
        const groupToImport: QueryGroup = {
          id: parsed.id || `root-${Date.now()}`,
          type: 'group',
          logicalOperator: parsed.logicalOperator || 'AND',
          children: Array.isArray(parsed.children) ? parsed.children : [],
          isCollapsed: !!parsed.isCollapsed,
        };
        importQuery(groupToImport);
        setOpen(false);
      } else {
        alert('Invalid format. Expected a JSON object.');
      }
    } catch {
      alert('Failed to parse JSON. Please check your syntax.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-text-secondary hover:text-text-primary border-border h-10 gap-2 font-bold tracking-wider uppercase"
        >
          <DownloadSimple size={18} weight="duotone" />
          Import / Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border flex max-h-[90vh] flex-col overflow-hidden rounded-xl border p-0 sm:max-w-2xl">
        <DialogHeader className="border-border bg-background/30 border-b p-6">
          <DialogTitle className="text-text-primary flex items-center gap-2 text-xl font-bold tracking-tight uppercase">
            <UploadSimple size={24} className="text-accent" weight="duotone" />
            Query JSON
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-sm font-medium">
            Import or export your query configuration as a JSON object.
          </DialogDescription>
        </DialogHeader>

        <div className="theme-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-8">
            <div className="group relative">
              <Textarea
                className="bg-background/80 border-border focus-visible:ring-accent/30 min-h-[300px] resize-none p-4 font-mono text-[13px] leading-relaxed shadow-inner"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here..."
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="bg-surface border-border absolute top-3 right-3 h-8 gap-2 border opacity-0 shadow-xl transition-opacity group-hover:opacity-100"
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} className="text-green-500" weight="fill" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div
              onClick={handleUploadClick}
              className="bg-accent/5 border-accent/20 hover:bg-accent/10 hover:border-accent/40 group flex cursor-pointer items-center gap-4 rounded-xl border border-dashed p-3 transition-all"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <div className="bg-accent/20 rounded-lg p-2 transition-transform group-hover:scale-105">
                <FileText size={18} className="text-accent" weight="duotone" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-text-primary text-[11px] font-black tracking-widest uppercase">
                  Import JSON File
                </span>
                <span className="text-text-secondary text-[10px] font-medium opacity-60">
                  Click to select from device
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border bg-background/30 flex items-center justify-between border-t p-6 sm:justify-between">
          <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">
            Format: JSON Schema v1
          </span>
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-border h-10 font-bold tracking-wider uppercase"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-accent text-accent-foreground h-10 px-6 font-black tracking-widest uppercase"
              onClick={handleApplyImport}
            >
              Apply Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
