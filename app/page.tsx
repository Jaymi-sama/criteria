'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';
import { QueryPreview } from '@/components/query-builder/QueryPreview';
import { QueryResults } from '@/components/query-builder/QueryResults';
import { Database } from '@phosphor-icons/react/dist/ssr';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="border-border bg-surface/50 sticky top-0 z-50 w-full border-b px-8 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-accent rounded-md p-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Database size={20} weight="fill" className="text-accent-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-primary text-xl font-bold tracking-tight">Criteria</h1>
              <span className="text-text-secondary text-[10px] font-bold tracking-[0.2em] uppercase">
                Query Engine v1.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 p-8 lg:p-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Editor */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-text-primary text-2xl font-black tracking-tighter uppercase">
                Editor
              </h2>
              <p className="text-text-secondary text-sm font-medium">
                Construct recursive logic for complex data filtering.
              </p>
            </div>
            <QueryBuilder />
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-text-primary text-2xl font-black tracking-tighter uppercase">
                Preview
              </h2>
              <p className="text-text-secondary text-sm font-medium">Generated syntax output.</p>
            </div>
            <div className="sticky top-28 h-[calc(100vh-200px)] min-h-[500px]">
              <QueryPreview />
            </div>
          </div>
        </div>

        {/* Bottom Section: Results */}
        <section className="border-border flex flex-col gap-6 border-t pt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-text-primary text-2xl font-black tracking-tighter uppercase">
              Inspection
            </h2>
            <p className="text-text-secondary text-sm font-medium">
              Validate your query against live simulated data.
            </p>
          </div>
          <div className="border-border w-full overflow-hidden rounded-xl border shadow-2xl">
            <QueryResults />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border bg-surface/30 mt-auto w-full border-t py-6 text-center">
        <p className="text-text-secondary text-xs font-bold tracking-widest uppercase">
          High Precision Query Builder &bull; Built with Next.js 16
        </p>
      </footer>
    </div>
  );
}
