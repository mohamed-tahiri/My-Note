import { Box, Typography, Grid, IconButton, Stack, alpha } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Professional' | 'Personal' | 'Medical';
}

export default function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Logique de calcul des jours du calendrier
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getColorByType = (type: string) => {
    switch(type) {
      case 'Professional': return '#2563eb';
      case 'Medical': return '#10b981';
      case 'Personal': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Contrôles du Calendrier */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, px: 1 }}>
        <Typography variant="h6" fontWeight={800} sx={{ textTransform: 'capitalize' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>

      {/* Grille des Jours de la semaine */}
      <Grid container columns={7} sx={{ mb: 1, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <Grid key={day} size={1} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={700} color="text.disabled">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Grille du Calendrier */}
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '1px', 
        bgcolor: 'divider',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {calendarDays.map((day, idx) => {
          const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <Box key={idx} sx={{ 
              minHeight: '120px', 
              bgcolor: isCurrentMonth ? 'background.paper' : alpha('#64748b', 0.05),
              p: 1,
              transition: '0.2s',
              '&:hover': { bgcolor: isCurrentMonth ? alpha('#2563eb', 0.02) : 'none' }
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: isToday ? 800 : 500,
                  color: isToday ? 'primary.main' : isCurrentMonth ? 'text.primary' : 'text.disabled',
                  mb: 1,
                  display: 'inline-block',
                  width: 24, height: 24, textAlign: 'center', lineHeight: '24px',
                  borderRadius: '50%',
                  bgcolor: isToday ? alpha('#2563eb', 0.1) : 'transparent'
                }}
              >
                {format(day, 'd')}
              </Typography>

              <Stack spacing={0.5}>
                {dayAppointments.map(apt => (
                  <Box key={apt.id} sx={{ 
                    px: 1, py: 0.3, 
                    borderRadius: '4px', 
                    bgcolor: alpha(getColorByType(apt.type), 0.1),
                    borderLeft: `3px solid ${getColorByType(apt.type)}`,
                    overflow: 'hidden'
                  }}>
                    <Typography variant="caption" noWrap sx={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: getColorByType(apt.type) }}>
                      {apt.title}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}