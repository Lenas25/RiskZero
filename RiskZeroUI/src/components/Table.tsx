import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridSortModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
// import { Link } from "react-router-dom"; // Quitar esta importación si no la usas para navegación interna
import MuiLink from "@mui/material/Link"; // Usar el Link de Material-UI para enlaces externos
import LinkIcon from "@mui/icons-material/Link";
import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import type { Supplier } from "../types/supplierType";

interface TableProps {
  rows: Supplier[];
  loading: boolean;
  onEditClick: (supplier: Supplier) => void;
  onDeleteClick: (supplier: Supplier) => void;
  onViewClick: (supplier: Supplier) => void;
}

const initialSortModel: GridSortModel = [
  {
    field: 'updatedAt',
    sort: 'desc',
  },
];

const paginationModel = { page: 0, pageSize: 5 };

const Table: React.FC<TableProps> = ({ rows, loading, onEditClick, onDeleteClick, onViewClick }) => {

  const columns: GridColDef<Supplier>[] = [
    { field: "taxId", headerName: "NIT", width: 110, type: "string" },
    { field: "legalName", headerName: "Razón social", width: 130, type: "string" },
    { field: "tradeName", headerName: "Nombre comercial", width: 130, type: "string" },
    {
      field: "phoneNumber",
      headerName: "Teléfono",
      width: 130,
      type: "string", 
      renderCell: (params: GridRenderCellParams<Supplier>) => (
        // Usar MuiLink para tel:
        <MuiLink href={`tel:${params.value}`}>{params.value}</MuiLink>
      ),
    },
    { field: "email", headerName: "Correo electrónico", width: 180, type: "string" },
    { field: "physicalAddress", headerName: "Dirección", width: 180, type: "string" },
    {
      field: "country",
      headerName: "País",
      width: 120,
      type: "string",
      valueGetter: (_, row) => row.country?.name, 
    },
    {
      field: "annualRevenueUsd",
      headerName: "Facturación Anual (USD)",
      width: 130,
      type: "number", // Tipo numérico
      // valueFormatter ahora recibe 'params' como objeto
      valueFormatter: (value, ) => {
        if (value == null) {
          return "";
        }
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value as number);
      },
    },
    {
      field: "updatedAt",
      headerName: "Última Edición",
      width: 160,
      type: "dateTime",
      sortable: true,
      valueFormatter: (value, ) => {
        if (value == null) {
          return "";
        }
        return new Date(value as string).toLocaleString();
      },
    },
    {
      field: "website",
      headerName: "Sitio web",
      width: 180,
      type: "string",
      renderCell: (params: GridRenderCellParams<Supplier>) => {
        const websiteUrl = params.value as string;
        const displayUrl =
          websiteUrl && websiteUrl.length > 20
            ? `${websiteUrl.substring(0, 20)}...`
            : websiteUrl;

        const fullUrl = websiteUrl && !websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')
                        ? `http://${websiteUrl}`
                        : websiteUrl;

        return websiteUrl ? (
          <MuiLink // Usar MuiLink para enlaces externos
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {displayUrl}
            <LinkIcon sx={{ fontSize: 16, marginLeft: 0.5 }} />
          </MuiLink>
        ) : null;
      },
    },
    {
      field: "actions",
      headerName: "Opciones",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Supplier>) => {
        return (
          <Box>
            <Tooltip title="Editar">
              <IconButton
                style={{ color: "black" }}
                size="small"
                onClick={() => onEditClick(params.row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                size="small"
                onClick={() => onDeleteClick(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Detalles">
              <IconButton
                color="primary"
                size="small"
                onClick={() => onViewClick(params.row)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto mt-5">
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel },
            sorting: { sortModel: initialSortModel },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
          getRowId={(row) => row.taxId}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>
    </div>
  );
};

export default Table;