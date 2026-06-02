'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useQueryStore } from '@/lib/store';
import { executeQuery } from '@/lib/query-executor';
import {
  MagnifyingGlass,
  Funnel,
  CaretUp,
  CaretDown,
  Database,
  CheckCircle,
  Warning,
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock Data Type
interface MockDataItem {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  isVerified: boolean;
}

const FULL_MOCK_DATA: MockDataItem[] = [
  { id: 1, name: 'Alice Johnson', age: 28, status: 'active', createdAt: '2023-10-01', isVerified: true },
  { id: 2, name: 'Bob Smith', age: 34, status: 'inactive', createdAt: '2023-11-15', isVerified: false },
  { id: 3, name: 'Charlie Brown', age: 22, status: 'active', createdAt: '2024-01-20', isVerified: true },
  { id: 4, name: 'Diana Prince', age: 45, status: 'pending', createdAt: '2023-09-05', isVerified: true },
  { id: 5, name: 'Edward Norton', age: 52, status: 'inactive', createdAt: '2023-12-10', isVerified: false },
  { id: 6, name: 'Fiona Gallagher', age: 19, status: 'active', createdAt: '2024-02-14', isVerified: true },
  { id: 7, name: 'George Costanza', age: 41, status: 'pending', createdAt: '2023-08-30', isVerified: false },
  { id: 8, name: 'Hannah Abbott', age: 31, status: 'active', createdAt: '2024-03-01', isVerified: true },
  { id: 9, name: 'Ian Wright', age: 58, status: 'inactive', createdAt: '2023-07-20', isVerified: true },
  { id: 10, name: 'Jenny Kim', age: 26, status: 'active', createdAt: '2024-04-12', isVerified: false },
];

type SortOrder = 'asc' | 'desc' | null;

export function QueryResults() {
  const appliedRootGroup = useQueryStore((s) => s.appliedRootGroup);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof MockDataItem | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Pagination State
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  // Fix for hydration mismatches with persistent state
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsHydrated(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleSort = (key: keyof MockDataItem) => {
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

  const { filteredData, executionError } = useMemo(() => {
    if (!isHydrated) return { filteredData: FULL_MOCK_DATA };

    const result = executeQuery(
      FULL_MOCK_DATA as unknown as Record<string, unknown>[],
      appliedRootGroup
    );

    if (result.error) {
      return { filteredData: [], executionError: result.error.message };
    }

    let results = result.data as unknown as MockDataItem[];

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
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return { filteredData: results };
  }, [appliedRootGroup, searchTerm, sortKey, sortOrder, isHydrated]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Reset page when filtering changes
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setPageIndex(0);
    });
    return () => cancelAnimationFrame(handle);
  }, [searchTerm, appliedRootGroup]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 rounded-lg p-2">
            <Database size={20} weight="duotone" className="text-accent" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-text-primary text-xs font-black uppercase tracking-widest sm:text-sm">
              Query Inspection
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="bg-green-500 h-1.5 w-1.5 rounded-full animate-pulse" />
              <span className="text-text-secondary text-[10px] font-bold uppercase opacity-60">
                Connected to Simulator
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative flex-1 sm:w-64">
            <MagnifyingGlass 
              size={16} 
              className="text-text-secondary absolute top-1/2 left-3 -translate-y-1/2 opacity-40" 
            />
            <Input
              placeholder="Search results..."
              className="bg-surface/50 border-border focus-visible:ring-accent/30 h-10 pl-10 text-xs font-bold sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Badge 
            variant="outline" 
            className="border-border bg-background/50 h-10 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest"
          >
            {filteredData.length} Matches
          </Badge>
        </div>
      </div>

      {/* Error State Overlay for Calculation Errors */}
      {executionError && (
        <div className="bg-destructive/10 border-destructive/20 flex items-center gap-4 rounded-xl border p-4 animate-in fade-in slide-in-from-top-2">
          <Warning size={24} className="text-destructive shrink-0" weight="fill" />
          <div className="flex flex-col">
            <span className="text-destructive text-xs font-black uppercase tracking-widest">Execution Error</span>
            <p className="text-text-secondary text-sm font-medium">{executionError}</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="border-border group relative overflow-hidden rounded-2xl border bg-surface/30">
        <div className="theme-scrollbar max-h-[500px] overflow-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead className="bg-background/80 border-border sticky top-0 z-10 border-b backdrop-blur-md">
              <tr>
                {[
                  { key: 'id', label: 'ID', width: 'w-16' },
                  { key: 'name', label: 'Name', width: '' },
                  { key: 'age', label: 'Age', width: 'w-20' },
                  { key: 'status', label: 'Status', width: 'w-28' },
                  { key: 'createdAt', label: 'Created', width: 'w-32' },
                  { key: 'isVerified', label: 'Verified', width: 'w-24' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key as keyof MockDataItem)}
                    className={cn(
                      'text-text-secondary cursor-pointer p-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-text-primary',
                      col.width
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <div className="flex flex-col opacity-30">
                        <CaretUp
                          size={8}
                          weight="fill"
                          className={cn(sortKey === col.key && sortOrder === 'asc' && 'text-accent opacity-100')}
                        />
                        <CaretDown
                          size={8}
                          weight="fill"
                          className={cn(sortKey === col.key && sortOrder === 'desc' && 'text-accent opacity-100')}
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Funnel size={48} weight="thin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                        {executionError ? 'Calculation blocked by error' : 'No matching results found'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-accent/5 animate-in fade-in slide-in-from-bottom-1 group/row transition-colors"
                  >
                    <td className="text-text-secondary p-4 font-mono text-[10px] font-bold opacity-50">
                      #{item.id.toString().padStart(3, '0')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/10 text-accent flex h-8 w-8 items-center justify-center rounded-lg font-black uppercase tracking-tighter shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                        <span className="text-text-primary font-bold">{item.name}</span>
                      </div>
                    </td>
                    <td className="text-text-secondary p-4 font-bold">{item.age}</td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest',
                          item.status === 'active' && 'bg-green-500/10 text-green-500',
                          item.status === 'inactive' && 'bg-destructive/10 text-destructive',
                          item.status === 'pending' && 'bg-accent/10 text-accent'
                        )}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="text-text-secondary p-4 font-mono text-[10px] font-bold opacity-60">
                      {item.createdAt}
                    </td>
                    <td className="p-4">
                      {item.isVerified ? (
                        <div className="bg-green-500/10 text-green-500 flex items-center gap-1.5 rounded-full px-2 py-0.5 w-fit">
                          <CheckCircle size={12} weight="fill" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Done</span>
                        </div>
                      ) : (
                        <div className="bg-surface border-border flex items-center gap-1.5 rounded-full border px-2 py-0.5 w-fit">
                          <Badge variant="ghost" className="h-1.5 w-1.5 rounded-full bg-slate-500 p-0" />
                          <span className="text-text-secondary text-[9px] font-bold uppercase tracking-widest opacity-40">None</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-border bg-background/40 flex items-center justify-between border-t p-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest opacity-60">
              Page {pageIndex + 1} of {totalPages || 1}
            </span>
            <span className="text-text-secondary hidden sm:inline text-[10px] font-bold uppercase tracking-widest opacity-30">
              &bull; {filteredData.length} Total Results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              className="border-border h-7 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 cursor-pointer"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="border-border h-7 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 cursor-pointer"
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageIndex >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
