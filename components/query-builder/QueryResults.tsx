'use client';

import React, { useMemo, useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ListBullets,
  Database,
  Circle,
  MagnifyingGlass,
  CaretUp,
  CaretDown,
  CaretUpDown,
} from '@phosphor-icons/react';

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

type SortKey = keyof MockDataItem;
type SortOrder = 'asc' | 'desc' | null;

function SortIcon({ 
  column, 
  activeSortKey, 
  sortOrder 
}: { 
  column: SortKey; 
  activeSortKey: SortKey | null; 
  sortOrder: SortOrder 
}) {
  if (activeSortKey !== column) return <CaretUpDown size={12} className="opacity-20 sm:size-3.5" />;
  return sortOrder === 'asc' ? (
    <CaretUp size={12} className="text-accent sm:size-3.5" weight="bold" />
  ) : (
    <CaretDown size={12} className="text-accent sm:size-3.5" weight="bold" />
  );
}

export function QueryResults() {
  const { appliedRootGroup } = useQueryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortKey(null);
        setSortOrder(null);
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredData = useMemo(() => {
    if (!isHydrated) return FULL_MOCK_DATA;

    let results = executeQuery(
      FULL_MOCK_DATA as unknown as Record<string, unknown>[],
      appliedRootGroup
    ) as unknown as MockDataItem[];

    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toString().includes(searchTerm)
      );
    }

    if (sortKey && sortOrder) {
      results = [...results].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [appliedRootGroup, searchTerm, isHydrated, sortKey, sortOrder]);

  if (!isHydrated) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center bg-surface/30 backdrop-blur-sm">
        <Circle size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface/30 backdrop-blur-sm overflow-hidden min-h-[400px]">
      <div className="flex flex-wrap items-center justify-between px-3 py-4 sm:px-8 sm:py-6 border-b border-border bg-background/40 gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="p-1.5 bg-accent/10 rounded-xl border border-accent/20 sm:p-2.5">
            <ListBullets size={18} className="text-accent sm:size-6" weight="duotone" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-tighter sm:text-base">
              Inspection
            </h3>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-text-secondary bg-background/50 border-border rounded border px-1 py-0.5 text-[8px] font-black uppercase tracking-widest sm:text-[10px] sm:px-2">
                {filteredData.length} Matches
              </span>
              <span className="text-green-500 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest sm:text-[10px]">
                <Circle size={6} weight="fill" className="animate-pulse" />
                <span className="hidden xs:inline">Live</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end min-w-[140px] sm:min-w-[200px]">
          <div className="group relative w-full sm:w-[240px]">
            <MagnifyingGlass
              size={12}
              className="text-text-secondary absolute top-1/2 left-2.5 -translate-y-1/2 transition-all opacity-50 group-focus-within:text-accent group-focus-within:opacity-100 sm:size-4 sm:left-3"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="bg-background/50 border-border text-text-primary placeholder:text-text-secondary/50 h-8 w-full rounded-lg border pl-8 pr-3 text-[10px] font-bold transition-all focus:border-accent/50 focus:ring-4 focus:ring-accent/10 focus:outline-none sm:h-10 sm:pl-10 sm:pr-4 sm:text-xs"
            />
          </div>
        </div>
      </div>

      <div className="theme-scrollbar flex-1 overflow-auto">
        <div className="min-w-[600px] px-2 pb-4 sm:px-4">
          <Table>
            <TableHeader className="bg-background/20 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead
                  className="py-4 pl-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary cursor-pointer hover:text-text-primary transition-colors sm:py-5 sm:pl-6 sm:text-[10px]"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    ID <SortIcon column="id" activeSortKey={sortKey} sortOrder={sortOrder} />
                  </div>
                </TableHead>
                <TableHead
                  className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary cursor-pointer hover:text-text-primary transition-colors sm:py-5 sm:text-[10px]"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name <SortIcon column="name" activeSortKey={sortKey} sortOrder={sortOrder} />
                  </div>
                </TableHead>
                <TableHead
                  className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary cursor-pointer hover:text-text-primary transition-colors sm:py-5 sm:text-[10px]"
                  onClick={() => handleSort('age')}
                >
                  <div className="flex items-center gap-2">
                    Age <SortIcon column="age" activeSortKey={sortKey} sortOrder={sortOrder} />
                  </div>
                </TableHead>
                <TableHead
                  className="py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary cursor-pointer hover:text-text-primary transition-colors sm:py-5 sm:text-[10px]"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status <SortIcon column="status" activeSortKey={sortKey} sortOrder={sortOrder} />
                  </div>
                </TableHead>
                <TableHead
                  className="py-4 pr-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary cursor-pointer hover:text-text-primary transition-colors sm:py-5 sm:pr-6 sm:text-[10px]"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Timestamp <SortIcon column="createdAt" activeSortKey={sortKey} sortOrder={sortOrder} />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                      <Database size={40} weight="duotone" className="sm:size-12" />
                      <p className="text-xs font-bold uppercase tracking-widest sm:text-sm">
                        No Matches Found
                      </p>
                      <p className="text-[10px] sm:text-xs">Adjust your query logic</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/50 hover:bg-accent/5 group/row transition-all"
                  >
                    <TableCell className="text-text-secondary py-3 pl-4 font-mono text-[10px] group-hover/row:text-accent transition-colors sm:py-4 sm:pl-6 sm:text-xs">
                      #{row.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="text-text-primary py-3 text-xs font-bold sm:py-4 sm:text-sm">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-text-secondary py-3 text-xs font-medium sm:py-4 sm:text-sm">
                      {row.age}
                    </TableCell>
                    <TableCell className="py-3 sm:py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest transition-all sm:px-2 sm:text-[9px]',
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
                    <TableCell className="text-text-secondary py-3 pr-4 font-mono text-[10px] font-bold italic opacity-60 sm:py-4 sm:pr-6 sm:text-[11px]">
                      {row.createdAt}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border-border bg-background/40 flex items-center justify-between border-t px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex items-center gap-2 text-text-secondary">
          <Database size={14} weight="duotone" className="text-accent/50 sm:size-4" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50 sm:text-[9px] sm:tracking-[0.3em]">
            Mock DB <span className="hidden xs:inline">v1.0</span>
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest opacity-60 sm:text-[10px]">
            {filteredData.length} of {FULL_MOCK_DATA.length}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              className="border-border h-6 w-6 border disabled:opacity-20 sm:h-7 sm:w-7"
              disabled
            >
              &lt;
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="border-border border-accent/50 text-accent h-6 w-6 border font-black sm:h-7 sm:w-7"
            >
              1
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="border-border h-6 w-6 border disabled:opacity-20 sm:h-7 sm:w-7"
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
