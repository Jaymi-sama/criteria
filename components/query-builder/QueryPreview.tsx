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
      <div className="border-border bg-background/40 flex items-center justify-between border-b px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 rounded-lg p-2">
            <TerminalWindow size={20} className="text-accent" weight="duotone" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-text-primary text-xs font-black tracking-widest uppercase">
              Live Output
            </h3>
            <span className="text-text-secondary text-[9px] font-bold tracking-tighter uppercase opacity-70">
              Real-time Compiler
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="sql" className="flex flex-1 flex-col">
        <div className="px-6 pt-4">
          <TabsList className="bg-background/50 border-border h-11 w-full rounded-xl border p-1">
            <TabsTrigger
              value="sql"
              className="data-[state=active]:bg-surface data-[state=active]:text-accent flex-1 gap-2 text-[10px] font-black tracking-widest uppercase data-[state=active]:shadow-lg"
            >
              <Database size={16} weight="duotone" /> SQL
            </TabsTrigger>
            <TabsTrigger
              value="mongo"
              className="data-[state=active]:bg-surface data-[state=active]:text-accent flex-1 gap-2 text-[10px] font-black tracking-widest uppercase data-[state=active]:shadow-lg"
            >
              <Code size={16} weight="duotone" /> JSON
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="text-text-secondary flex-1 overflow-hidden p-6 font-mono text-[13px] leading-relaxed">
          <TabsContent value="sql" className="group relative mt-0 h-full outline-none">
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-surface/50 border-border absolute top-0 right-0 h-8 w-8 border opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleCopy(sql)}
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
            <pre className="theme-scrollbar h-full overflow-y-auto pr-4">
              <code className="text-accent selection:bg-accent/30 block min-h-full">{sql}</code>
            </pre>
          </TabsContent>
          <TabsContent value="mongo" className="group relative mt-0 h-full outline-none">
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-surface/50 border-border absolute top-0 right-0 h-8 w-8 border opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleCopy(mongo)}
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </Button>
            <pre className="theme-scrollbar h-full overflow-y-auto pr-4">
              <code className="text-text-primary selection:bg-accent/30 block min-h-full">
                {mongo}
              </code>
            </pre>
          </TabsContent>
        </div>
      </Tabs>

      <div className="border-border bg-background/40 flex items-center justify-between border-t px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-text-secondary text-[9px] font-black tracking-[0.2em] uppercase">
            Engine Synced
          </span>
        </div>
        <span className="text-text-secondary text-[9px] font-black tracking-[0.2em] uppercase opacity-40">
          v1.0.42
        </span>
      </div>
    </div>
  );
}
