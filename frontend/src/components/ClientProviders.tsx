'use client'

import { VideoProvider } from '../contexts/VideoContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VideoProvider>
      {children}
    </VideoProvider>
  );
}