'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import MainLayout from '@/components/layout/MainLayout';
import { formatDate } from '@/lib/utils';
import { getProfile, updateProfile, getProfileSessions, getProfileTasks, Profile as ProfileType } from '@/lib/api/profilesApi';
import { toast } from 'react-toastify';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const profileId = params.id as string;

      // Pobieranie danych profilu
      const profileData = await getProfile(profileId);
      setProfile(profileData);
      setEditedProfile(profileData);

      // Pobieranie sesji profilu
      const sessionsData = await getProfileSessions(profileId);
      setSessions(sessionsData);

      // Pobieranie zadań profilu
      const tasksData = await getProfileTasks(profileId);
      setTasks(tasksData);

      setError(null);
    } catch (err) {
      setError('Błąd pobierania danych profilu');
      console.error('Błąd pobierania danych profilu:', err);
      toast.error('Nie udało się pobrać danych profilu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProfileData();
    }
  }, [params.id]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    try {
      if (!profile || !editedProfile) return;

      setIsLoading(true);
      const updatedProfile = await updateProfile(profile._id, {
        name: editedProfile.name,
        age: editedProfile.age,
        gender: editedProfile.gender,
        goals: editedProfile.goals,
        challenges: editedProfile.challenges,
        notes: editedProfile.notes,
        preferredTherapyMethods: editedProfile.preferredTherapyMethods
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profil został zaktualizowany');
    } catch (err) {
      console.error('Błąd aktualizacji profilu:', err);
      toast.error('Nie udało się zaktualizować profilu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleGoalsChange = (e) => {
    const goals = e.target.value.split('\n').filter(goal => goal.trim() !== '');
    setEditedProfile({
      ...editedProfile,
      goals
    });
  };

  const handleChallengesChange = (e) => {
    const challenges = e.target.value.split('\n').filter(challenge => challenge.trim() !== '');
    setEditedProfile({
      ...editedProfile,
      challenges
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie profilu...</span>
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
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-gray-600 mt-2">
              Profil terapeutyczny
            </p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile}>Zapisz zmiany</Button>
                <Button variant="outline" onClick={handleCancelEdit}>Anuluj</Button>
              </>
            ) : (
              <>
                <Button onClick={handleEditProfile}>Edytuj profil</Button>
                <Link href={`/sessions/new?profileId=${profile._id}`}>
                  <Button variant="secondary">Rozpocznij sesję</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informacje o profilu</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Imię i nazwisko"
                      name="name"
                      value={editedProfile.name}
                      onChange={handleInputChange}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Wiek"
                        type="number"
                        name="age"
                        value={editedProfile.age}
                        onChange={handleInputChange}
                      />

                      <Select
                        label="Płeć"
                        name="gender"
                        value={editedProfile.gender}
                        onChange={handleInputChange}
                        options={[
                          { value: 'male', label: 'Mężczyzna' },
                          { value: 'female', label: 'Kobieta' },
                          { value: 'other', label: 'Inna' },
                        ]}
                      />
                    </div>

                    <Textarea
                      label="Cele terapeutyczne (każdy cel w nowej linii)"
                      value={editedProfile.goals.join('\n')}
                      onChange={handleGoalsChange}
                    />

                    <Textarea
                      label="Wyzwania (każde wyzwanie w nowej linii)"
                      value={editedProfile.challenges.join('\n')}
                      onChange={handleChallengesChange}
                    />

                    <Textarea
                      label="Notatki"
                      name="notes"
                      value={editedProfile.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Wiek</h3>
                        <p>{profile.age} lat</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Płeć</h3>
                        <p>{profile.gender === 'male' ? 'Mężczyzna' : profile.gender === 'female' ? 'Kobieta' : 'Inna'}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cele terapeutyczne</h3>
                      <ul className="mt-1 list-disc list-inside">
                        {profile.goals.map((goal, index) => (
                          <li key={index}>{goal}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Wyzwania</h3>
                      <ul className="mt-1 list-disc list-inside">
                        {profile.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferowane metody terapii</h3>
                      <ul className="mt-1 list-disc list-inside">
                        {profile.preferredTherapyMethods.map((method, index) => (
                          <li key={index}>{getTherapyMethodLabel(method)}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Notatki</h3>
                      <p className="mt-1 whitespace-pre-wrap">{profile.notes}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Data utworzenia</h3>
                        <p>{formatDate(profile.createdAt)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Ostatnia sesja</h3>
                        <p>{profile.lastSessionAt ? formatDate(profile.lastSessionAt) : 'Brak sesji'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Historia sesji</CardTitle>
                <CardDescription>
                  Łącznie: {profile.sessionsCount} {profile.sessionsCount === 1 ? 'sesja' : profile.sessionsCount < 5 ? 'sesje' : 'sesji'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session._id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{formatDate(session.date)}</p>
                          <p className="text-sm text-gray-500">{getTherapyMethodLabel(session.therapyMethod)}</p>
                          <p className="text-sm mt-1">{session.summary}</p>
                        </div>
                        <Link href={`/sessions/${session._id}`}>
                          <Button variant="outline" size="sm">Szczegóły</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Brak sesji</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/sessions?profileId=${profile._id}`}>
                  <Button variant="outline">Zobacz wszystkie sesje</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Statystyki</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Liczba sesji</h3>
                    <p className="text-2xl font-bold">{profile.sessionsCount}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Zadania</h3>
                    <p className="text-2xl font-bold">{profile.completedTasksCount}/{profile.tasksCount}</p>
                    <p className="text-xs text-gray-500">ukończonych zadań</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${profile.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {profile.isActive ? 'Aktywny' : 'Nieaktywny'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zadania</CardTitle>
                <CardDescription>
                  Ukończone: {profile.completedTasksCount}/{profile.tasksCount}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task._id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{task.title}</p>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getTaskStatusLabel(task.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Termin: {formatDate(task.dueDate)}</p>
                        <p className="text-sm mt-1">{task.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Brak zadań</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/tasks?profileId=${profile._id}`}>
                  <Button variant="outline">Zobacz wszystkie zadania</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
