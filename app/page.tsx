import { FileText } from '@phosphor-icons/react/dist/ssr';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-6 text-center">
        <FileText size={64} className="text-accent" weight="duotone" />
        <h1 className="text-text-primary text-3xl font-semibold tracking-tight">
          Visual Query Builder
        </h1>
        <p className="text-text-secondary max-w-md text-lg">Configure complex queries visually.</p>
      </main>
    </div>
  );
}
