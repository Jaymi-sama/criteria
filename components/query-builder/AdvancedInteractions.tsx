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
          className="text-text-secondary hover:text-text-primary border-border h-10 gap-2 font-bold tracking-wider uppercase"
        >
          <Clock size={18} weight="duotone" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-surface border-border w-[400px] border-l p-0 shadow-2xl sm:w-[540px]">
        <SheetHeader className="border-border bg-background/40 border-b p-8 backdrop-blur-md">
          <SheetTitle className="text-text-primary flex items-center gap-3 text-2xl font-black tracking-tighter uppercase">
            <BookmarkSimple size={28} className="text-accent" weight="duotone" />
            Archive
          </SheetTitle>
          <SheetDescription className="text-text-secondary text-sm font-medium">
            Manage your persistent query presets and execution logs.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-[calc(100vh-160px)] flex-col">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-10 p-8">
              {/* Presets Section */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-text-primary flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase">
                    <span className="bg-accent h-4 w-1 rounded-full" />
                    Saved Presets
                  </h4>
                  <Badge
                    variant="outline"
                    className="border-accent/30 text-accent bg-accent/5 text-[10px] font-black"
                  >
                    3 STORED
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {MOCK_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      className="group bg-background/40 border-border hover:border-accent/40 hover:bg-accent/5 cursor-pointer rounded-xl border p-5 transition-all"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-text-primary group-hover:text-accent text-sm font-bold transition-colors">
                          {preset.name}
                        </span>
                        <div className="flex translate-x-2 gap-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-text-secondary hover:text-accent h-7 w-7"
                          >
                            <Play size={14} weight="fill" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-text-secondary hover:text-destructive h-7 w-7"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed opacity-70">
                        {preset.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="bg-border/50" />

              {/* History Section */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-text-primary flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase">
                    <span className="bg-border h-4 w-1 rounded-full" />
                    Recent Activity
                  </h4>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-text-secondary hover:text-destructive text-[10px] font-black tracking-widest uppercase"
                  >
                    Purge Logs
                  </Button>
                </div>
                <div className="flex flex-col gap-6">
                  {MOCK_HISTORY.map((item) => (
                    <div
                      key={item.id}
                      className="border-border hover:border-accent group/item relative flex flex-col gap-3 border-l py-1 pl-6 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-text-primary text-xs font-black tracking-tight uppercase">
                          {item.name}
                        </span>
                        <span className="text-text-secondary text-[10px] font-bold uppercase opacity-50">
                          {item.time}
                        </span>
                      </div>
                      <div className="relative">
                        <code className="text-text-secondary bg-background/60 border-border group-hover/item:border-accent/30 block truncate rounded-lg border p-3 font-mono text-[11px] transition-colors">
                          {item.query}
                        </code>
                      </div>
                      <Button
                        variant="link"
                        size="xs"
                        className="text-accent h-auto w-fit gap-1.5 p-0 text-[10px] font-black tracking-widest uppercase no-underline hover:underline"
                      >
                        Restore Session <ArrowSquareOut size={12} weight="bold" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="border-border bg-background/40 mt-auto border-t p-8 backdrop-blur-md">
            <Button className="bg-accent text-accent-foreground h-12 w-full font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <BookmarkSimple size={20} weight="fill" />
              Save Environment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
