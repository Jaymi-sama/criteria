'use client';

import React, { useMemo } from 'react';
import { useQueryStore } from '@/lib/store';
import { executeQuery } from '@/lib/query-executor';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListBullets, Database, Circle, MagnifyingGlass } from '@phosphor-icons/react';

interface MockDataItem {
  id: number;
  name: string;
  age: number;
  status: string;
  createdAt: string;
}

const FULL_MOCK_DATA: MockDataItem[] = [
  { id: 1, name: 'Alice Johnson', age: 28, status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Bob Smith', age: 34, status: 'inactive', createdAt: '2023-11-20' },
  { id: 3, name: 'Charlie Davis', age: 22, status: 'pending', createdAt: '2024-02-05' },
  { id: 4, name: 'Diana Prince', age: 31, status: 'active', createdAt: '2024-03-10' },
  { id: 5, name: 'Ethan Hunt', age: 45, status: 'active', createdAt: '2023-12-01' },
  { id: 6, name: 'Fiona Gallagher', age: 26, status: 'active', createdAt: '2024-04-12' },
  { id: 7, name: 'George Miller', age: 52, status: 'inactive', createdAt: '2023-09-30' },
  { id: 8, name: 'Hannah Abbott', age: 19, status: 'active', createdAt: '2024-05-01' },
  { id: 9, name: 'Ian Wright', age: 41, status: 'pending', createdAt: '2023-10-15' },
  { id: 10, name: 'Julia Roberts', age: 37, status: 'active', createdAt: '2024-02-28' },
  { id: 11, name: 'Kevin Hart', age: 29, status: 'inactive', createdAt: '2024-01-10' },
  { id: 12, name: 'Laura Palmer', age: 24, status: 'active', createdAt: '2023-12-25' },
  { id: 13, name: 'Mike Ross', age: 33, status: 'pending', createdAt: '2024-03-22' },
];

export function QueryResults() {
  const { appliedRootGroup } = useQueryStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = useMemo(() => {
    // Cast dataset to unknown[] to match executeQuery signature
    const results = executeQuery(
      FULL_MOCK_DATA as unknown as Record<string, unknown>[],
      appliedRootGroup
    );
    
    // Cast results back to MockDataItem[] for safe property access
    const typedResults = results as unknown as MockDataItem[];
    
    if (!searchTerm) return typedResults;

    return typedResults.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm)
    );
  }, [appliedRootGroup, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-surface/30 backdrop-blur-sm overflow-hidden min-h-[400px]">
      <div className="flex flex-wrap items-center justify-between px-8 py-6 border-b border-border bg-background/40">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20">
            <ListBullets size={24} className="text-accent" weight="duotone" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-black text-text-primary uppercase tracking-tighter">Query Inspection</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest bg-background/50 px-2 py-0.5 rounded border border-border">
                {filteredData.length} Records Match
              </span>
              <span className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                <Circle size={8} weight="fill" className="animate-pulse" />
                Live Simulation
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 group-focus-within:text-accent group-focus-within:opacity-100 transition-all" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter results..."
                className="bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 text-xs font-bold text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all w-[240px]"
              />
           </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          <Table>
            <TableHeader className="bg-background/20 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary py-5 pl-6">Identifier</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary py-5">Display Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary py-5">Age</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary py-5">Current Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary py-5 pr-6">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                      <Database size={48} weight="duotone" />
                      <p className="text-sm font-bold uppercase tracking-widest">No Matches Found</p>
                      <p className="text-xs">Adjust your query logic to see results</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow key={row.id} className="border-border/50 hover:bg-accent/5 transition-all group/row">
                    <TableCell className="font-mono text-xs text-text-secondary py-4 pl-6 group-hover/row:text-accent transition-colors">
                      USR-{row.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-text-primary py-4">{row.name}</TableCell>
                    <TableCell className="text-sm font-medium text-text-secondary py-4">{row.age}</TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest transition-all",
                          row.status === 'active' 
                            ? 'border-green-500/20 bg-green-500/10 text-green-500 group-hover/row:border-green-500/50' 
                            : row.status === 'inactive'
                            ? 'border-red-500/20 bg-red-500/10 text-red-500 group-hover/row:border-red-500/50'
                            : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500 group-hover/row:border-yellow-500/50'
                        )}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-text-secondary py-4 pr-6 opacity-60 font-mono italic">
                      {row.createdAt}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>

      <div className="px-8 py-4 border-t border-border bg-background/40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <Database size={16} weight="duotone" className="text-accent/50" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Secure Mock Database Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest opacity-60">
            Showing {filteredData.length} of {FULL_MOCK_DATA.length}
          </span>
          <div className="flex gap-1">
             <Button variant="ghost" size="icon-xs" className="h-7 w-7 border border-border disabled:opacity-20" disabled>&lt;</Button>
             <Button variant="ghost" size="icon-xs" className="h-7 w-7 border border-border border-accent/50 text-accent font-black">1</Button>
             <Button variant="ghost" size="icon-xs" className="h-7 w-7 border border-border disabled:opacity-20" disabled>&gt;</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
