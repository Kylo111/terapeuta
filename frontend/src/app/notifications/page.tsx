'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { DatePicker } from '@/components/ui/DatePicker';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications, Notification, NotificationFilterOptions } from '@/lib/api/notificationsApi';
import { toast } from 'react-toastify';
import { formatDistanceToNow, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/AlertDialog';
import { Bell, Calendar, CheckCircle, Trash2, Filter } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilterOptions>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getNotifications(filters);
      setNotifications(result.notifications);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Błąd pobierania powiadomień:', err);
      setError('Nie udało się pobrać powiadomień');
      toast.error('Nie udało się pobrać powiadomień');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof NotificationFilterOptions, value: any) => {
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

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await markAsRead(notification._id);
      
      // Aktualizacja stanu
      setNotifications(prev => 
        prev.map(n => 
          n._id === notification._id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      );
      
      toast.success('Powiadomienie oznaczone jako przeczytane');
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
      toast.error('Nie udało się oznaczyć powiadomienia jako przeczytane');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      // Aktualizacja stanu
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      
      toast.success('Wszystkie powiadomienia oznaczone jako przeczytane');
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
      toast.error('Nie udało się oznaczyć wszystkich powiadomień jako przeczytane');
    }
  };

  const handleDeleteNotification = async (notification: Notification) => {
    try {
      await deleteNotification(notification._id);
      
      // Aktualizacja stanu
      setNotifications(prev => prev.filter(n => n._id !== notification._id));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      toast.success('Powiadomienie usunięte');
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
      toast.error('Nie udało się usunąć powiadomienia');
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      setIsDeleting(true);
      await deleteAllNotifications();
      
      // Aktualizacja stanu
      setNotifications([]);
      setPagination(prev => ({
        ...prev,
        total: 0
      }));
      
      toast.success('Wszystkie powiadomienia usunięte');
    } catch (error) {
      console.error('Błąd podczas usuwania wszystkich powiadomień:', error);
      toast.error('Nie udało się usunąć wszystkich powiadomień');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Jeśli powiadomienie nie jest przeczytane, oznacz je jako przeczytane
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
        
        // Aktualizacja stanu
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
      } catch (error) {
        console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
      }
    }
    
    // Przekieruj do odpowiedniej strony, jeśli jest akcja
    if (notification.action) {
      router.push(notification.action);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">S</div>;
      case 'task':
        return <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">T</div>;
      case 'reminder':
        return <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">R</div>;
      case 'system':
        return <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">S</div>;
      default:
        return <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">N</div>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'session':
        return 'Sesja';
      case 'task':
        return 'Zadanie';
      case 'reminder':
        return 'Przypomnienie';
      case 'system':
        return 'System';
      default:
        return 'Inne';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Wysoki';
      case 'medium':
        return 'Średni';
      case 'low':
        return 'Niski';
      default:
        return 'Nieznany';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: pl });
    } catch (error) {
      return 'nieznana data';
    }
  };

  const formatFullDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP, HH:mm', { locale: pl });
    } catch (error) {
      return 'nieznana data';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Powiadomienia</h1>
            <p className="text-gray-600 mt-2">
              Zarządzaj swoimi powiadomieniami i przypomnieniami
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              disabled={notifications.every(n => n.isRead)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Oznacz wszystkie jako przeczytane
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting || notifications.length === 0}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Usuwanie...' : 'Usuń wszystkie'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Czy na pewno chcesz usunąć wszystkie powiadomienia?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta akcja jest nieodwracalna. Wszystkie powiadomienia zostaną trwale usunięte z systemu.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllNotifications} className="bg-red-600 hover:bg-red-700">
                    Usuń wszystkie
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select
                  value={filters.isRead !== undefined ? String(filters.isRead) : ''}
                  onValueChange={(value) => handleFilterChange('isRead', value === '' ? undefined : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie</SelectItem>
                    <SelectItem value="false">Nieprzeczytane</SelectItem>
                    <SelectItem value="true">Przeczytane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie typy</SelectItem>
                    <SelectItem value="session">Sesja</SelectItem>
                    <SelectItem value="task">Zadanie</SelectItem>
                    <SelectItem value="reminder">Przypomnienie</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="other">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={filters.priority || ''}
                  onValueChange={(value) => handleFilterChange('priority', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priorytet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Wszystkie priorytety</SelectItem>
                    <SelectItem value="high">Wysoki</SelectItem>
                    <SelectItem value="medium">Średni</SelectItem>
                    <SelectItem value="low">Niski</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select
                  value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder as 'asc' | 'desc');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sortowanie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Najnowsze</SelectItem>
                    <SelectItem value="createdAt-asc">Najstarsze</SelectItem>
                    <SelectItem value="priority-desc">Priorytet (malejąco)</SelectItem>
                    <SelectItem value="priority-asc">Priorytet (rosnąco)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium mb-2">Data początkowa</p>
                <DatePicker
                  date={filters.startDate ? new Date(filters.startDate) : undefined}
                  setDate={(date) => handleDateChange('startDate', date)}
                  placeholder="Wybierz datę początkową"
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Data końcowa</p>
                <DatePicker
                  date={filters.endDate ? new Date(filters.endDate) : undefined}
                  setDate={(date) => handleDateChange('endDate', date)}
                  placeholder="Wybierz datę końcową"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie powiadomień...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">Brak powiadomień</h3>
              <p className="text-gray-500 mt-2">
                Nie masz żadnych powiadomień spełniających wybrane kryteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification._id} className={!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          <h3 className="text-lg font-medium">{notification.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {getPriorityLabel(notification.priority)}
                            </Badge>
                            {!notification.isRead && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Nieprzeczytane
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span title={formatFullDate(notification.createdAt)}>
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-gray-700">{notification.message}</p>
                      
                      {notification.scheduledFor && (
                        <div className="mt-2 text-sm text-gray-500">
                          Zaplanowane na: {formatFullDate(notification.scheduledFor)}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {notification.action && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            Przejdź
                          </Button>
                        )}
                        
                        {!notification.isRead && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification)}
                          >
                            Oznacz jako przeczytane
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Usuń
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Czy na pewno chcesz usunąć to powiadomienie?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ta akcja jest nieodwracalna. Powiadomienie zostanie trwale usunięte z systemu.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Anuluj</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteNotification(notification)} className="bg-red-600 hover:bg-red-700">
                                Usuń
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(page) => handleFilterChange('page', page)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
