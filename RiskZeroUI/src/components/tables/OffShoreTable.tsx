import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import type {
  OffshoreResult,
  ScreeningResult,
} from "../../types/screeningType";

interface Props {
  data: ScreeningResult[];
}

const OffshoreTable: React.FC<Props> = ({ data }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell>Entidad</TableCell>
          <TableCell>Jurisdicción</TableCell>
          <TableCell>Vinculado a</TableCell>
          <TableCell>Fuente de Datos</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => {
          const data = item.data as OffshoreResult;

          const cleanValue = (value: string | undefined): string => {
            if (!value || value.trim() === '' || value === '&nbsp;') {
              return 'N/A';
            }
            return value.trim();
          };
          return (
            <TableRow key={index} hover>
              <TableCell>{cleanValue(data.Entity)}</TableCell>
              <TableCell>{cleanValue(data.Jurisdiction)}</TableCell>
              <TableCell>{cleanValue(data["Linked to"])}</TableCell>
              <TableCell>{cleanValue(data["Data From"])}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OffshoreTable;
