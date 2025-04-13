'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import MainLayout from '@/components/layout/MainLayout';
import { formatDate } from '@/lib/utils';
import { getTasks, Task as TaskType } from '@/lib/api/tasksApi';
import { getProfiles, Profile as ProfileType } from '@/lib/api/profilesApi';
import { toast } from 'react-toastify';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get('profileId');
  const statusParam = searchParams.get('status');

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState(profileIdParam || '');
  const [selectedStatus, setSelectedStatus] = useState(statusParam || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Pobieranie profili
      const profilesData = await getProfiles();
      setProfiles(profilesData);

      // Pobieranie zadań z filtrowaniem
      const filters: { profileId?: string; status?: string } = {};

      if (profileIdParam) {
        filters.profileId = profileIdParam;
        setSelectedProfileId(profileIdParam);
      }

      if (statusParam) {
        filters.status = statusParam;
        setSelectedStatus(statusParam);
      }

      const tasksData = await getTasks(Object.keys(filters).length > 0 ? filters : undefined);
      setTasks(tasksData);

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
  }, [profileIdParam, statusParam]);

  const handleProfileChange = async (e) => {
    const profileId = e.target.value;
    setSelectedProfileId(profileId);
    await filterTasks(profileId, selectedStatus);
  };

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    await filterTasks(selectedProfileId, status);
  };

  const filterTasks = async (profileId, status) => {
    try {
      setIsLoading(true);

      const filters: { profileId?: string; status?: string } = {};

      if (profileId) {
        filters.profileId = profileId;
      }

      if (status) {
        filters.status = status;
      }

      const tasksData = await getTasks(Object.keys(filters).length > 0 ? filters : undefined);
      setTasks(tasksData);

      setError(null);
    } catch (err) {
      setError('Błąd pobierania zadań');
      console.error('Błąd pobierania zadań:', err);
      toast.error('Nie udało się pobrać zadań');
    } finally {
      setIsLoading(false);
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
