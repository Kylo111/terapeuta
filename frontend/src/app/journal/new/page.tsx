'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import { createJournalEntry, JournalEntryInput } from '@/lib/api/journalApi';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: JournalEntryInput) => {
    try {
      setIsSubmitting(true);
      const entry = await createJournalEntry(data);
      toast.success('Wpis został utworzony');
      router.push(`/journal/${entry._id}`);
    } catch (error) {
      console.error('Błąd podczas tworzenia wpisu:', error);
      toast.error('Nie udało się utworzyć wpisu');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/journal');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/journal">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nowy wpis w dzienniku</h1>
        </div>

        <JournalEntryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
}
