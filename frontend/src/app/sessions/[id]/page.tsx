'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import { formatDateTime } from '@/lib/utils';

// Przykładowe dane sesji
const mockSession = {
  _id: '1',
  profileId: '1',
  profileName: 'Jan Kowalski',
  date: '2023-05-10T14:20:00Z',
  therapyMethod: 'cbt',
  duration: 45,
  status: 'completed',
  summary: 'Omówienie technik radzenia sobie ze stresem w pracy.',
  notes: 'Pacjent zgłasza poprawę w radzeniu sobie ze stresem. Nadal występują trudności w sytuacjach konfliktowych w pracy. Zalecono kontynuację ćwiczeń relaksacyjnych i wprowadzenie technik asertywnej komunikacji.',
  mood: {
    before: 4,
    after: 6
  },
  topics: [
    'Stres w pracy',
    'Techniki relaksacyjne',
    'Asertywna komunikacja'
  ],
  techniques: [
    'Restrukturyzacja poznawcza',
    'Trening relaksacyjny',
    'Modelowanie zachowań'
  ],
  tasks: [
    {
      _id: '201',
      title: 'Dziennik myśli',
      description: 'Zapisuj swoje myśli i emocje przez 7 dni.',
      dueDate: '2023-05-17T23:59:59Z',
      status: 'completed'
    },
    {
      _id: '202',
      title: 'Ćwiczenie relaksacyjne',
      description: 'Wykonuj ćwiczenie oddechowe 2 razy dziennie przez 5 minut.',
      dueDate: '2023-05-20T23:59:59Z',
      status: 'in_progress'
    }
  ],
  transcript: [
    {
      role: 'system',
      content: 'Rozpoczynamy sesję terapii poznawczo-behawioralnej.'
    },
    {
      role: 'assistant',
      content: 'Dzień dobry, Jan. Jak się dzisiaj czujesz?'
    },
    {
      role: 'user',
      content: 'Dzień dobry. Czuję się trochę lepiej niż ostatnio, ale nadal mam problemy ze stresem w pracy.'
    },
    {
      role: 'assistant',
      content: 'Cieszę się, że jest pewna poprawa. Możesz powiedzieć więcej o tych sytuacjach w pracy, które wywołują stres?'
    },
    {
      role: 'user',
      content: 'Głównie są to sytuacje, gdy muszę rozmawiać z trudnymi klientami lub gdy mój szef stawia nierealistyczne terminy.'
    },
    // Więcej wiadomości...
  ]
};

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    // Tutaj będzie pobieranie danych sesji z API
    // Na razie używamy przykładowych danych
    setTimeout(() => {
      setSession(mockSession);
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

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

  const getTaskStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Ukończone';
      case 'in_progress':
        return 'W trakcie';
      case 'not_started':
        return 'Nie rozpoczęte';
      default:
        return status;
    }
  };

  const getTaskStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie sesji...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Sesja nie znaleziona</h2>
            <p className="mt-2 text-gray-600">Nie znaleziono sesji o podanym identyfikatorze.</p>
            <div className="mt-6">
              <Link href="/sessions">
                <Button>Wróć do listy sesji</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Szczegóły sesji</h1>
            <p className="text-gray-600 mt-2">
              {formatDateTime(session.date)} | {session.profileName}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/profile/${session.profileId}`}>
              <Button variant="outline">Profil</Button>
            </Link>
            <Link href="/sessions/new">
              <Button>Nowa sesja</Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{getTherapyMethodLabel(session.therapyMethod)}</CardTitle>
                <CardDescription>
                  Czas trwania: {session.duration} min | Status: {session.status === 'completed' ? 'Ukończona' : 'W trakcie'}
                </CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                {session.status === 'completed' ? 'Ukończona' : 'W trakcie'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'summary'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Podsumowanie
                </button>
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transcript'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Transkrypcja
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tasks'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Zadania ({session.tasks.length})
                </button>
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Podsumowanie</h3>
                    <p className="mt-2 text-gray-600">{session.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Notatki</h3>
                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{session.notes}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Nastrój</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Przed sesją</p>
                          <p className="text-2xl font-bold">{session.mood.before}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Po sesji</p>
                          <p className="text-2xl font-bold">{session.mood.after}/10</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Tematy</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {session.topics.map((topic, index) => (
                          <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Techniki</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {session.techniques.map((technique, index) => (
                        <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transcript' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transkrypcja sesji</h3>
                  <div className="space-y-4">
                    {session.transcript.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-primary-100 text-primary-800'
                              : message.role === 'assistant'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-gray-50 text-gray-500 italic text-sm'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Zadania</h3>
                  {session.tasks.length > 0 ? (
                    <div className="space-y-4">
                      {session.tasks.map((task) => (
                        <div key={task._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-500">Termin: {formatDateTime(task.dueDate)}</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTaskStatusClass(task.status)}`}>
                              {getTaskStatusLabel(task.status)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm">{task.description}</p>
                          <div className="mt-4">
                            <Link href={`/tasks/${task._id}`}>
                              <Button variant="outline" size="sm">Szczegóły zadania</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Brak zadań przypisanych do tej sesji.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
