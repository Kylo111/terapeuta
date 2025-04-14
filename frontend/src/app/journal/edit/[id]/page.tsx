'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import { getJournalEntryById, updateJournalEntry, JournalEntryInput } from '@/lib/api/journalApi';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

export default function EditJournalEntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [entry, setEntry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntry();
  }, [params.id]);

  const fetchEntry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getJournalEntryById(params.id);
      setEntry(data);
    } catch (err) {
      console.error('Błąd pobierania wpisu:', err);
      setError('Nie udało się pobrać wpisu');
      toast.error('Nie udało się pobrać wpisu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: JournalEntryInput) => {
    try {
      setIsSubmitting(true);
      await updateJournalEntry(params.id, data);
      toast.success('Wpis został zaktualizowany');
      router.push(`/journal/${params.id}`);
    } catch (error) {
      console.error('Błąd podczas aktualizacji wpisu:', error);
      toast.error('Nie udało się zaktualizować wpisu');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/journal/${params.id}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie wpisu...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !entry) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Nie znaleziono wpisu'}
          </div>
          <Link href="/journal">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót do dziennika
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href={`/journal/${params.id}`}>
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edycja wpisu w dzienniku</h1>
        </div>

        <JournalEntryForm
          initialData={entry}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
}
