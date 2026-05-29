'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListBullets, Database, Circle, MagnifyingGlass } from '@phosphor-icons/react';

const MOCK_DATA = [
  { id: 1, name: 'Alice Johnson', age: 28, status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Bob Smith', age: 34, status: 'inactive', createdAt: '2023-11-20' },
  { id: 3, name: 'Charlie Davis', age: 22, status: 'pending', createdAt: '2024-02-05' },
  { id: 4, name: 'Diana Prince', age: 31, status: 'active', createdAt: '2024-03-10' },
  { id: 5, name: 'Ethan Hunt', age: 45, status: 'active', createdAt: '2023-12-01' },
  { id: 6, name: 'Fiona Gallagher', age: 26, status: 'active', createdAt: '2024-04-12' },
  { id: 7, name: 'George Miller', age: 52, status: 'inactive', createdAt: '2023-09-30' },
];

export function QueryResults() {
  return (
    <div className="bg-surface/30 flex h-full min-h-[400px] flex-col overflow-hidden backdrop-blur-sm">
      <div className="border-border bg-background/40 flex flex-wrap items-center justify-between border-b px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="bg-accent/10 border-accent/20 rounded-xl border p-2.5">
            <ListBullets size={24} className="text-accent" weight="duotone" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-text-primary text-base font-black tracking-tighter uppercase">
              Query Inspection
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary bg-background/50 border-border rounded border px-2 py-0.5 text-[10px] font-black tracking-widest uppercase">
                7 Records Match
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-green-500 uppercase">
                <Circle size={8} weight="fill" className="animate-pulse" />
                Live Simulation
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="group relative">
            <MagnifyingGlass
              size={16}
              className="text-text-secondary group-focus-within:text-accent absolute top-1/2 left-3 -translate-y-1/2 opacity-50 transition-all group-focus-within:opacity-100"
            />
            <input
              type="text"
              placeholder="Filter results..."
              className="bg-background/50 border-border text-text-primary placeholder:text-text-secondary/50 focus:border-accent/50 focus:ring-accent/10 w-[240px] rounded-lg border py-2 pr-4 pl-10 text-xs font-bold transition-all focus:ring-4 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          <Table>
            <TableHeader className="bg-background/20 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-text-secondary py-5 pl-6 text-[10px] font-black tracking-[0.2em] uppercase">
                  Identifier
                </TableHead>
                <TableHead className="text-text-secondary py-5 text-[10px] font-black tracking-[0.2em] uppercase">
                  Display Name
                </TableHead>
                <TableHead className="text-text-secondary py-5 text-[10px] font-black tracking-[0.2em] uppercase">
                  Age
                </TableHead>
                <TableHead className="text-text-secondary py-5 text-[10px] font-black tracking-[0.2em] uppercase">
                  Current Status
                </TableHead>
                <TableHead className="text-text-secondary py-5 pr-6 text-[10px] font-black tracking-[0.2em] uppercase">
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DATA.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/50 hover:bg-accent/5 group/row transition-all"
                >
                  <TableCell className="text-text-secondary group-hover/row:text-accent py-4 pl-6 font-mono text-xs transition-colors">
                    USR-{row.id.toString().padStart(4, '0')}
                  </TableCell>
                  <TableCell className="text-text-primary py-4 text-sm font-bold">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-text-secondary py-4 text-sm font-medium">
                    {row.age}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest uppercase transition-all',
                        row.status === 'active'
                          ? 'border-green-500/20 bg-green-500/10 text-green-500 group-hover/row:border-green-500/50'
                          : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500 group-hover/row:border-yellow-500/50'
                      )}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary py-4 pr-6 font-mono text-[11px] font-bold italic opacity-60">
                    {row.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      <div className="border-border bg-background/40 flex items-center justify-between border-t px-8 py-4">
        <div className="text-text-secondary flex items-center gap-2">
          <Database size={16} weight="duotone" className="text-accent/50" />
          <span className="text-[9px] font-black tracking-[0.3em] uppercase opacity-50">
            Secure Mock Database Engine
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary text-[10px] font-black tracking-widest uppercase opacity-60">
            Showing 1-7 of 7
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              className="border-border h-7 w-7 border disabled:opacity-20"
              disabled
            >
              &lt;
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="border-border border-accent/50 text-accent h-7 w-7 border font-black"
            >
              1
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="border-border h-7 w-7 border disabled:opacity-20"
              disabled
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
