'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { createExercise, ExerciseInput } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

export default function NewExercisePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ExerciseInput) => {
    try {
      setIsSubmitting(true);
      const exercise = await createExercise(data);
      toast.success('Ćwiczenie zostało utworzone');
      router.push(`/exercises/${exercise._id}`);
    } catch (error) {
      console.error('Błąd podczas tworzenia ćwiczenia:', error);
      toast.error('Nie udało się utworzyć ćwiczenia');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/exercises');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/exercises">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nowe ćwiczenie</h1>
        </div>

        <ExerciseForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
}
