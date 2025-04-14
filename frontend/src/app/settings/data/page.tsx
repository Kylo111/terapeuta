'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import MainLayout from '@/components/layout/MainLayout';
import ExportData from '@/components/export/ExportData';
import ImportData from '@/components/export/ImportData';

export default function DataManagementPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Zarządzanie danymi</h1>
          <Link href="/settings">
            <Button variant="outline">Powrót do ustawień</Button>
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Zarządzaj swoimi danymi w aplikacji. Możesz wyeksportować swoje dane do różnych formatów lub zaimportować dane z pliku JSON.
          </p>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="export">Eksport danych</TabsTrigger>
            <TabsTrigger value="import">Import danych</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export">
            <ExportData />
          </TabsContent>
          
          <TabsContent value="import">
            <ImportData />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
