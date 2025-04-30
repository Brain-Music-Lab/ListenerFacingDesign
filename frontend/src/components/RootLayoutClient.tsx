'use client'

import { VideoProvider } from '../contexts/VideoContext';
import ClientProviders from './ClientProviders';

export default function RootLayoutClient({
  children,
  className
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <body className={className}>
      <VideoProvider>
        <ClientProviders>
          {children}
        </ClientProviders>
      </VideoProvider>
    </body>
  );
}