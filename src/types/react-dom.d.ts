declare module 'react-dom/client' {
  import type { Container } from 'react-dom';
  import type { ReactNode } from 'react';

  export function createRoot(
    container: Container | null,
    options?: { hydrate?: boolean }
  ): {
    render(children: ReactNode): void;
    unmount(): void;
  };
} 