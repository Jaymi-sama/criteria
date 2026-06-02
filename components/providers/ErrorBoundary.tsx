'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Warning, ArrowsCounterClockwise } from '@phosphor-icons/react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in zoom-in-95">
          <div className="bg-destructive/10 rounded-full p-4">
            <Warning size={48} className="text-destructive" weight="duotone" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-text-primary text-xl font-black uppercase tracking-tighter sm:text-2xl">
              System Interrupted
            </h2>
            <p className="text-text-secondary max-w-md text-sm font-medium">
              A critical error occurred in the recursive rendering engine. This is usually caused by malformed query state.
            </p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem('criteria-query-storage');
              window.location.reload();
            }}
            variant="destructive"
            className="h-11 gap-2 px-8 font-black uppercase tracking-widest shadow-xl"
          >
            <ArrowsCounterClockwise size={20} weight="bold" />
            Reset & Recover
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
