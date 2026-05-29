'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, TerminalWindow, Database, Code } from '@phosphor-icons/react';

export function QueryPreview() {
  const mockSQL = "SELECT * FROM users\nWHERE age > 18\nAND status = 'active'";
  const mockMongo = '{\n  "age": { "$gt": 18 },\n  "status": "active"\n}';

  return (
    <div className="bg-surface border-border flex h-full flex-col overflow-hidden rounded-xl border shadow-lg">
      <div className="border-border bg-background/30 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <TerminalWindow size={20} className="text-accent" weight="duotone" />
          <h3 className="text-text-primary text-sm font-bold tracking-wider uppercase">
            Live Preview
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-text-secondary hover:text-text-primary h-8 gap-2 text-[11px] font-bold"
        >
          <Copy size={16} /> Copy
        </Button>
      </div>

      <Tabs defaultValue="sql" className="flex flex-1 flex-col">
        <div className="px-4 pt-2">
          <TabsList className="bg-background/50 border-border h-9 border">
            <TabsTrigger
              value="sql"
              className="gap-2 text-[11px] font-bold tracking-tight uppercase"
            >
              <Database size={14} /> SQL
            </TabsTrigger>
            <TabsTrigger
              value="mongo"
              className="gap-2 text-[11px] font-bold tracking-tight uppercase"
            >
              <Code size={14} /> MongoDB
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="text-text-secondary flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
          <TabsContent value="sql" className="mt-0 outline-none">
            <pre className="whitespace-pre-wrap">
              <code className="text-accent">{mockSQL}</code>
            </pre>
          </TabsContent>
          <TabsContent value="mongo" className="mt-0 outline-none">
            <pre className="whitespace-pre-wrap">
              <code>{mockMongo}</code>
            </pre>
          </TabsContent>
        </div>
      </Tabs>

      <div className="border-border bg-background/30 flex items-center justify-between border-t px-4 py-2">
        <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
          Syntax: V4 Standard
        </span>
        <div className="flex gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
            Synced
          </span>
        </div>
      </div>
    </div>
  );
}
