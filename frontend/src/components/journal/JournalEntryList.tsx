'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { getJournalEntries, JournalEntry, JournalFilterOptions } from '@/lib/api/journalApi';
import { getProfiles, Profile } from '@/lib/api/profilesApi';
import { toast } from 'react-toastify';
import { formatDate } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';

export default function JournalEntryList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JournalFilterOptions>({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  useEffect(() => {
    fetchProfiles();
    fetchEntries();
  }, [filters]);

  const fetchProfiles = async () => {
    try {
      const profilesData = await getProfiles();
      setProfiles(profilesData);
    } catch (err) {
      console.error('Błąd pobierania profili:', err);
    }
  };

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getJournalEntries(filters);
      setEntries(data.entries);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Błąd pobierania wpisów z dziennika:', err);
      setError('Nie udało się pobrać wpisów z dziennika');
      toast.error('Nie udało się pobrać wpisów z dziennika');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JournalFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1 // Reset page when changing other filters
    }));
  };

  const handleDateChange = (key: 'startDate' | 'endDate', date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: date ? date.toISOString() : undefined,
      page: 1
    }));
  };

  const getEmotionBadges = (entry: JournalEntry) => {
    const topEmotions = [...entry.emotions]
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3);
    
    return topEmotions.map((emotion, index) => (
      <Badge key={index} variant="outline" className="mr-1">
        {emotion.name} ({emotion.intensity})
      </Badge>
    ));
  };

  const getDistortionBadges = (entry: JournalEntry) => {
    if (!entry.cognitiveDistortions || entry.cognitiveDistortions.length === 0) {
      return null;
    }
    
    return entry.cognitiveDistortions.slice(0, 2).map((distortion, index) => (
      <Badge key={index} variant="outline" className="mr-1 bg-red-50 text-red-800 border-red-200">
        {distortion}
      </Badge>
    ));
  };

  const filteredEntries = entries.filter(entry => 
    entry.situation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.automaticThoughts.some(thought => thought.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.conclusions && entry.conclusions.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading && entries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <span className="ml-2">Ładowanie wpisów...</span>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Szukaj wpisów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Select
            value={filters.profileId || ''}
            onValueChange={(value) => handleFilterChange('profileId', value || undefined)}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Profil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszystkie profile</SelectItem>
              {profiles.map((profile) => (
                <SelectItem key={profile._id} value={profile._id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DatePicker
            date={filters.startDate ? new Date(filters.startDate) : undefined}
            setDate={(date) => handleDateChange('startDate', date)}
            placeholder="Data początkowa"
          />
          
          <DatePicker
            date={filters.endDate ? new Date(filters.endDate) : undefined}
            setDate={(date) => handleDateChange('endDate', date)}
            placeholder="Data końcowa"
          />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nie znaleziono wpisów spełniających kryteria.</p>
          <Link href="/journal/new">
            <Button className="mt-4">
              Utwórz nowy wpis
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry._id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{formatDate(entry.date)}</CardTitle>
                      <CardDescription>
                        {entry.profileName || 'Profil'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {entry.tags && entry.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="ml-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Sytuacja</h4>
                      <p className="mt-1">{entry.situation}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Myśli automatyczne</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {entry.automaticThoughts.slice(0, 2).map((thought, index) => (
                          <li key={index}>{thought}</li>
                        ))}
                        {entry.automaticThoughts.length > 2 && (
                          <li>...</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Emocje</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {getEmotionBadges(entry)}
                          {entry.emotions.length > 3 && (
                            <Badge variant="outline">+{entry.emotions.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                      
                      {entry.cognitiveDistortions && entry.cognitiveDistortions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Zniekształcenia poznawcze</h4>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {getDistortionBadges(entry)}
                            {entry.cognitiveDistortions.length > 2 && (
                              <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                                +{entry.cognitiveDistortions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/journal/${entry._id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Zobacz szczegóły
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => handleFilterChange('page', page)}
            />
          </div>
        </>
      )}
    </div>
  );
}
