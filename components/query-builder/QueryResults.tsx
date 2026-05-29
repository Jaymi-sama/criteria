'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListBullets, Database, Circle } from '@phosphor-icons/react';

const MOCK_DATA = [
  { id: 1, name: 'Alice Johnson', age: 28, status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Bob Smith', age: 34, status: 'inactive', createdAt: '2023-11-20' },
  { id: 3, name: 'Charlie Davis', age: 22, status: 'pending', createdAt: '2024-02-05' },
  { id: 4, name: 'Diana Prince', age: 31, status: 'active', createdAt: '2024-03-10' },
  { id: 5, name: 'Ethan Hunt', age: 45, status: 'active', createdAt: '2023-12-01' },
];

export function QueryResults() {
  return (
    <div className="bg-surface border-border flex h-full max-h-[400px] w-full flex-col gap-4 overflow-hidden rounded-xl border shadow-lg">
      <div className="border-border bg-background/30 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <ListBullets size={20} className="text-accent" weight="duotone" />
          <div className="flex flex-col">
            <h3 className="text-text-primary text-sm font-bold tracking-wider uppercase">
              Results
            </h3>
            <span className="text-text-secondary text-[10px] font-medium">5 matches found</span>
          </div>
        </div>

        <div className="bg-background/50 border-border flex items-center gap-2 rounded-full border px-3 py-1">
          <Circle size={8} weight="fill" className="animate-pulse text-green-500" />
          <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">
            Simulated Data
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader className="bg-background/20 sticky top-0 z-10">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-text-secondary w-[80px] text-[11px] font-bold tracking-wider uppercase">
                ID
              </TableHead>
              <TableHead className="text-text-secondary text-[11px] font-bold tracking-wider uppercase">
                Name
              </TableHead>
              <TableHead className="text-text-secondary text-[11px] font-bold tracking-wider uppercase">
                Age
              </TableHead>
              <TableHead className="text-text-secondary text-[11px] font-bold tracking-wider uppercase">
                Status
              </TableHead>
              <TableHead className="text-text-secondary text-[11px] font-bold tracking-wider uppercase">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DATA.map((row) => (
              <TableRow
                key={row.id}
                className="border-border hover:bg-background/40 transition-colors"
              >
                <TableCell className="text-text-secondary font-mono text-xs">#{row.id}</TableCell>
                <TableCell className="text-text-primary text-sm font-medium">{row.name}</TableCell>
                <TableCell className="text-text-secondary text-sm">{row.age}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      row.status === 'active'
                        ? 'border-green-500/30 bg-green-500/10 text-[10px] font-bold text-green-500 uppercase'
                        : 'border-yellow-500/30 bg-yellow-500/10 text-[10px] font-bold text-yellow-500 uppercase'
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-xs">{row.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="border-border bg-background/30 flex items-center justify-between border-t px-6 py-3">
        <div className="text-text-secondary flex items-center gap-2">
          <Database size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">Mock Storage v1.0</span>
        </div>
        <span className="text-text-secondary text-[10px] font-medium">Page 1 of 1</span>
      </div>
    </div>
  );
}
