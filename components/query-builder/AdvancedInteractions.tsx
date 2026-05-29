'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Clock, BookmarkSimple, Trash, Play, ArrowSquareOut } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const MOCK_HISTORY = [
  {
    id: '1',
    name: 'Active Users in Nigeria',
    time: '2 mins ago',
    query: 'age > 18 AND country = "Nigeria"',
  },
  {
    id: '2',
    name: 'Premium Subscribers',
    time: '1 hour ago',
    query: 'status = "active" AND purchases > 10',
  },
  {
    id: '3',
    name: 'Pending Approvals',
    time: 'Yesterday',
    query: 'status = "pending" OR isVerified = false',
  },
];

const MOCK_PRESETS = [
  { id: 'p1', name: 'Basic User Filter', description: 'Filters by name and age range' },
  { id: 'p2', name: 'Churn Risk Analysis', description: 'Identifies users with low activity' },
  { id: 'p3', name: 'Verification Audit', description: 'Checks document status and email' },
];

export function AdvancedInteractions() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-text-secondary hover:text-text-primary border-border h-9 gap-2"
        >
          <Clock size={18} weight="duotone" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-surface border-border w-[400px] border-l p-0 sm:w-[540px]">
        <SheetHeader className="border-border bg-background/30 border-b p-6">
          <SheetTitle className="text-text-primary flex items-center gap-2 text-xl font-bold">
            <BookmarkSimple size={24} className="text-accent" weight="duotone" />
            Saved & History
          </SheetTitle>
          <SheetDescription className="text-text-secondary">
            Manage your saved query presets and execution history.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-[calc(100vh-140px)] flex-col">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-8 p-6">
              {/* Presets Section */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-text-primary text-xs font-bold tracking-widest uppercase">
                    Saved Presets
                  </h4>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    3 SAVED
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {MOCK_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className="group bg-background/50 border-border hover:border-accent/50 rounded-lg border p-4 transition-all"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-text-primary text-sm font-bold">{preset.name}</span>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-text-secondary hover:text-accent"
                          >
                            <Play size={14} weight="fill" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-text-secondary hover:text-destructive"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-text-secondary text-xs">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-border" />

              {/* History Section */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-text-primary text-xs font-bold tracking-widest uppercase">
                    Recent Execution
                  </h4>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-text-secondary hover:text-destructive text-[10px] font-bold uppercase"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  {MOCK_HISTORY.map((item) => (
                    <div
                      key={item.id}
                      className="border-border hover:border-accent relative flex flex-col gap-2 border-l-2 py-1 pl-4 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-text-primary text-xs font-bold">{item.name}</span>
                        <span className="text-text-secondary text-[10px]">{item.time}</span>
                      </div>
                      <code className="text-text-secondary bg-background/80 border-border truncate rounded border p-2 font-mono text-[11px]">
                        {item.query}
                      </code>
                      <Button
                        variant="link"
                        size="xs"
                        className="text-accent h-auto w-fit gap-1 p-0 text-[10px] no-underline hover:underline"
                      >
                        Restore <ArrowSquareOut size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="border-border bg-background/30 mt-auto border-t p-6">
            <Button className="bg-accent text-accent-foreground h-11 w-full gap-2 font-bold">
              <BookmarkSimple size={18} weight="fill" />
              Save Current Query
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
