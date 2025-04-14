'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { exportToJSON, exportToCSV, exportToPDF, exportToZIP, ExportOptions } from '@/lib/api/exportApi';
import { toast } from 'react-toastify';

export default function ExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [options, setOptions] = useState<ExportOptions>({
    includeUser: true,
    includeProfiles: true,
    includeSessions: true,
    includeTasks: true,
    includeReports: false,
    includeTherapyMethods: true,
    includePrompts: true
  });

  const handleOptionChange = (option: keyof ExportOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      switch (exportFormat) {
        case 'json':
          const data = await exportToJSON(options);
          // Zapisanie danych JSON do pliku
          const jsonString = JSON.stringify(data, null, 2);
          const jsonBlob = new Blob([jsonString], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = 'export.json';
          document.body.appendChild(jsonLink);
          jsonLink.click();
          document.body.removeChild(jsonLink);
          URL.revokeObjectURL(jsonUrl);
          break;
        case 'csv':
          await exportToCSV(options);
          break;
        case 'pdf':
          await exportToPDF(options);
          break;
        case 'zip':
          await exportToZIP(options);
          break;
        default:
          throw new Error('Nieobsługiwany format eksportu');
      }
      
      toast.success('Dane zostały wyeksportowane');
    } catch (error) {
      console.error('Błąd podczas eksportu danych:', error);
      toast.error('Nie udało się wyeksportować danych');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eksport danych</CardTitle>
        <CardDescription>
          Wyeksportuj swoje dane do wybranego formatu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Format eksportu</h3>
          <RadioGroup
            value={exportFormat}
            onValueChange={setExportFormat}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="cursor-pointer">JSON (pełne dane)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="cursor-pointer">CSV (dane tabelaryczne)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="cursor-pointer">PDF (raport)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zip" id="zip" />
              <Label htmlFor="zip" className="cursor-pointer">ZIP (archiwum wszystkich formatów)</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Dane do eksportu</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeUser"
                checked={options.includeUser}
                onCheckedChange={() => handleOptionChange('includeUser')}
              />
              <Label htmlFor="includeUser" className="cursor-pointer">Dane użytkownika</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeProfiles"
                checked={options.includeProfiles}
                onCheckedChange={() => handleOptionChange('includeProfiles')}
              />
              <Label htmlFor="includeProfiles" className="cursor-pointer">Profile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSessions"
                checked={options.includeSessions}
                onCheckedChange={() => handleOptionChange('includeSessions')}
              />
              <Label htmlFor="includeSessions" className="cursor-pointer">Sesje terapeutyczne</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTasks"
                checked={options.includeTasks}
                onCheckedChange={() => handleOptionChange('includeTasks')}
              />
              <Label htmlFor="includeTasks" className="cursor-pointer">Zadania</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeReports"
                checked={options.includeReports}
                onCheckedChange={() => handleOptionChange('includeReports')}
              />
              <Label htmlFor="includeReports" className="cursor-pointer">Raporty</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTherapyMethods"
                checked={options.includeTherapyMethods}
                onCheckedChange={() => handleOptionChange('includeTherapyMethods')}
              />
              <Label htmlFor="includeTherapyMethods" className="cursor-pointer">Metody terapii</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePrompts"
                checked={options.includePrompts}
                onCheckedChange={() => handleOptionChange('includePrompts')}
              />
              <Label htmlFor="includePrompts" className="cursor-pointer">Prompty</Label>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">Informacja o prywatności</h4>
          <p className="text-sm text-yellow-700">
            Eksportowane dane mogą zawierać informacje osobiste i wrażliwe. Przechowuj je w bezpiecznym miejscu i nie udostępniaj ich osobom trzecim.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          {isExporting ? 'Eksportowanie...' : 'Eksportuj dane'}
        </Button>
      </CardFooter>
    </Card>
  );
}
