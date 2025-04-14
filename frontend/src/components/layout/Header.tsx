'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Nie wyświetlaj nagłówka na stronach logowania i rejestracji
  if (pathname.startsWith('/auth/')) {
    return null;
  }

  // Nie wyświetlaj nagłówka na stronie głównej
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 md:left-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:hidden">
            <h1 className="text-xl font-bold text-primary-600">Terapeuta</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/notifications/reminder">
              <Button variant="outline" size="sm">
                Dodaj przypomnienie
              </Button>
            </Link>
            
            <NotificationBell />
            
            {user && (
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
