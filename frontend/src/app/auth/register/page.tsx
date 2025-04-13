'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as apiRegister } from '@/lib/api/authApi';
import AuthLayout from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  confirmPassword: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await apiRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      toast.success('Konto zostało utworzone. Możesz się teraz zalogować.');
      router.push('/auth/login');
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      toast.error('Błąd rejestracji. Sprawdź dane i spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Utwórz nowe konto"
      description="Lub zaloguj się, jeśli masz już konto"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Input
              label="Imię"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
          </div>
          <div>
            <Input
              label="Nazwisko"
              type="text"
              autoComplete="family-name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
        </div>

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
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div>
          <Input
            label="Potwierdź hasło"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
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
          <Link href="/auth/login">
            <Button
              type="button"
              variant="outline"
              className="w-full"
            >
              Zaloguj się
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
