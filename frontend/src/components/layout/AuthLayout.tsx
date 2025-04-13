'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-primary-600">Terapeuta</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-2 text-center text-sm text-gray-600">{description}</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Terapeuta. Wszystkie prawa zastrzeżone.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;
