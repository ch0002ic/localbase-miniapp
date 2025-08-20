'use client';

import { baseSepolia } from 'wagmi/chains';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import type { ReactNode } from 'react';
import { ToastProvider } from './components/ToastProvider';

// Full MiniKitProvider configuration
export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'base',
          name: 'LocalBase',
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <ToastProvider>
        {props.children}
      </ToastProvider>
    </MiniKitProvider>
  );
}

