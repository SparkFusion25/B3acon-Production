// Global type declarations

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      target: string,
      parameters?: Record<string, any>
    ) => void;
  }
}

export {};