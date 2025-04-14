'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import MainLayout from '@/components/layout/MainLayout';
import { getReport, deleteReport, Report as ReportType } from '@/lib/api/reportsApi';
import { formatDate, formatDateTime } from '@/lib/utils';
import { toast } from 'react-toastify';
import SessionReportDetails from '@/components/reports/SessionReportDetails';
import ProgressReportDetails from '@/components/reports/ProgressReportDetails';
import TasksReportDetails from '@/components/reports/TasksReportDetails';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const reportId = params.id as string;
      const reportData = await getReport(reportId);
      setReport(reportData);
      setError(null);
    } catch (err) {
      console.error('Błąd pobierania raportu:', err);
      setError('Nie udało się pobrać raportu');
      toast.error('Nie udało się pobrać raportu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!report) return;
    if (!window.confirm('Czy na pewno chcesz usunąć ten raport?')) return;

    try {
      await deleteReport(report._id);
      toast.success('Raport został usunięty');
      router.push('/reports');
    } catch (err) {
      console.error('Błąd usuwania raportu:', err);
      toast.error('Nie udało się usunąć raportu');
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'session':
        return 'Raport sesji';
      case 'progress':
        return 'Raport postępu';
      case 'tasks':
        return 'Raport zadań';
      case 'emotional':
        return 'Raport emocjonalny';
      case 'summary':
        return 'Raport podsumowujący';
      default:
        return 'Raport';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie raportu...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!report) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Raport nie znaleziony</h2>
            <p className="mt-2 text-gray-600">Nie znaleziono raportu o podanym identyfikatorze.</p>
            <div className="mt-6">
              <Link href="/reports">
                <Button>Wróć do listy raportów</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{getReportTypeLabel(report.type)}</h1>
            <p className="text-gray-600 mt-2">
              {report.title}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/reports">
              <Button variant="outline">Powrót do raportów</Button>
            </Link>
            <Button variant="destructive" onClick={handleDeleteReport}>
              Usuń raport
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informacje o raporcie</CardTitle>
            <CardDescription>
              Podstawowe informacje o raporcie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Typ raportu</h3>
                <p>{getReportTypeLabel(report.type)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Profil</h3>
                <p>{report.profile.name || report.profile}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Okres raportu</h3>
                <p>{formatDate(report.startDate)} - {formatDate(report.endDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data wygenerowania</h3>
                <p>{formatDateTime(report.generatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Szczegóły</TabsTrigger>
            {report.type === 'progress' && (
              <TabsTrigger value="charts">Wykresy</TabsTrigger>
            )}
            {report.type === 'tasks' && (
              <TabsTrigger value="statistics">Statystyki</TabsTrigger>
            )}
            {report.type === 'session' && (
              <TabsTrigger value="insights">Wnioski</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details">
            {report.type === 'session' && (
              <SessionReportDetails report={report} />
            )}
            {report.type === 'progress' && (
              <ProgressReportDetails report={report} />
            )}
            {report.type === 'tasks' && (
              <TasksReportDetails report={report} />
            )}
          </TabsContent>
          
          {report.type === 'progress' && (
            <TabsContent value="charts">
              <Card>
                <CardHeader>
                  <CardTitle>Wykresy postępu</CardTitle>
                  <CardDescription>
                    Wizualizacja postępu w terapii
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Wykresy będą dostępne w przyszłej wersji aplikacji.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {report.type === 'tasks' && (
            <TabsContent value="statistics">
              <Card>
                <CardHeader>
                  <CardTitle>Statystyki zadań</CardTitle>
                  <CardDescription>
                    Szczegółowe statystyki wykonania zadań
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Statystyki będą dostępne w przyszłej wersji aplikacji.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {report.type === 'session' && (
            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle>Wnioski z sesji</CardTitle>
                  <CardDescription>
                    Kluczowe wnioski z sesji terapeutycznej
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.data.session?.insights && report.data.session.insights.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {report.data.session.insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      Brak wniosków dla tej sesji.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}
