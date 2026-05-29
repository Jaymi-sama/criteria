'use client';

import { useAppStore } from '@/lib/store';
import { ExampleForm } from '@/components/ExampleForm';
import { SortableList } from '@/components/SortableList';

export default function Home() {
  const { count, increment, decrement } = useAppStore();

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-12 overflow-auto bg-white px-16 py-32 sm:items-start dark:bg-black">
        <section className="w-full">
          <h2 className="mb-4 text-2xl font-bold">Zustand Store</h2>
          <div className="flex items-center gap-4 rounded border p-4 shadow">
            <button onClick={decrement} className="rounded bg-red-500 px-4 py-2 text-white">
              -
            </button>
            <span className="font-mono text-xl">{count}</span>
            <button onClick={increment} className="rounded bg-green-500 px-4 py-2 text-white">
              +
            </button>
          </div>
        </section>

        <section className="w-full">
          <h2 className="mb-4 text-2xl font-bold">React Hook Form + Zod</h2>
          <ExampleForm />
        </section>

        <section className="w-full">
          <h2 className="mb-4 text-2xl font-bold">DnD Kit Sortable List</h2>
          <SortableList />
        </section>
      </main>
    </div>
  );
}
