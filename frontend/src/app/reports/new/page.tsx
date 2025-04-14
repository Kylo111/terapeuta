'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Label } from '@/components/ui/Label';
import MainLayout from '@/components/layout/MainLayout';
import { getProfiles, Profile } from '@/lib/api/profilesApi';
import { generateProgressReport, generateTasksReport } from '@/lib/api/reportsApi';
import { toast } from 'react-toastify';

export default function NewReportPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    profileId: '',
    reportType: 'progress',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const profilesData = await getProfiles();
      setProfiles(profilesData);
      
      if (profilesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          profileId: profilesData[0]._id
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error('Błąd pobierania profili:', err);
      setError('Nie udało się pobrać profili');
      toast.error('Nie udało się pobrać profili');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.profileId) {
      toast.error('Wybierz profil');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const options = {
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined
      };
      
      let report;
      
      if (formData.reportType === 'progress') {
        report = await generateProgressReport(formData.profileId, options);
      } else if (formData.reportType === 'tasks') {
        report = await generateTasksReport(formData.profileId, options);
      } else {
        throw new Error('Nieobsługiwany typ raportu');
      }
      
      toast.success('Raport został wygenerowany');
      router.push(`/reports/${report._id}`);
    } catch (err) {
      console.error('Błąd generowania raportu:', err);
      toast.error('Nie udało się wygenerować raportu');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Nowy raport</h1>
          <Link href="/reports">
            <Button variant="outline">Powrót do raportów</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generowanie raportu</CardTitle>
            <CardDescription>
              Wybierz typ raportu i zakres dat
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="profile">Profil</Label>
                <Select
                  value={formData.profileId}
                  onValueChange={(value) => handleInputChange('profileId', value)}
                >
                  <SelectTrigger id="profile">
                    <SelectValue placeholder="Wybierz profil" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile._id} value={profile._id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Typ raportu</Label>
                <RadioGroup
                  value={formData.reportType}
                  onValueChange={(value) => handleInputChange('reportType', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="progress" id="progress" />
                    <Label htmlFor="progress" className="cursor-pointer">Raport postępu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tasks" id="tasks" />
                    <Label htmlFor="tasks" className="cursor-pointer">Raport zadań</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data początkowa</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Pozostaw puste, aby użyć domyślnej daty (30 dni wstecz)
                  </p>
                </div>
                <div>
                  <Label htmlFor="endDate">Data końcowa</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Pozostaw puste, aby użyć dzisiejszej daty
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? 'Generowanie...' : 'Generuj raport'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
