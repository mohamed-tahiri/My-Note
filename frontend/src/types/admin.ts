import type { ReactNode } from 'react';

export interface BaseComponentProps {
  children?: ReactNode;
}

export interface MenuButtonProps {
  icon: ReactNode;     
  label: string;        
  active?: boolean;     
}

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;      
  iconBgColor?: string;  
  rightContent?: ReactNode; 
}

export interface StatsProps {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode; 
}
interface RadarData {
  subject: string;
  A: number;
}

export interface BaseRadarChartProps {
  title: string;
  data: RadarData[];
  color?: string; 
  height?: number;
}

export interface MetricProgressProps {
  label: string;
  value: number;
  subLabel?: string; 
  color?: string;   
  autoColor?: boolean; 
}

interface DonutData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number; 
}

export interface BaseDonutChartProps {
    title: string;
    data: DonutData[];
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
}


export interface ChartData {
  time: string;
  [key: string]: string | number;
}

export interface BaseAreaChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;      
  color?: string;       
  height?: number | string;
}

export interface MetricData {
  label: string;
  value: number;
  subLabel?: string;
  color?: string;
}

export interface LogEntry {
  id: number;
  event: string;
  ip: string;
  level: 'High' | 'Medium' | 'Info' | 'Success';
  time: string;
  status?: string;
  location?: string;
}

export interface ChartDataItem {
  [key: string]: string | number;
}

export interface BaseBarChartProps<T extends ChartDataItem> {
  title: string;
  data: T[];
  xAxisKey: keyof T;
  barKey: keyof T;
  color?: string;
  height?: number;
  barSize?: number;
}

export interface BaseComposedChartProps<T extends ChartDataItem> {
  title: string;
  data: T[];
  xAxisKey: keyof T;
  areaKey: keyof T;
  barKey: keyof T;
  lineKey: keyof T;
  height?: number;
}

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => ReactNode; // Fonction optionnelle pour un rendu personnalisé (Chip, Icon, etc.)
  align?: 'left' | 'center' | 'right';
}

export interface GenericTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
}