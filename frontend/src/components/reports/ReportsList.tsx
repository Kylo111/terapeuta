'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { getReports, deleteReport, Report, ReportFilters } from '@/lib/api/reportsApi';
import { getProfiles, Profile } from '@/lib/api/profilesApi';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    limit: 10,
    page: 1
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Pobieranie profili
      const profilesData = await getProfiles();
      setProfiles(profilesData);

      // Pobieranie raportów
      const { reports, pagination } = await getReports(filters);
      setReports(reports);
      setPagination(pagination);

      setError(null);
    } catch (err) {
      console.error('Błąd pobierania danych:', err);
      setError('Nie udało się pobrać danych');
      toast.error('Nie udało się pobrać danych');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset strony przy zmianie filtrów
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten raport?')) return;

    try {
      await deleteReport(id);
      toast.success('Raport został usunięty');
      fetchData();
    } catch (err) {
      console.error('Błąd usuwania raportu:', err);
      toast.error('Nie udało się usunąć raportu');
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'session':
        return 'Sesja';
      case 'progress':
        return 'Postęp';
      case 'tasks':
        return 'Zadania';
      case 'emotional':
        return 'Emocje';
      case 'summary':
        return 'Podsumowanie';
      default:
        return type;
    }
  };

  const getReportTypeClass = (type: string) => {
    switch (type) {
      case 'session':
        return 'bg-blue-100 text-blue-800';
      case 'progress':
        return 'bg-green-100 text-green-800';
      case 'tasks':
        return 'bg-purple-100 text-purple-800';
      case 'emotional':
        return 'bg-yellow-100 text-yellow-800';
      case 'summary':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie raportów...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raporty</CardTitle>
        <CardDescription>
          Przeglądaj i zarządzaj raportami
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profil</label>
            <Select
              value={filters.profileId || ''}
              onValueChange={(value) => handleFilterChange('profileId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie profile" />
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Typ raportu</label>
            <Select
              value={filters.type || ''}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie typy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Wszystkie typy</SelectItem>
                <SelectItem value="session">Sesja</SelectItem>
                <SelectItem value="progress">Postęp</SelectItem>
                <SelectItem value="tasks">Zadania</SelectItem>
                <SelectItem value="emotional">Emocje</SelectItem>
                <SelectItem value="summary">Podsumowanie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data od</label>
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data do</label>
            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Brak raportów spełniających kryteria wyszukiwania</p>
            <div className="flex justify-center space-x-4">
              <Link href="/reports/new">
                <Button>Utwórz nowy raport</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{report.title}</h3>
                      <Badge className={getReportTypeClass(report.type)}>
                        {getReportTypeLabel(report.type)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Okres: {formatDate(report.startDate)} - {formatDate(report.endDate)}</p>
                      <p>Wygenerowano: {formatDate(report.generatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/reports/${report._id}`}>
                      <Button variant="outline" size="sm">
                        Szczegóły
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteReport(report._id)}
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Select
            value={String(filters.limit)}
            onValueChange={(value) => handleFilterChange('limit', value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="10 na stronę" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 na stronę</SelectItem>
              <SelectItem value="10">10 na stronę</SelectItem>
              <SelectItem value="20">20 na stronę</SelectItem>
              <SelectItem value="50">50 na stronę</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      </CardFooter>
    </Card>
  );
}
