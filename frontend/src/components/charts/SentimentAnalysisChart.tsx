'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SentimentAnalysisChartProps {
  data: Array<{
    date: string;
    sentiment: number;
    source?: string;
  }>;
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

export default function SentimentAnalysisChart({
  data,
  title = 'Analiza sentymentu',
  description = 'Zmiany sentymentu w czasie',
  showLegend = true,
  height = 300
}: SentimentAnalysisChartProps) {
  // Sortowanie danych według daty
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Przygotowanie etykiet (daty)
  const labels = sortedData.map(item => formatDate(item.date));

  // Grupowanie danych według źródła
  const sourceGroups = sortedData.reduce((groups, item) => {
    const source = item.source || 'Ogólny';
    if (!groups[source]) {
      groups[source] = [];
    }
    groups[source].push(item);
    return groups;
  }, {} as Record<string, typeof sortedData>);

  // Kolory dla różnych źródeł
  const colors = [
    { borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
    { borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
    { borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)' },
    { borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)' },
    { borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)' }
  ];

  // Przygotowanie danych dla wykresu
  const datasets = Object.entries(sourceGroups).map(([source, items], index) => {
    const colorIndex = index % colors.length;
    return {
      label: source,
      data: items.map(item => item.sentiment),
      borderColor: colors[colorIndex].borderColor,
      backgroundColor: colors[colorIndex].backgroundColor,
      tension: 0.3
    };
  });

  // Jeśli nie ma grupowania według źródła, pokaż wszystkie dane jako jedną serię
  const chartData = {
    labels,
    datasets: datasets.length > 0 ? datasets : [
      {
        label: 'Sentyment',
        data: sortedData.map(item => item.sentiment),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend && datasets.length > 1,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += value.toFixed(2);
            
            // Dodaj interpretację sentymentu
            if (value > 0.5) {
              label += ' (Bardzo pozytywny)';
            } else if (value > 0.25) {
              label += ' (Pozytywny)';
            } else if (value > -0.25) {
              label += ' (Neutralny)';
            } else if (value > -0.5) {
              label += ' (Negatywny)';
            } else {
              label += ' (Bardzo negatywny)';
            }
            
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        title: {
          display: true,
          text: 'Sentyment (-1 do 1)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <Line options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
