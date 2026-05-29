'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center gap-12 p-8 sm:p-20">
      <header className="flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-lg p-2">
            <div className="border-accent-foreground h-6 w-6 rounded-sm border-2" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Criteria</h1>
        </div>
      </header>

      <main className="flex w-full flex-col items-center gap-12">
        <QueryBuilder />
      </main>

      <footer className="text-text-secondary mt-auto py-8 text-sm font-medium">
        Built with Precision & Performance
      </footer>
    </div>
  );
}
