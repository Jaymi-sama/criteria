'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DownloadSimple, UploadSimple, Copy, CheckCircle } from '@phosphor-icons/react';

export function ImportExportModal() {
  const [copied, setCopied] = React.useState(false);
  const mockJson = JSON.stringify(
    {
      logicalOperator: 'AND',
      children: [{ id: 'r1', type: 'rule', fieldId: 'age', operator: 'greater_than', value: 18 }],
    },
    null,
    2
  );

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="h-9 gap-2">
          <DownloadSimple size={18} weight="duotone" />
          Import / Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border overflow-hidden rounded-xl border p-0 sm:max-w-2xl">
        <DialogHeader className="border-border bg-background/30 border-b p-6">
          <DialogTitle className="text-text-primary flex items-center gap-2 text-xl font-bold">
            <UploadSimple size={24} className="text-accent" weight="duotone" />
            Query JSON
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Import or export your query configuration as a JSON object.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6">
          <div className="group relative">
            <Textarea
              readOnly
              className="bg-background/50 border-border focus-visible:ring-accent/30 min-h-[300px] resize-none p-4 font-mono text-[13px]"
              value={mockJson}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="bg-surface border-border absolute top-3 right-3 h-8 gap-2 border opacity-0 transition-opacity group-hover:opacity-100"
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

          <div className="bg-accent/5 border-accent/20 flex items-center gap-3 rounded-lg border p-4">
            <div className="bg-accent/20 rounded-full p-2">
              <UploadSimple size={16} className="text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-text-primary text-xs font-bold tracking-tight uppercase">
                Paste to Import
              </span>
              <span className="text-text-secondary text-[11px]">
                Replace the content above with your JSON to update the builder.
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border bg-background/30 flex items-center justify-between border-t p-6 sm:justify-between">
          <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
            Format: JSON Schema v1
          </span>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border">
              Cancel
            </Button>
            <Button className="bg-accent text-accent-foreground font-bold">Apply Import</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
