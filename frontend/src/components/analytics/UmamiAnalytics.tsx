'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface UmamiAnalyticsProps {
  websiteId: string;
  umamiUrl: string;
}

export default function UmamiAnalytics({ websiteId, umamiUrl }: UmamiAnalyticsProps) {
  // Sprawdzenie, czy jesteśmy w środowisku produkcyjnym
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction || !websiteId || !umamiUrl) {
    return null;
  }

  return (
    <Script
      async
      defer
      data-website-id={websiteId}
      src={`${umamiUrl}/script.js`}
      strategy="afterInteractive"
    />
  );
}
