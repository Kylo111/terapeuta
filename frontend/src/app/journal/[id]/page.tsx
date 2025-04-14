'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import JournalEntryDetails from '@/components/journal/JournalEntryDetails';
import { getJournalEntryById, JournalEntry } from '@/lib/api/journalApi';
import { toast } from 'react-toastify';

export default function JournalEntryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <JournalEntryDetails entry={entry} />
      </div>
    </MainLayout>
  );
}
