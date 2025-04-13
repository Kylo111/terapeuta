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
import { getProfiles, Profile as ProfileType } from '@/lib/api/profilesApi';
import { createSession, CreateSessionData } from '@/lib/api/sessionsApi';
import { getTherapyMethods, TherapyMethod } from '@/lib/api/therapyApi';
import { toast } from 'react-toastify';

export default function NewSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileIdParam = searchParams.get('profileId');

  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [therapyMethods, setTherapyMethods] = useState<TherapyMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<CreateSessionData>({
    profileId: profileIdParam || '',
    therapyMethod: '',
    emotionalStateStart: {
      anxiety: 5,
      depression: 5,
      optimism: 5
    }
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Pobieranie profili
      const profilesData = await getProfiles();
      setProfiles(profilesData);

      // Pobieranie metod terapii
      const methodsData = await getTherapyMethods();
      setTherapyMethods(methodsData);

      setError(null);
    } catch (err) {
      setError('Błąd pobierania danych');
      console.error('Błąd pobierania danych:', err);
      toast.error('Nie udało się pobrać danych');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'anxiety' || name === 'depression' || name === 'optimism') {
      setSessionData({
        ...sessionData,
        emotionalStateStart: {
          ...sessionData.emotionalStateStart,
          [name]: parseInt(value)
        }
      });
    } else {
      setSessionData({
        ...sessionData,
        [name]: value
      });
    }
  };

  const handleStartSession = async () => {
    setIsStarting(true);

    try {
      // Tworzenie nowej sesji przez API
      const newSession = await createSession(sessionData);

      // Przekierowanie do nowej sesji
      toast.success('Sesja została utworzona');
      router.push(`/sessions/${newSession._id}`);
    } catch (error) {
      console.error('Błąd podczas tworzenia sesji:', error);
      toast.error('Nie udało się utworzyć sesji');
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
                    ...therapyMethods.map(method => ({
                      value: method.methodName,
                      label: method.displayName
                    }))
                  ]}
                />

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poziom lęku (0-10)
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">0</span>
                      <input
                        type="range"
                        name="anxiety"
                        min="0"
                        max="10"
                        value={sessionData.emotionalStateStart.anxiety}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">10</span>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-medium">{sessionData.emotionalStateStart.anxiety}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poziom depresji (0-10)
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">0</span>
                      <input
                        type="range"
                        name="depression"
                        min="0"
                        max="10"
                        value={sessionData.emotionalStateStart.depression}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">10</span>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-medium">{sessionData.emotionalStateStart.depression}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poziom optymizmu (0-10)
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">0</span>
                      <input
                        type="range"
                        name="optimism"
                        min="0"
                        max="10"
                        value={sessionData.emotionalStateStart.optimism}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">10</span>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-medium">{sessionData.emotionalStateStart.optimism}</span>
                    </div>
                  </div>
                </div>


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
