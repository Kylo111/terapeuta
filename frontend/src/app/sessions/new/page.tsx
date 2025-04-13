'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import MainLayout from '@/components/layout/MainLayout';

// Przykładowe dane profili
const mockProfiles = [
  { _id: '1', name: 'Jan Kowalski' },
  { _id: '2', name: 'Anna Nowak' }
];

// Przykładowe dane metod terapii
const mockTherapyMethods = [
  { value: 'cbt', label: 'Terapia poznawczo-behawioralna' },
  { value: 'psychodynamic', label: 'Terapia psychodynamiczna' },
  { value: 'humanistic', label: 'Terapia humanistyczna' },
  { value: 'systemic', label: 'Terapia systemowa' },
  { value: 'solution_focused', label: 'Terapia skoncentrowana na rozwiązaniach' }
];

export default function NewSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileIdParam = searchParams.get('profileId');
  
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionData, setSessionData] = useState({
    profileId: profileIdParam || '',
    therapyMethod: '',
    initialMessage: '',
    mood: 5
  });

  useEffect(() => {
    // Tutaj będzie pobieranie profili z API
    // Na razie używamy przykładowych danych
    setTimeout(() => {
      setProfiles(mockProfiles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData({
      ...sessionData,
      [name]: value
    });
  };

  const handleStartSession = async () => {
    setIsStarting(true);
    
    try {
      // Tutaj będzie tworzenie nowej sesji przez API
      // Na razie symulujemy opóźnienie i przekierowujemy do fikcyjnej sesji
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Przekierowanie do nowej sesji
      router.push('/sessions/new-session-id');
    } catch (error) {
      console.error('Błąd podczas tworzenia sesji:', error);
      setIsStarting(false);
    }
  };

  const isFormValid = sessionData.profileId && sessionData.therapyMethod;

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Nowa sesja</h1>
            <p className="text-gray-600 mt-2">
              Rozpocznij nową sesję terapeutyczną
            </p>
          </div>
          <Link href="/sessions">
            <Button variant="outline">Wróć do listy sesji</Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Konfiguracja sesji</CardTitle>
            <CardDescription>
              Wybierz profil i metodę terapii, aby rozpocząć nową sesję
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Ładowanie danych...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <Select
                  label="Profil"
                  name="profileId"
                  value={sessionData.profileId}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Wybierz profil' },
                    ...profiles.map(profile => ({
                      value: profile._id,
                      label: profile.name
                    }))
                  ]}
                />
                
                <Select
                  label="Metoda terapii"
                  name="therapyMethod"
                  value={sessionData.therapyMethod}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Wybierz metodę terapii' },
                    ...mockTherapyMethods
                  ]}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jak się dzisiaj czujesz? (1-10)
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">1</span>
                    <input
                      type="range"
                      name="mood"
                      min="1"
                      max="10"
                      value={sessionData.mood}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">10</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-sm font-medium">{sessionData.mood}</span>
                  </div>
                </div>
                
                <Textarea
                  label="Wiadomość początkowa (opcjonalnie)"
                  name="initialMessage"
                  value={sessionData.initialMessage}
                  onChange={handleInputChange}
                  placeholder="Opisz, co chciałbyś omówić podczas tej sesji..."
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleStartSession}
              disabled={!isFormValid || isStarting || isLoading}
            >
              {isStarting ? 'Rozpoczynanie...' : 'Rozpocznij sesję'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
