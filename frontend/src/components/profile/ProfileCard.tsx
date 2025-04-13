'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface ProfileProps {
  profile: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    goals: string[];
    challenges: string[];
    isActive: boolean;
    createdAt: string;
  };
}

const ProfileCard: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <Card className={`${profile.isActive ? 'border-primary-500 border-2' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <p className="text-sm text-gray-500">
              {profile.age} lat, {profile.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
            </p>
          </div>
          {profile.isActive && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Aktywny
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900">Cele:</h3>
          <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
            {profile.goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">Wyzwania:</h3>
          <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
            {profile.challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Utworzono: {formatDate(profile.createdAt)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/profile/${profile._id}`}>
          <Button variant="outline">Szczegóły</Button>
        </Link>
        <Link href={`/sessions/new?profileId=${profile._id}`}>
          <Button>Rozpocznij sesję</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
