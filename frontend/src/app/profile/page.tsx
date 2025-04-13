'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ProfileCard from '@/components/profile/ProfileCard';
import CreateProfileModal from '@/components/profile/CreateProfileModal';

// Przykładowe dane profili
const mockProfiles = [
  {
    _id: '1',
    name: 'Jan Kowalski',
    age: 35,
    gender: 'male',
    goals: ['Redukcja stresu', 'Poprawa relacji'],
    challenges: ['Problemy z koncentracją', 'Konflikty w pracy'],
    isActive: true,
    createdAt: '2023-04-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Anna Nowak',
    age: 28,
    gender: 'female',
    goals: ['Radzenie sobie z lękiem', 'Budowanie pewności siebie'],
    challenges: ['Ataki paniki', 'Trudności w podejmowaniu decyzji'],
    isActive: true,
    createdAt: '2023-05-20T14:45:00Z'
  }
];

export default function ProfilePage() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Tutaj będzie pobieranie profili z API
    // Na razie używamy przykładowych danych
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateProfile = (newProfile) => {
    // Tutaj będzie tworzenie profilu przez API
    // Na razie dodajemy do lokalnego stanu
    const profileWithId = {
      ...newProfile,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setProfiles([...profiles, profileWithId]);
    setIsCreateModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600 mt-2">
              Zarządzaj profilami terapeutycznymi
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Utwórz nowy profil
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie profili...</span>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">Nie masz jeszcze żadnych profili</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Utwórz pierwszy profil
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateProfileModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProfile}
      />
    </MainLayout>
  );
}
