'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ReportsList from '@/components/reports/ReportsList';

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Raporty</h1>
          <Link href="/reports/new">
            <Button>Nowy raport</Button>
          </Link>
        </div>

        <ReportsList />
      </div>
    </MainLayout>
  );
}
