'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getUnreadCount, getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/api/notificationsApi';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUnreadCount();
    
    // Pobieranie liczby nieprzeczytanych powiadomień co 60 sekund
    const interval = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    // Obsługa kliknięcia poza komponentem
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Błąd podczas pobierania liczby nieprzeczytanych powiadomień:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const result = await getNotifications({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
      setNotifications(result.notifications);
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await markAsRead(notification._id);
      
      // Aktualizacja stanu
      setNotifications(prev => 
        prev.map(n => 
          n._id === notification._id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      );
      
      if (unreadCount > 0) {
        setUnreadCount(prev => prev - 1);
      }
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
      
      setUnreadCount(0);
      toast.success('Wszystkie powiadomienia oznaczone jako przeczytane');
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
      toast.error('Nie udało się oznaczyć wszystkich powiadomień jako przeczytane');
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
        
        if (unreadCount > 0) {
          setUnreadCount(prev => prev - 1);
        }
      } catch (error) {
        console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
      }
    }
    
    // Zamknij dropdown
    setIsOpen(false);
    
    // Przekieruj do odpowiedniej strony, jeśli jest akcja
    if (notification.action) {
      router.push(notification.action);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">S</div>;
      case 'task':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">T</div>;
      case 'reminder':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">R</div>;
      case 'system':
        return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">S</div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">N</div>;
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

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: pl });
    } catch (error) {
      return 'nieznana data';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 md:w-96 z-50 shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Powiadomienia</h3>
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Oznacz wszystkie jako przeczytane
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm truncate">{notification.title}</p>
                          <Badge className={`ml-2 ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={(e) => handleMarkAsRead(notification, e)}
                            >
                              Oznacz jako przeczytane
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Brak powiadomień
              </div>
            )}
          </div>
          
          <div className="p-2 border-t text-center">
            <Link href="/notifications" onClick={() => setIsOpen(false)}>
              <Button variant="link" className="text-sm">
                Zobacz wszystkie powiadomienia
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
