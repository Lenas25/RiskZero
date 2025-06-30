import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import type { OfacResult, ScreeningResult } from "../../types/screeningType";

interface Props {
  data: ScreeningResult[];
}

const OfacTable: React.FC<Props> = ({ data }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Dirección</TableCell>
          <TableCell>Tipo</TableCell>
          <TableCell>Programa(s)</TableCell>
          <TableCell>Lista</TableCell>
          <TableCell>Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => {
          const data = item.data as OfacResult;
          
          const cleanValue = (value: string | undefined): string => {
            if (!value || value.trim() === '' || value === '&nbsp;') {
              return 'N/A';
            }
            return value.trim();
          };
          
          return (
            <TableRow key={index} hover>
              <TableCell>{cleanValue(data.Name)}</TableCell>
              <TableCell>{cleanValue(data.Address)}</TableCell>
              <TableCell>{cleanValue(data.Type)}</TableCell>
              <TableCell>{cleanValue(data["Program(s)"])}</TableCell>
              <TableCell>{cleanValue(data.List)}</TableCell>
              <TableCell>{cleanValue(data.Score)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OfacTable;
