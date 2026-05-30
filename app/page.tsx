'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';
import { QueryPreview } from '@/components/query-builder/QueryPreview';
import { QueryResults } from '@/components/query-builder/QueryResults';
import { Database } from '@phosphor-icons/react/dist/ssr';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="border-border bg-surface/50 sticky top-0 z-50 w-full border-b px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-accent rounded-md p-1.5 sm:p-2">
              <Database size={18} weight="fill" className="text-accent-foreground sm:size-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-primary text-lg font-bold tracking-tight sm:text-xl">Criteria</h1>
              <span className="text-text-secondary text-[9px] font-bold tracking-[0.2em] uppercase sm:text-[10px]">
                Query Engine v1.0
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 sm:gap-12 p-4 sm:p-8 lg:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Editor */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-8">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-text-primary text-xl font-black tracking-tighter uppercase sm:text-2xl">
                Editor
              </h2>
              <p className="text-text-secondary text-xs font-medium sm:text-sm">
                Construct recursive logic for complex data filtering.
              </p>
            </div>
            <QueryBuilder />
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-4">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h2 className="text-text-primary text-xl font-black tracking-tighter uppercase sm:text-2xl">
                Preview
              </h2>
              <p className="text-text-secondary text-xs font-medium sm:text-sm">Generated syntax output.</p>
            </div>
            <div className="lg:sticky lg:top-28 h-fit lg:h-[calc(100vh-200px)] min-h-[400px] sm:min-h-[500px]">
              <QueryPreview />
            </div>
          </div>
        </div>

        {/* Bottom Section: Results */}
        <section className="border-border flex flex-col gap-4 sm:gap-6 border-t pt-8 sm:pt-10">
          <div className="flex flex-col gap-1 sm:gap-2">
            <h2 className="text-text-primary text-xl font-black tracking-tighter uppercase sm:text-2xl">
              Inspection
            </h2>
            <p className="text-text-secondary text-xs font-medium sm:text-sm">
              Validate your query against live simulated data.
            </p>
          </div>
          <div className="border-border w-full overflow-hidden rounded-xl border">
            <QueryResults />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border mt-auto w-full border-t bg-surface/30 py-6 text-center">
        <p className="text-text-secondary text-xs font-bold tracking-widest uppercase">
          High Precision Query Builder &bull; Built with Next.js 16
        </p>
      </footer>
    </div>
  );
}
