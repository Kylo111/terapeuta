'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import MainLayout from '@/components/layout/MainLayout';
import { formatDate } from '@/lib/utils';

// Przykładowe dane zadań
const mockTasks = [
  {
    _id: '1',
    profileId: '1',
    profileName: 'Jan Kowalski',
    sessionId: '101',
    title: 'Dziennik myśli',
    description: 'Zapisuj swoje myśli i emocje przez 7 dni.',
    dueDate: '2023-05-17T23:59:59Z',
    status: 'completed',
    createdAt: '2023-05-10T14:20:00Z'
  },
  {
    _id: '2',
    profileId: '1',
    profileName: 'Jan Kowalski',
    sessionId: '101',
    title: 'Ćwiczenie relaksacyjne',
    description: 'Wykonuj ćwiczenie oddechowe 2 razy dziennie przez 5 minut.',
    dueDate: '2023-05-20T23:59:59Z',
    status: 'in_progress',
    createdAt: '2023-05-10T14:20:00Z'
  },
  {
    _id: '3',
    profileId: '2',
    profileName: 'Anna Nowak',
    sessionId: '103',
    title: 'Analiza przekonań',
    description: 'Zidentyfikuj i zapisz 5 przekonań, które mogą wpływać na Twój stres.',
    dueDate: '2023-05-15T23:59:59Z',
    status: 'completed',
    createdAt: '2023-04-25T16:00:00Z'
  },
  {
    _id: '4',
    profileId: '2',
    profileName: 'Anna Nowak',
    sessionId: '104',
    title: 'Technika ekspozycji',
    description: 'Wykonaj ćwiczenie ekspozycji na sytuacje wywołujące lęk według instrukcji.',
    dueDate: '2023-05-22T23:59:59Z',
    status: 'not_started',
    createdAt: '2023-05-12T11:30:00Z'
  }
];

// Przykładowe dane profili
const mockProfiles = [
  { _id: '1', name: 'Jan Kowalski' },
  { _id: '2', name: 'Anna Nowak' }
];

export default function TasksPage() {
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get('profileId');
  
  const [tasks, setTasks] = useState([]);
  const [profiles, setProfiles] = useState(mockProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState(profileIdParam || '');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tutaj będzie pobieranie zadań z API
    // Na razie używamy przykładowych danych
    setTimeout(() => {
      let filteredTasks = [...mockTasks];
      
      if (profileIdParam) {
        filteredTasks = filteredTasks.filter(task => task.profileId === profileIdParam);
        setSelectedProfileId(profileIdParam);
      }
      
      setTasks(filteredTasks);
      setIsLoading(false);
    }, 1000);
  }, [profileIdParam]);

  const handleProfileChange = (e) => {
    const profileId = e.target.value;
    setSelectedProfileId(profileId);
    filterTasks(profileId, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterTasks(selectedProfileId, status);
  };

  const filterTasks = (profileId, status) => {
    let filteredTasks = [...mockTasks];
    
    if (profileId) {
      filteredTasks = filteredTasks.filter(task => task.profileId === profileId);
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    setTasks(filteredTasks);
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Zadania terapeutyczne</h1>
            <p className="text-gray-600 mt-2">
              Zarządzaj zadaniami terapeutycznymi
            </p>
          </div>
          <Link href="/tasks/new">
            <Button>Utwórz nowe zadanie</Button>
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
              
              <Select
                label="Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                options={[
                  { value: '', label: 'Wszystkie statusy' },
                  { value: 'not_started', label: 'Nie rozpoczęte' },
                  { value: 'in_progress', label: 'W trakcie' },
                  { value: 'completed', label: 'Ukończone' }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie zadań...</span>
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card key={task._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTaskStatusClass(task.status)}`}>
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>
                  <CardDescription>
                    {task.profileName} | Termin: {formatDate(task.dueDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{task.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/profile/${task.profileId}`}>
                    <Button variant="outline" size="sm">Profil</Button>
                  </Link>
                  <Link href={`/tasks/${task._id}`}>
                    <Button size="sm">Szczegóły</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">Brak zadań terapeutycznych</p>
              <Link href="/tasks/new">
                <Button>Utwórz pierwsze zadanie</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
