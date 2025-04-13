'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import MainLayout from '@/components/layout/MainLayout';
import ProfileCard from '@/components/profile/ProfileCard';
import CreateProfileModal from '@/components/profile/CreateProfileModal';
import { getProfiles, createProfile, Profile as ProfileType } from '@/lib/api/profilesApi';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const profilesData = await getProfiles();
      setProfiles(profilesData);
      setError(null);
    } catch (err) {
      setError('Błąd pobierania profili');
      console.error('Błąd pobierania profili:', err);
      toast.error('Nie udało się pobrać profili');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreateProfile = async (newProfileData) => {
    try {
      setIsLoading(true);
      const createdProfile = await createProfile(newProfileData);
      setProfiles([...profiles, createdProfile]);
      setIsCreateModalOpen(false);
      toast.success('Profil został utworzony');
    } catch (err) {
      console.error('Błąd tworzenia profilu:', err);
      toast.error('Nie udało się utworzyć profilu');
    } finally {
      setIsLoading(false);
    }
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
