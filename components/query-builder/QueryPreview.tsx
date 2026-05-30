'use client';

import React from 'react';
import { useQueryStore } from '@/lib/store';
import { generateSQL, generateMongo } from '@/lib/query-generator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, TerminalWindow, Database, Code, Check } from '@phosphor-icons/react';

export function QueryPreview() {
  const { appliedRootGroup, schema } = useQueryStore();
  const [copied, setCopied] = React.useState(false);

  const sql = generateSQL(appliedRootGroup, schema) || '-- No conditions applied';
  const mongo = JSON.stringify(generateMongo(appliedRootGroup), null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border-border animate-in fade-in zoom-in-95 flex h-full flex-col overflow-hidden rounded-2xl border shadow-2xl duration-300">
      <div className="border-border bg-background/40 flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-accent/10 rounded-lg p-1.5 sm:p-2">
            <TerminalWindow size={18} className="text-accent sm:size-5" weight="duotone" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-text-primary text-[10px] font-black tracking-widest uppercase sm:text-xs">
              Live Output
            </h3>
            <span className="text-text-secondary text-[8px] font-bold tracking-tighter uppercase opacity-70 sm:text-[9px]">
              Real-time Compiler
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="sql" className="flex flex-1 flex-col">
        <div className="px-4 pt-3 sm:px-6 sm:pt-4">
          <TabsList className="bg-background/50 border-border h-9 w-full rounded-xl border p-1 sm:h-11">
            <TabsTrigger
              value="sql"
              className="data-[state=active]:bg-surface data-[state=active]:text-accent flex-1 gap-1.5 text-[9px] font-black tracking-widest uppercase data-[state=active]:shadow-lg sm:gap-2 sm:text-[10px]"
            >
              <Database size={14} weight="duotone" className="sm:size-4" /> SQL
            </TabsTrigger>
            <TabsTrigger
              value="mongo"
              className="data-[state=active]:bg-surface data-[state=active]:text-accent flex-1 gap-1.5 text-[9px] font-black tracking-widest uppercase data-[state=active]:shadow-lg sm:gap-2 sm:text-[10px]"
            >
              <Code size={14} weight="duotone" className="sm:size-4" /> JSON
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="text-text-secondary flex-1 overflow-hidden p-4 font-mono text-[12px] leading-relaxed sm:p-6 sm:text-[13px]">
          <TabsContent value="sql" className="group relative mt-0 h-full outline-none">
            <Button
              variant="ghost"
              size="icon-xs"
              className="bg-surface/50 border-border absolute top-0 right-0 h-7 w-7 border opacity-0 transition-opacity group-hover:opacity-100 sm:h-8 sm:w-8"
              onClick={() => handleCopy(sql)}
            >
              {copied ? <Check size={12} className="text-green-500 sm:size-3.5" /> : <Copy size={12} className="sm:size-3.5" />}
            </Button>
            <pre className="theme-scrollbar h-full overflow-y-auto pr-2 sm:pr-4">
              <code className="text-accent selection:bg-accent/30 block min-h-full whitespace-pre-wrap sm:whitespace-pre">{sql}</code>
            </pre>
          </TabsContent>
          <TabsContent value="mongo" className="group relative mt-0 h-full outline-none">
            <Button
              variant="ghost"
              size="icon-xs"
              className="bg-surface/50 border-border absolute top-0 right-0 h-7 w-7 border opacity-0 transition-opacity group-hover:opacity-100 sm:h-8 sm:w-8"
              onClick={() => handleCopy(mongo)}
            >
              {copied ? <Check size={12} className="text-green-500 sm:size-3.5" /> : <Copy size={12} className="sm:size-3.5" />}
            </Button>
            <pre className="theme-scrollbar h-full overflow-y-auto pr-2 sm:pr-4">
              <code className="text-text-primary selection:bg-accent/30 block min-h-full whitespace-pre-wrap sm:whitespace-pre">
                {mongo}
              </code>
            </pre>
          </TabsContent>
        </div>
      </Tabs>

      <div className="border-border bg-background/40 flex items-center justify-between border-t px-4 py-2 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] sm:h-1.5 sm:w-1.5" />
          <span className="text-text-secondary text-[8px] font-black tracking-[0.2em] uppercase sm:text-[9px]">
            Engine Synced
          </span>
        </div>
        <span className="text-text-secondary text-[8px] font-black tracking-[0.2em] uppercase opacity-40 sm:text-[9px]">
          v1.0.42
        </span>
      </div>
    </div>
  );
}
