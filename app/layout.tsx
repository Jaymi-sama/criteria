import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Criteria | Visual Query Builder',
  description: 'A highly interactive visual query builder',
  icons: {
    icon: '/criteria.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', jetbrainsMono.variable)} suppressHydrationWarning>
      <body className={cn('bg-background text-foreground flex min-h-full flex-col font-mono')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster position="bottom-right" expand={false} richColors theme="dark" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
