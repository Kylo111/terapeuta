'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'react-toastify';

// Przykładowe dane historii powiadomień
// W rzeczywistości te dane powinny być pobierane z API
const mockNotifications = [
  {
    id: '1',
    type: 'task',
    title: 'Przypomnienie o zadaniu',
    message: 'Pamiętaj o wykonaniu zadania "Dziennik myśli"',
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    channel: 'email'
  },
  {
    id: '2',
    type: 'session',
    title: 'Przypomnienie o sesji',
    message: 'Twoja sesja terapeutyczna odbędzie się jutro o 15:00',
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    channel: 'email'
  },
  {
    id: '3',
    type: 'deadline',
    title: 'Zbliżający się termin',
    message: 'Termin wykonania zadania "Technika relaksacyjna" upływa za 24 godziny',
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    channel: 'email'
  },
  {
    id: '4',
    type: 'task',
    title: 'Przypomnienie o zadaniu',
    message: 'Pamiętaj o wykonaniu zadania "Analiza przekonań"',
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'failed',
    channel: 'email'
  }
];

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // W rzeczywistości tutaj powinno być wywołanie API
      // const response = await getNotificationHistory();
      // setNotifications(response.data);
      
      // Symulacja opóźnienia API
      setTimeout(() => {
        setNotifications(mockNotifications);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Błąd podczas pobierania historii powiadomień:', error);
      toast.error('Nie udało się pobrać historii powiadomień');
      setIsLoading(false);
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === filter);

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'task':
        return 'Zadanie';
      case 'session':
        return 'Sesja';
      case 'deadline':
        return 'Termin';
      default:
        return type;
    }
  };

  const getNotificationStatusLabel = (status) => {
    switch (status) {
      case 'delivered':
        return 'Dostarczone';
      case 'failed':
        return 'Błąd';
      case 'pending':
        return 'Oczekujące';
      default:
        return status;
    }
  };

  const getNotificationStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
            <span className="ml-2">Ładowanie historii powiadomień...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historia powiadomień</CardTitle>
        <CardDescription>
          Przeglądaj historię wysłanych powiadomień
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Wszystkie
            </Button>
            <Button
              variant={filter === 'task' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('task')}
            >
              Zadania
            </Button>
            <Button
              variant={filter === 'session' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('session')}
            >
              Sesje
            </Button>
            <Button
              variant={filter === 'deadline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('deadline')}
            >
              Terminy
            </Button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Brak powiadomień w historii.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredNotifications.map((notification) => (
              <li key={notification.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      <Badge variant="outline">{getNotificationTypeLabel(notification.type)}</Badge>
                      <Badge className={getNotificationStatusClass(notification.status)}>
                        {getNotificationStatusLabel(notification.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Wysłano: {formatDateTime(notification.sentAt)}</span>
                      <span>Kanał: {notification.channel}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
