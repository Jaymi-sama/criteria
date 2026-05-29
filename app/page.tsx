'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center p-8 sm:p-20 min-h-screen gap-12">
      <header className="w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent p-2 rounded-lg">
            <div className="w-6 h-6 border-2 border-accent-foreground rounded-sm" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Criteria</h1>
        </div>
      </header>

      <main className="w-full flex flex-col gap-12 items-center">
        <QueryBuilder />
      </main>

      <footer className="mt-auto py-8 text-text-secondary text-sm font-medium">
        Built with Precision & Performance
      </footer>
    </div>
  );
}
