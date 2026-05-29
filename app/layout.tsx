import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Visual Query Builder',
  description: 'A highly interactive visual query builder',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', 'dark', jetbrainsMono.variable)}>
      <body className={cn('bg-background text-foreground flex min-h-full flex-col font-mono')}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
