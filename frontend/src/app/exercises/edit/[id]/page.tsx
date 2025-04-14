'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { getExerciseById, updateExercise, ExerciseInput } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

export default function EditExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercise();
  }, [params.id]);

  const fetchExercise = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getExerciseById(params.id);
      
      // Sprawdź, czy ćwiczenie jest domyślne
      if (data.isDefault) {
        toast.error('Nie można edytować domyślnego ćwiczenia');
        router.push(`/exercises/${params.id}`);
        return;
      }
      
      setExercise(data);
    } catch (err) {
      console.error('Błąd pobierania ćwiczenia:', err);
      setError('Nie udało się pobrać ćwiczenia');
      toast.error('Nie udało się pobrać ćwiczenia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ExerciseInput) => {
    try {
      setIsSubmitting(true);
      await updateExercise(params.id, data);
      toast.success('Ćwiczenie zostało zaktualizowane');
      router.push(`/exercises/${params.id}`);
    } catch (error) {
      console.error('Błąd podczas aktualizacji ćwiczenia:', error);
      toast.error('Nie udało się zaktualizować ćwiczenia');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/exercises/${params.id}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie ćwiczenia...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !exercise) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Nie znaleziono ćwiczenia'}
          </div>
          <Link href="/exercises">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót do ćwiczeń
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
          <Link href={`/exercises/${params.id}`}>
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edycja ćwiczenia</h1>
        </div>

        <ExerciseForm
          initialData={exercise}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
}
