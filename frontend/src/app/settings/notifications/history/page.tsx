'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotificationsHistoryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Historia powiadomień</h1>
          <Link href="/settings/notifications">
            <Button variant="outline">Wróć do ustawień powiadomień</Button>
          </Link>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-8">
            <Link href="/settings">
              <TabsTrigger value="general">Ogólne</TabsTrigger>
            </Link>
            <Link href="/settings/therapy-methods">
              <TabsTrigger value="therapy-methods">Metody terapii</TabsTrigger>
            </Link>
            <Link href="/settings/notifications">
              <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
            </Link>
            <Link href="/settings/notifications/history">
              <TabsTrigger value="history">Historia powiadomień</TabsTrigger>
            </Link>
            <Link href="/settings/account">
              <TabsTrigger value="account">Konto</TabsTrigger>
            </Link>
          </TabsList>
          <TabsContent value="history" className="space-y-4">
            <NotificationHistory />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
