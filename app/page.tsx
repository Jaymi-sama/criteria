'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';
import { QueryPreview } from '@/components/query-builder/QueryPreview';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 p-8 sm:p-20 min-h-screen gap-12 bg-background">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent p-2 rounded-lg">
            <div className="w-6 h-6 border-2 border-accent-foreground rounded-sm" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Criteria</h1>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <QueryBuilder />
        </div>
        <div className="lg:col-span-1 h-full min-h-[500px]">
          <QueryPreview />
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-text-secondary text-sm font-medium border-t border-border w-full">
        Built with Precision & Performance
      </footer>
    </div>
  );
}
