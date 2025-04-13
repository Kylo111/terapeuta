'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import MainLayout from '@/components/layout/MainLayout';
import { formatDate, formatDateTime } from '@/lib/utils';
import { getSessions, Session as SessionType } from '@/lib/api/sessionsApi';
import { getProfiles, Profile as ProfileType } from '@/lib/api/profilesApi';
import { toast } from 'react-toastify';

export default function SessionsPage() {
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get('profileId');

  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState(profileIdParam || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Pobieranie profili
      const profilesData = await getProfiles();
      setProfiles(profilesData);

      // Pobieranie sesji z filtrowaniem po profilu, jeśli podano
      const sessionsData = await getSessions(
        profileIdParam ? { profileId: profileIdParam } : undefined
      );
      setSessions(sessionsData);

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
  }, [profileIdParam]);

  const handleProfileChange = async (e) => {
    const profileId = e.target.value;
    setSelectedProfileId(profileId);

    try {
      setIsLoading(true);

      // Pobieranie sesji z filtrowaniem po profilu
      const sessionsData = await getSessions(
        profileId ? { profileId } : undefined
      );
      setSessions(sessionsData);

      setError(null);
    } catch (err) {
      setError('Błąd pobierania sesji');
      console.error('Błąd pobierania sesji:', err);
      toast.error('Nie udało się pobrać sesji');
    } finally {
      setIsLoading(false);
    }
  };

  const getTherapyMethodLabel = (method) => {
    switch (method) {
      case 'cbt':
        return 'Terapia poznawczo-behawioralna';
      case 'psychodynamic':
        return 'Terapia psychodynamiczna';
      case 'humanistic':
        return 'Terapia humanistyczna';
      case 'systemic':
        return 'Terapia systemowa';
      case 'solution_focused':
        return 'Terapia skoncentrowana na rozwiązaniach';
      default:
        return method;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sesje terapeutyczne</h1>
            <p className="text-gray-600 mt-2">
              Historia sesji terapeutycznych
            </p>
          </div>
          <Link href="/sessions/new">
            <Button>Rozpocznij nową sesję</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Profil"
                value={selectedProfileId}
                onChange={handleProfileChange}
                options={[
                  { value: '', label: 'Wszystkie profile' },
                  ...profiles.map(profile => ({
                    value: profile._id,
                    label: profile.name
                  }))
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie sesji...</span>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{formatDateTime(session.date)}</CardTitle>
                      <CardDescription>
                        {session.profileName} | {getTherapyMethodLabel(session.therapyMethod)} | {session.duration} min
                      </CardDescription>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {session.status === 'completed' ? 'Ukończona' : 'W trakcie'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{session.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/profile/${session.profileId}`}>
                    <Button variant="outline">Profil</Button>
                  </Link>
                  <Link href={`/sessions/${session._id}`}>
                    <Button>Szczegóły sesji</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">Brak sesji terapeutycznych</p>
              <Link href="/sessions/new">
                <Button>Rozpocznij pierwszą sesję</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
