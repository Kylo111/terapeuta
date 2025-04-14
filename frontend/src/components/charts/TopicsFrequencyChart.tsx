'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopicsFrequencyChartProps {
  data: Array<{
    topic: string;
    count: number;
  }>;
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
  maxTopics?: number;
}

export default function TopicsFrequencyChart({
  data,
  title = 'Częstotliwość tematów',
  description = 'Najczęściej omawiane tematy podczas sesji',
  showLegend = false,
  height = 300,
  maxTopics = 10
}: TopicsFrequencyChartProps) {
  // Sortowanie danych według liczby wystąpień (malejąco)
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, maxTopics);

  // Przygotowanie etykiet (tematy)
  const labels = sortedData.map(item => {
    // Skracanie długich tematów
    const maxLength = 30;
    return item.topic.length > maxLength ? item.topic.substring(0, maxLength) + '...' : item.topic;
  });

  // Przygotowanie danych dla wykresu
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Liczba wystąpień',
        data: sortedData.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            // Pokazuj pełny temat w tooltipie
            return data[index].topic;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Liczba wystąpień'
        },
        ticks: {
          precision: 0
        }
      }
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
          <Bar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
