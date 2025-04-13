'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/context/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Zalogowano pomyślnie');
    } catch (error) {
      console.error('Błąd logowania:', error);
      toast.error('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Zaloguj się do swojego konta"
      description="Lub utwórz nowe konto, jeśli jeszcze go nie masz"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            label="Adres email"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div>
          <Input
            label="Hasło"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Zapamiętaj mnie
            </label>
          </div>

          <div className="text-sm">
            <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              Zapomniałeś hasła?
            </Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Lub</span>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/auth/register">
            <Button
              type="button"
              variant="outline"
              className="w-full"
            >
              Zarejestruj się
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
