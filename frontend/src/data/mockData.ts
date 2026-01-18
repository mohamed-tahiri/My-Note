import React from 'react';
import type { Column } from '@/components/admin/ui/GenericTable';
import { Chip, Stack, Typography } from '@mui/material';
import { Globe, Lock, Unlock } from 'lucide-react';

export interface PerformanceData {
    name: string;
    sales: number;
    revenue: number;
}

export const monthlyData: PerformanceData[] = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
];

export const performanceData = [
    { name: '00:00', volume: 400, latency: 240, load: 2400 },
    { name: '04:00', volume: 300, latency: 139, load: 2210 },
    { name: '08:00', volume: 600, latency: 980, load: 2290 },
    { name: '12:00', volume: 800, latency: 390, load: 2000 },
    { name: '16:00', volume: 500, latency: 480, load: 2181 },
    { name: '20:00', volume: 900, latency: 380, load: 2500 },
];

export const networkData = [
    { time: '10:00', load: 30 },
    { time: '10:05', load: 45 },
    { time: '10:10', load: 35 },
    { time: '10:15', load: 60 },
    { time: '10:20', load: 55 },
    { time: '10:25', load: 75 },
    { time: '10:20', load: 55 },
    { time: '10:25', load: 75 },
    { time: '10:20', load: 55 },
    { time: '10:25', load: 75 },
    { time: '10:20', load: 55 },
    { time: '10:25', load: 75 },
    { time: '10:30', load: 90 },
    { time: '10:35', load: 80 },
    { time: '10:40', load: 95 },
    { time: '10:45', load: 100 },
];

export const distributionData = [
    { name: 'Cloud', value: 400, color: '#6366f1' },
    { name: 'On-Prem', value: 300, color: '#8b5cf6' },
    { name: 'Edge', value: 200, color: '#a855f7' },
];

export const resourceBalanceData = [
    { subject: 'CPU', A: 120, fullMark: 150 },
    { subject: 'RAM', A: 98, fullMark: 150 },
    { subject: 'Disk', A: 86, fullMark: 150 },
    { subject: 'Net', A: 99, fullMark: 150 },
    { subject: 'Load', A: 85, fullMark: 150 },
];

export const threatData = [
    { subject: 'Brute Force', A: 120 },
    { subject: 'SQLi', A: 45 },
    { subject: 'DDoS', A: 150 },
    { subject: 'Malware', A: 80 },
    { subject: 'Phishing', A: 60 },
];

export const alertFrequency = [
    { time: '00h', count: 12 },
    { time: '04h', count: 8 },
    { time: '08h', count: 45 },
    { time: '12h', count: 30 },
    { time: '16h', count: 85 },
    { time: '20h', count: 40 },
];

interface Server {
    id: number;
    name: string;
    status: string;
    ip: string;
    load: string;
}

export const serverColumns: Column<Server>[] = [
    { header: 'Serveur', key: 'name', render: (s) => React.createElement('b', null, s.name) },
    {
        header: 'Statut',
        key: 'status',
        render: (s) =>
            React.createElement(Chip, {
                label: s.status,
                color: s.status === 'Online' ? 'success' : 'warning',
                size: 'small',
            }),
    },
    { header: 'IP Address', key: 'ip' },
    { header: 'Charge', key: 'load' },
];

export const servers = [
    { id: 1, name: 'Production-DB-01', status: 'Online', ip: '192.168.1.1', load: '12%' },
    { id: 2, name: 'Auth-Service-Api', status: 'Warning', ip: '192.168.1.5', load: '88%' },
    { id: 3, name: 'Cloud-Storage-S3', status: 'Online', ip: '10.0.4.21', load: '45%' },
];

export interface SecurityLog {
    id: number;
    event: string;
    ip: string;
    level: 'High' | 'Medium' | 'Info' | 'Success';
    time: string;
    status: 'Blocked' | 'Success' | 'Review';
    location: string;
}

export const securityLogs: SecurityLog[] = [
    {
        id: 1,
        event: 'Tentative de connexion bloquée',
        ip: '192.168.1.45',
        level: 'High',
        time: '13:02:11',
        status: 'Blocked',
        location: 'FR',
    },
    {
        id: 2,
        event: 'Clé API régénérée - Admin',
        ip: '10.0.0.1',
        level: 'Info',
        time: '12:45:00',
        status: 'Success',
        location: 'Internal',
    },
    {
        id: 3,
        event: 'Accès suspect détecté',
        ip: '172.16.254.1',
        level: 'Medium',
        time: '11:20:05',
        status: 'Review',
        location: 'US',
    },
    {
        id: 4,
        event: 'Certificat SSL mis à jour',
        ip: 'System',
        level: 'Success',
        time: '09:00:00',
        status: 'Success',
        location: 'Cloud',
    },
];

export const logColumns: Column<SecurityLog>[] = [
    {
        header: 'Événement',
        key: 'event',
        render: (log) =>
            React.createElement(Stack, { direction: 'row', spacing: 1.5, alignItems: 'center' }, [
                React.createElement('span', { style: { display: 'flex' } }, [
                    log.level === 'High'
                        ? React.createElement(Lock, { size: 16, color: '#EF4444' })
                        : React.createElement(Unlock, { size: 16, color: '#64748B' }),
                ]),
                React.createElement(Typography, { variant: 'body2', fontWeight: 600 }, log.event),
            ]),
    },
    {
        header: 'Origine',
        key: 'ip',
        render: (log) =>
            React.createElement(Stack, { direction: 'row', spacing: 1, alignItems: 'center' }, [
                React.createElement(Globe, { size: 14, color: '#94A3B8' }),
                React.createElement(
                    Typography,
                    { variant: 'caption', sx: { fontFamily: 'monospace' } },
                    log.ip
                ),
                React.createElement(Chip, {
                    label: log.location,
                    size: 'small',
                    variant: 'outlined',
                    sx: { fontSize: '10px', height: 18 },
                }),
            ]),
    },
    {
        header: 'Sévérité',
        key: 'level',
        render: (log) =>
            React.createElement(Chip, {
                label: log.level,
                size: 'small',
                sx: {
                    fontWeight: 800,
                    bgcolor: log.level === 'High' ? '#FEE2E2' : '#F1F5F9',
                    color: log.level === 'High' ? '#EF4444' : '#64748B',
                    borderRadius: '6px',
                },
            }),
    },
    {
        header: 'Horodatage',
        key: 'time',
        render: (log) =>
            React.createElement(
                Typography,
                { variant: 'caption', color: 'text.secondary' },
                log.time
            ),
    },
];
