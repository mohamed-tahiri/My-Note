import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Box, Typography 
} from '@mui/material';
import type { ReactNode } from 'react';

// Définition d'une colonne
export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => ReactNode; // Fonction optionnelle pour un rendu personnalisé (Chip, Icon, etc.)
  align?: 'left' | 'center' | 'right';
}

interface GenericTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
}

export const GenericTable = <T extends { id: string | number }>({ 
  title, 
  data, 
  columns 
}: GenericTableProps<T>) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" color='text.primary' marginTop={10} fontWeight={700} mb={2}>
        {title}
      </Typography>
                        
      <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} align={col.align} sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} hover>
                {columns.map((col, index) => (
                  <TableCell key={index} align={col.align}>
                    {/* Si une fonction render est fournie, on l'utilise, sinon on affiche la valeur brute */}
                    {col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};