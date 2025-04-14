'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Ustawienia</h1>

        <Tabs value={pathname} className="w-full mb-8">
          <TabsList className="mb-8">
            <Link href="/settings">
              <TabsTrigger value="/settings">Ogólne</TabsTrigger>
            </Link>
            <Link href="/settings/therapy-methods">
              <TabsTrigger value="/settings/therapy-methods">Metody terapii</TabsTrigger>
            </Link>
            <Link href="/settings/notifications">
              <TabsTrigger value="/settings/notifications">Powiadomienia</TabsTrigger>
            </Link>
            <Link href="/settings/data">
              <TabsTrigger value="/settings/data">Zarządzanie danymi</TabsTrigger>
            </Link>
            <Link href="/settings/account">
              <TabsTrigger value="/settings/account">Konto</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </MainLayout>
  );
}
