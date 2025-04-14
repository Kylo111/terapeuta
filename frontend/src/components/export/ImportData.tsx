'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { importFromJSON, ImportOptions, ImportResult } from '@/lib/api/exportApi';
import { toast } from 'react-toastify';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function ImportData() {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [options, setOptions] = useState<ImportOptions>({
    importProfiles: true,
    importSessions: true,
    importTasks: true,
    importTherapyMethods: true,
    importPrompts: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOptionChange = (option: keyof ImportOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Wybierz plik do importu');
      return;
    }

    try {
      setIsImporting(true);
      
      // Odczytanie zawartości pliku
      const fileReader = new FileReader();
      
      const readFilePromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Błąd odczytu pliku'));
          }
        };
        fileReader.onerror = () => reject(new Error('Błąd odczytu pliku'));
      });
      
      fileReader.readAsText(selectedFile);
      
      const fileContent = await readFilePromise;
      
      // Parsowanie JSON
      const data = JSON.parse(fileContent);
      
      // Import danych
      const result = await importFromJSON(data, options);
      setImportResult(result);
      
      toast.success('Dane zostały zaimportowane');
    } catch (error) {
      console.error('Błąd podczas importu danych:', error);
      toast.error('Nie udało się zaimportować danych');
    } finally {
      setIsImporting(false);
    }
  };

  const getTotalImported = () => {
    if (!importResult) return 0;
    return (
      importResult.profiles.imported +
      importResult.sessions.imported +
      importResult.tasks.imported +
      importResult.therapyMethods.imported +
      importResult.prompts.imported
    );
  };

  const getTotalErrors = () => {
    if (!importResult) return 0;
    return (
      importResult.profiles.errors +
      importResult.sessions.errors +
      importResult.tasks.errors +
      importResult.therapyMethods.errors +
      importResult.prompts.errors
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import danych</CardTitle>
        <CardDescription>
          Zaimportuj swoje dane z pliku JSON
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Wybierz plik</h3>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Wybierz plik JSON
            </Button>
            <span className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : 'Nie wybrano pliku'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Dane do importu</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="importProfiles"
                checked={options.importProfiles}
                onCheckedChange={() => handleOptionChange('importProfiles')}
              />
              <Label htmlFor="importProfiles" className="cursor-pointer">Profile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="importSessions"
                checked={options.importSessions}
                onCheckedChange={() => handleOptionChange('importSessions')}
              />
              <Label htmlFor="importSessions" className="cursor-pointer">Sesje terapeutyczne</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="importTasks"
                checked={options.importTasks}
                onCheckedChange={() => handleOptionChange('importTasks')}
              />
              <Label htmlFor="importTasks" className="cursor-pointer">Zadania</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="importTherapyMethods"
                checked={options.importTherapyMethods}
                onCheckedChange={() => handleOptionChange('importTherapyMethods')}
              />
              <Label htmlFor="importTherapyMethods" className="cursor-pointer">Metody terapii</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="importPrompts"
                checked={options.importPrompts}
                onCheckedChange={() => handleOptionChange('importPrompts')}
              />
              <Label htmlFor="importPrompts" className="cursor-pointer">Prompty</Label>
            </div>
          </div>
        </div>

        {importResult && (
          <div className="space-y-4">
            <Alert variant={getTotalErrors() === 0 ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wynik importu</AlertTitle>
              <AlertDescription>
                Zaimportowano {getTotalImported()} elementów. Wystąpiło {getTotalErrors()} błędów.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 border rounded-md">
                <span>Profile</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {importResult.profiles.imported}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {importResult.profiles.errors}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded-md">
                <span>Sesje</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {importResult.sessions.imported}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {importResult.sessions.errors}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded-md">
                <span>Zadania</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {importResult.tasks.imported}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {importResult.tasks.errors}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded-md">
                <span>Metody terapii</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {importResult.therapyMethods.imported}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {importResult.therapyMethods.errors}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded-md">
                <span>Prompty</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {importResult.prompts.imported}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {importResult.prompts.errors}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">Uwaga</h4>
          <p className="text-sm text-yellow-700">
            Import danych może nadpisać istniejące dane. Zaleca się wykonanie kopii zapasowej przed importem.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleImport} disabled={isImporting || !selectedFile} className="w-full">
          {isImporting ? 'Importowanie...' : 'Importuj dane'}
        </Button>
      </CardFooter>
    </Card>
  );
}
