import { Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import type { ScreeningResult, WorldBankResult } from '../../types/screeningType';

interface Props {
  data: ScreeningResult[];
}

const WorldBankTable: React.FC<Props> = ({ data }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre de la Firma</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>País</TableCell>
            <TableCell>Desde</TableCell>
            <TableCell>Hasta</TableCell>
            <TableCell>Motivo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => {
            const data = item.data as WorldBankResult;
             const cleanValue = (value: string | undefined): string => {
            if (!value || value.trim() === '' || value === '&nbsp;') {
              return 'N/A';
            }
            return value.trim();
          };
            return (
              <TableRow key={index} hover>
                <TableCell>{cleanValue(data['Firm Name'])}</TableCell>
                <TableCell>{`${cleanValue(data.Address)}, ${cleanValue(data.City)}`}</TableCell>
                <TableCell>{cleanValue(data.Country)}</TableCell>
                <TableCell>{cleanValue(data['From Date'])}</TableCell>
                <TableCell>{cleanValue(data['To Date'])}</TableCell>
                <TableCell>{cleanValue(data.Grounds)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WorldBankTable;