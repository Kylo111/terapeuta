'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProfiles: 0,
    completedSessions: 0,
    pendingTasks: 0,
    lastSession: null,
  });

  useEffect(() => {
    // Tutaj będzie pobieranie danych statystycznych
    // Na razie ustawiamy przykładowe dane
    setTimeout(() => {
      setStats({
        activeProfiles: 2,
        completedSessions: 5,
        pendingTasks: 3,
        lastSession: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Witaj, {user?.firstName || 'Użytkowniku'}! Oto podsumowanie Twojej aktywności.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie danych...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Aktywne profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.activeProfiles}</p>
                </CardContent>
                <CardFooter>
                  <Link href="/profile">
                    <Button variant="link" className="p-0">Zarządzaj profilami</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ukończone sesje</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.completedSessions}</p>
                </CardContent>
                <CardFooter>
                  <Link href="/sessions">
                    <Button variant="link" className="p-0">Zobacz wszystkie sesje</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Oczekujące zadania</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.pendingTasks}</p>
                </CardContent>
                <CardFooter>
                  <Link href="/tasks">
                    <Button variant="link" className="p-0">Zobacz zadania</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ostatnia sesja</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {stats.lastSession
                      ? new Date(stats.lastSession).toLocaleDateString('pl-PL')
                      : 'Brak sesji'}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/sessions/new">
                    <Button variant="link" className="p-0">Rozpocznij nową sesję</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monitorowanie postępu</CardTitle>
                  <CardDescription>Zaawansowana analiza postępu terapii</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-center text-gray-600 mb-4">
                      Śledź swój postęp w terapii za pomocą zaawansowanych wykresów i analiz
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/dashboard/progress" className="w-full">
                    <Button className="w-full">Przejdź do dashboardu postępu</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analiza sentymentu</CardTitle>
                  <CardDescription>Analiza emocjonalna sesji i zadań</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-center text-gray-600 mb-4">
                      Sprawdź, jak zmienia się Twój nastrój i emocje w trakcie terapii
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/reports/new?type=sentiment" className="w-full">
                    <Button className="w-full">Generuj raport sentymentu</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raporty postępu</CardTitle>
                  <CardDescription>Szczegółowe raporty z terapii</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-center text-gray-600 mb-4">
                      Generuj szczegółowe raporty z sesji, zadań i ogólnego postępu
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/reports" className="w-full">
                    <Button className="w-full">Przejdź do raportów</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ostatnie sesje</CardTitle>
                  <CardDescription>Historia Twoich ostatnich sesji terapeutycznych</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.completedSessions > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Sesja CBT</p>
                          <p className="text-sm text-gray-500">12.05.2023</p>
                        </div>
                        <Link href="/sessions/1">
                          <Button variant="outline" size="sm">Szczegóły</Button>
                        </Link>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Sesja Humanistyczna</p>
                          <p className="text-sm text-gray-500">05.05.2023</p>
                        </div>
                        <Link href="/sessions/2">
                          <Button variant="outline" size="sm">Szczegóły</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Brak sesji</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/sessions">
                    <Button>Zobacz wszystkie sesje</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zadania do wykonania</CardTitle>
                  <CardDescription>Lista zadań terapeutycznych do wykonania</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.pendingTasks > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Dziennik myśli</p>
                          <p className="text-sm text-gray-500">Termin: 15.05.2023</p>
                        </div>
                        <Link href="/tasks/1">
                          <Button variant="outline" size="sm">Wykonaj</Button>
                        </Link>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Ćwiczenie relaksacyjne</p>
                          <p className="text-sm text-gray-500">Termin: 18.05.2023</p>
                        </div>
                        <Link href="/tasks/2">
                          <Button variant="outline" size="sm">Wykonaj</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Brak zadań</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/tasks">
                    <Button>Zobacz wszystkie zadania</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
