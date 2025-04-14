'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JournalEntry, deleteJournalEntry } from '@/lib/api/journalApi';
import { toast } from 'react-toastify';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/AlertDialog';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';

interface JournalEntryDetailsProps {
  entry: JournalEntry;
}

export default function JournalEntryDetails({ entry }: JournalEntryDetailsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteJournalEntry(entry._id);
      toast.success('Wpis został usunięty');
      router.push('/journal');
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu:', error);
      toast.error('Nie udało się usunąć wpisu');
      setIsDeleting(false);
    }
  };

  const getEmotionChange = (emotionName: string) => {
    const before = entry.emotions.find(e => e.name === emotionName);
    const after = entry.emotionsAfter?.find(e => e.name === emotionName);
    
    if (!before) return null;
    
    if (!after) {
      return (
        <div className="flex items-center">
          <span className="font-medium">{emotionName}:</span>
          <span className="ml-2">{before.intensity}/10</span>
        </div>
      );
    }
    
    const change = after.intensity - before.intensity;
    const changeText = change > 0 ? `+${change}` : change;
    const changeClass = change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className="flex items-center">
        <span className="font-medium">{emotionName}:</span>
        <span className="ml-2">{before.intensity}/10</span>
        <span className="mx-2">→</span>
        <span className="mr-1">{after.intensity}/10</span>
        <span className={changeClass}>({changeText})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powrót
        </Button>
        
        <div className="flex space-x-2">
          <Link href={`/journal/edit/${entry._id}`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edytuj
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Usuwanie...' : 'Usuń'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy na pewno chcesz usunąć ten wpis?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta akcja jest nieodwracalna. Wpis zostanie trwale usunięty z systemu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{formatDate(entry.date)}</CardTitle>
              <CardDescription>
                {entry.profileName || 'Profil'}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {entry.tags && entry.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="ml-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Sytuacja</h3>
            <p className="text-gray-700">{entry.situation}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Myśli automatyczne</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {entry.automaticThoughts.map((thought, index) => (
                <li key={index}>{thought}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Emocje</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.emotions.map((emotion, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-medium">{emotion.name}:</span>
                  <div className="ml-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${emotion.intensity * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-gray-700">{emotion.intensity}/10</span>
                </div>
              ))}
            </div>
          </div>
          
          {entry.physicalReactions && entry.physicalReactions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Reakcje fizyczne</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {entry.physicalReactions.map((reaction, index) => (
                  <li key={index}>{reaction}</li>
                ))}
              </ul>
            </div>
          )}
          
          {entry.cognitiveDistortions && entry.cognitiveDistortions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Zniekształcenia poznawcze</h3>
              <div className="flex flex-wrap gap-2">
                {entry.cognitiveDistortions.map((distortion, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-800 border-red-200">
                    {distortion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {entry.alternativeThoughts && entry.alternativeThoughts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Alternatywne myśli</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {entry.alternativeThoughts.map((thought, index) => (
                  <li key={index}>{thought}</li>
                ))}
              </ul>
            </div>
          )}
          
          {entry.emotionsAfter && entry.emotionsAfter.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Zmiana emocji</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entry.emotions.map((emotion, index) => (
                  <div key={index}>
                    {getEmotionChange(emotion.name)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {entry.conclusions && (
            <div>
              <h3 className="text-lg font-medium mb-2">Wnioski</h3>
              <p className="text-gray-700">{entry.conclusions}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
