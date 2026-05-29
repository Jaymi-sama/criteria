'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, TerminalWindow, Database, Code } from '@phosphor-icons/react';

export function QueryPreview() {
  const mockSQL = "SELECT * FROM users\nWHERE age > 18\nAND status = 'active'";
  const mockMongo = "{\n  \"age\": { \"$gt\": 18 },\n  \"status\": \"active\"\n}";

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/30">
        <div className="flex items-center gap-2">
          <TerminalWindow size={20} className="text-accent" weight="duotone" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Live Preview</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-2 text-[11px] font-bold text-text-secondary hover:text-text-primary"
        >
          <Copy size={16} /> Copy
        </Button>
      </div>

      <Tabs defaultValue="sql" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="bg-background/50 border border-border h-9">
            <TabsTrigger value="sql" className="gap-2 text-[11px] font-bold uppercase tracking-tight">
              <Database size={14} /> SQL
            </TabsTrigger>
            <TabsTrigger value="mongo" className="gap-2 text-[11px] font-bold uppercase tracking-tight">
              <Code size={14} /> MongoDB
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed text-text-secondary">
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
      
      <div className="px-4 py-2 border-t border-border bg-background/30 flex items-center justify-between">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Syntax: V4 Standard</span>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Synced</span>
        </div>
      </div>
    </div>
  );
}
