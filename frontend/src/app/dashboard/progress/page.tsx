'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ProgressDashboard from '@/components/dashboard/ProgressDashboard';

export default function ProgressDashboardPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Monitorowanie postępu</h1>
          <Link href="/dashboard">
            <Button variant="outline">Powrót do dashboardu</Button>
          </Link>
        </div>

        <ProgressDashboard />
      </div>
    </MainLayout>
  );
}
