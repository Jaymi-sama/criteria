'use client';

import { QueryBuilder } from '@/components/query-builder/QueryBuilder';
import { QueryPreview } from '@/components/query-builder/QueryPreview';
import { QueryResults } from '@/components/query-builder/QueryResults';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { HelpModal } from '@/components/query-builder/HelpModal';
import { SplashScreen } from '@/components/ui/SplashScreen';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <SplashScreen />
      <HelpModal />
      {/* Top Header */}
      <header className="border-border bg-surface/50 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-md">
              <Image src="/criteria.svg" alt="Criteria Logo" width={40} height={40} className="size-8 sm:size-10" />
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
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 sm:gap-12 px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
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
        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">
          High Precision Query Builder &bull; Built for performance
        </p>
      </footer>
    </div>
  );
}
