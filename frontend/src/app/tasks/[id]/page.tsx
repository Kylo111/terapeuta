'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import MainLayout from '@/components/layout/MainLayout';
import { formatDate, formatDateTime } from '@/lib/utils';
import { getTask, updateTask, completeTask, Task as TaskType } from '@/lib/api/tasksApi';
import { toast } from 'react-toastify';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<TaskType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    status: '',
    reflection: ''
  });
  const [error, setError] = useState<string | null>(null);

  const fetchTaskData = async () => {
    try {
      setIsLoading(true);
      const taskId = params.id as string;

      // Pobieranie danych zadania
      const taskData = await getTask(taskId);
      setTask(taskData);
      setEditedTask({
        status: taskData.status,
        reflection: taskData.reflection || ''
      });

      setError(null);
    } catch (err) {
      setError('Błąd pobierania danych zadania');
      console.error('Błąd pobierania danych zadania:', err);
      toast.error('Nie udało się pobrać danych zadania');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTaskData();
    }
  }, [params.id]);

  const handleEditTask = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (task) {
      setEditedTask({
        status: task.status,
        reflection: task.reflection || ''
      });
    }
    setIsEditing(false);
  };

  const handleSaveTask = async () => {
    try {
      if (!task) return;

      setIsLoading(true);

      // Jeśli status zmienia się na 'completed', używamy completeTask
      if (editedTask.status === 'completed' && task.status !== 'completed') {
        const updatedTask = await completeTask(task._id, editedTask.reflection);
        setTask(updatedTask);
      } else {
        // W przeciwnym razie używamy updateTask
        const updatedTask = await updateTask(task._id, {
          status: editedTask.status,
          reflection: editedTask.reflection
        });
        setTask(updatedTask);
      }

      setIsEditing(false);
      toast.success('Zadanie zostało zaktualizowane');
    } catch (err) {
      console.error('Błąd aktualizacji zadania:', err);
      toast.error('Nie udało się zaktualizować zadania');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
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
            <span className="ml-2">Ładowanie zadania...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Zadanie nie znalezione</h2>
            <p className="mt-2 text-gray-600">Nie znaleziono zadania o podanym identyfikatorze.</p>
            <div className="mt-6">
              <Link href="/tasks">
                <Button>Wróć do listy zadań</Button>
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
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <p className="text-gray-600 mt-2">
              Zadanie terapeutyczne | {task.profileName}
            </p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveTask}>Zapisz zmiany</Button>
                <Button variant="outline" onClick={handleCancelEdit}>Anuluj</Button>
              </>
            ) : (
              <>
                <Button onClick={handleEditTask}>Aktualizuj zadanie</Button>
                <Link href={`/profile/${task.profileId}`}>
                  <Button variant="outline">Profil</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Szczegóły zadania</CardTitle>
                    <CardDescription>
                      Termin: {formatDate(task.dueDate)}
                    </CardDescription>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTaskStatusClass(task.status)}`}>
                    {getTaskStatusLabel(task.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Opis</h3>
                    <p className="mt-1 whitespace-pre-wrap">{task.description}</p>
                  </div>

                  {task.instructions && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Instrukcje</h3>
                      <p className="mt-1 whitespace-pre-wrap">{task.instructions}</p>
                    </div>
                  )}

                  {isEditing ? (
                    <div>
                      <Select
                        label="Status"
                        name="status"
                        value={editedTask.status}
                        onChange={handleInputChange}
                        options={[
                          { value: 'not_started', label: 'Nie rozpoczęte' },
                          { value: 'in_progress', label: 'W trakcie' },
                          { value: 'completed', label: 'Ukończone' }
                        ]}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Utworzono</h3>
                        <p>{formatDateTime(task.createdAt)}</p>
                      </div>
                      {task.completedAt && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Ukończono</h3>
                          <p>{formatDateTime(task.completedAt)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {task.attachments && task.attachments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Załączniki</h3>
                      <ul className="mt-2 divide-y divide-gray-200">
                        {task.attachments.map((attachment, index) => (
                          <li key={index} className="py-2 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-xs text-gray-500">Dodano: {formatDateTime(attachment.uploadedAt)}</p>
                            </div>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              Pobierz
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refleksja</CardTitle>
                <CardDescription>
                  Twoje przemyślenia na temat wykonanego zadania
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    name="reflection"
                    value={editedTask.reflection}
                    onChange={handleInputChange}
                    placeholder="Zapisz swoje przemyślenia na temat tego zadania..."
                    className="min-h-[150px]"
                  />
                ) : task.reflection ? (
                  <p className="whitespace-pre-wrap">{task.reflection}</p>
                ) : (
                  <p className="text-gray-500">Brak refleksji.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informacje o sesji</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data sesji</h3>
                    <p>{formatDateTime(task.sessionDate)}</p>
                  </div>
                  <div>
                    <Link href={`/sessions/${task.sessionId}`}>
                      <Button variant="outline" className="w-full">
                        Zobacz sesję
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {task.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>Informacja zwrotna</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{task.feedback}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
