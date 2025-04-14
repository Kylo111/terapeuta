'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ExerciseDetails from '@/components/exercises/ExerciseDetails';
import { getExerciseById, Exercise, deleteExercise } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/AlertDialog';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

export default function ExerciseDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExercise();
  }, [params.id]);

  const fetchExercise = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getExerciseById(params.id);
      setExercise(data);
    } catch (err) {
      console.error('Błąd pobierania ćwiczenia:', err);
      setError('Nie udało się pobrać ćwiczenia');
      toast.error('Nie udało się pobrać ćwiczenia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseUpdated = (updatedExercise: Exercise) => {
    setExercise(updatedExercise);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteExercise(params.id);
      toast.success('Ćwiczenie zostało usunięte');
      router.push('/exercises');
    } catch (error) {
      console.error('Błąd podczas usuwania ćwiczenia:', error);
      toast.error('Nie udało się usunąć ćwiczenia');
      setIsDeleting(false);
    }
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/exercises">
              <Button variant="outline" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{exercise.name}</h1>
          </div>
          
          {!exercise.isDefault && (
            <div className="flex space-x-2">
              <Link href={`/exercises/edit/${exercise._id}`}>
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edytuj
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Usuwanie...' : 'Usuń'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Czy na pewno chcesz usunąć to ćwiczenie?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ta akcja jest nieodwracalna. Ćwiczenie zostanie trwale usunięte z systemu.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anuluj</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Usuń
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <ExerciseDetails 
          exercise={exercise} 
          onExerciseUpdated={handleExerciseUpdated} 
        />
      </div>
    </MainLayout>
  );
}
