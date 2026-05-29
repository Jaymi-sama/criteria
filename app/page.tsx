'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';
import { QueryPreview } from '@/components/query-builder/QueryPreview';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-1 flex-col gap-12 p-8 sm:p-20">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-lg p-2">
            <div className="border-accent-foreground h-6 w-6 rounded-sm border-2" />
          </div>
          <h1 className="text-text-primary text-2xl font-bold tracking-tight">Criteria</h1>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QueryBuilder />
        </div>
        <div className="h-full min-h-[500px] lg:col-span-1">
          <QueryPreview />
        </div>
      </main>

      <footer className="text-text-secondary border-border mt-auto w-full border-t py-8 text-center text-sm font-medium">
        Built with Precision & Performance
      </footer>
    </div>
  );
}
