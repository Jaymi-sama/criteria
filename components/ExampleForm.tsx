'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded border p-4 shadow">
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          {...register('username')}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
        />
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
      </div>
      <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
        Submit
      </button>
    </form>
  );
}
