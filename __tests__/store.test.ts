import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '@/lib/store';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state if necessary. 
    // Zustand stores usually need a manual reset in tests if they are global.
    useAppStore.setState({ count: 0 });
  });

  it('should initialize with count 0', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.count).toBe(0);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });
});
