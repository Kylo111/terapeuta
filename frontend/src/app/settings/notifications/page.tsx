'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NotificationsSettingsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ustawienia powiadomień</h1>
          <Link href="/settings/notifications/history">
            <Button variant="outline">Historia powiadomień</Button>
          </Link>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
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
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
