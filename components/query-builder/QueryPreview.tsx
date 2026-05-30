'use client';

import React, { useState, useMemo } from 'react';
import { useQueryStore } from '@/lib/store';
import { generateSQL, generateMongo } from '@/lib/query-generator';
import { TerminalWindow, Copy, CheckCircle, Database } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function QueryPreview() {
  const appliedRootGroup = useQueryStore((s) => s.appliedRootGroup);
  const [activeTab, setActiveTab] = useState('sql');
  const [copied, setCopied] = useState(false);

  const { sql, mongo } = useMemo(() => {
    return {
      sql: generateSQL(appliedRootGroup),
      mongo: JSON.stringify(generateMongo(appliedRootGroup), null, 2),
    };
  }, [appliedRootGroup]);

  const handleCopy = async () => {
    const text = activeTab === 'sql' ? sql : mongo;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border-border animate-in fade-in zoom-in-95 flex h-full flex-col overflow-hidden rounded-2xl border duration-300">
      <div className="border-border bg-background/40 flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-accent/10 rounded-lg p-1.5 sm:p-2">
            <TerminalWindow size={18} className="text-accent sm:size-5" weight="duotone" />
          </div>
          <div className="flex flex-col">
            <span className="text-text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest">
              Live Output
            </span>
            <span className="text-text-secondary text-[8px] sm:text-[9px] font-bold uppercase opacity-50">
              {activeTab}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="text-text-secondary hover:text-accent h-8 w-8 sm:h-9 sm:w-9 rounded-lg transition-colors"
        >
          {copied ? (
            <CheckCircle size={18} weight="fill" className="text-green-500" />
          ) : (
            <Copy size={18} />
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-border flex border-b bg-background/20 p-1 sm:p-1.5">
        <button
          onClick={() => setActiveTab('sql')}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all',
            activeTab === 'sql'
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'text-text-secondary hover:bg-surface'
          )}
        >
          PostgreSQL
        </button>
        <button
          onClick={() => setActiveTab('mongo')}
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all',
            activeTab === 'mongo'
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'text-text-secondary hover:bg-surface'
          )}
        >
          MongoDB
        </button>
      </div>

      <div className="theme-scrollbar relative flex-1 overflow-auto bg-[#0d1117] p-4 sm:p-6 font-mono selection:bg-accent/30">
        <pre className="text-[11px] sm:text-[13px] leading-relaxed">
          <code className="text-[#e6edf3]">
            {activeTab === 'sql' ? (
              <span className="animate-in fade-in duration-500">{sql}</span>
            ) : (
              <span className="animate-in fade-in duration-500">{mongo}</span>
            )}
          </code>
        </pre>

        {/* Floating Accent */}
        <div className="pointer-events-none absolute bottom-4 right-4 opacity-10">
          <Database size={80} weight="thin" className="text-accent" />
        </div>
      </div>

      <div className="border-border flex items-center justify-between border-t bg-background/40 px-4 py-2 sm:px-6">
        <span className="text-text-secondary text-[8px] sm:text-[9px] font-bold uppercase tracking-widest opacity-40">
          Recursive Engine v1.2
        </span>
        <div className="flex gap-1.5">
          <div className="bg-green-500/20 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full" />
          <div className="bg-accent/20 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
