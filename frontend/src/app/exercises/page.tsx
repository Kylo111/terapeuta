'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import MainLayout from '@/components/layout/MainLayout';
import ExercisesList from '@/components/exercises/ExercisesList';
import ExerciseStats from '@/components/exercises/ExerciseStats';
import { getExerciseStats, initializeDefaultExercises } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';

export default function ExercisesPage() {
  const [activeTab, setActiveTab] = useState('exercises');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const statsData = await getExerciseStats();
      setStats(statsData);
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk:', error);
      toast.error('Nie udało się pobrać statystyk ćwiczeń');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeExercises = async () => {
    try {
      setIsInitializing(true);
      await initializeDefaultExercises();
      toast.success('Domyślne ćwiczenia zostały zainicjalizowane');
      // Odśwież stronę, aby pokazać nowe ćwiczenia
      window.location.reload();
    } catch (error) {
      console.error('Błąd podczas inicjalizacji ćwiczeń:', error);
      toast.error('Nie udało się zainicjalizować domyślnych ćwiczeń');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ćwiczenia terapeutyczne</h1>
            <p className="text-gray-600 mt-2">
              Odkryj i praktykuj różnorodne ćwiczenia terapeutyczne, które pomogą Ci w rozwoju osobistym.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/exercises/new">
              <Button>
                Dodaj nowe ćwiczenie
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleInitializeExercises}
              disabled={isInitializing}
            >
              {isInitializing ? 'Inicjalizowanie...' : 'Inicjalizuj domyślne ćwiczenia'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="exercises">Ćwiczenia</TabsTrigger>
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exercises">
            <ExercisesList />
          </TabsContent>
          
          <TabsContent value="stats">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Ładowanie statystyk...</span>
              </div>
            ) : stats ? (
              <ExerciseStats stats={stats} />
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Nie udało się załadować statystyk.</p>
                <Button onClick={fetchStats} className="mt-4">
                  Spróbuj ponownie
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
