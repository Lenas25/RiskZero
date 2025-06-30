import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { Supplier } from "../types/supplierType";
import type {
  ScreeningResult,
  ScreeningType,
} from "../types/screeningType";
import WorldBankTable from "./tables/WorldBankTable";
import OffshoreTable from "./tables/OffShoreTable";
import OfacTable from "./tables/OfacTable";
import { getHighList } from "../api/screeningService";

// Importamos los componentes de tabla

const AVAILABLE_SOURCES = [
  { id: "The World Bank", label: "The World Bank" },
  { id: "Offshore Leaks Database", label: "Offshore Leaks Database" },
  { id: "OFAC", label: "OFAC" },
];

interface ScreeningModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier;
  getCachedData?: (supplier: Supplier) => ScreeningType | null;
  saveCachedData?: (supplier: Supplier, data: ScreeningType) => void;
  clearCachedData?: (supplier: Supplier) => void;
}

const ScreeningModal: React.FC<ScreeningModalProps> = ({
  open,
  onClose,
  supplier,
  getCachedData,
  saveCachedData,
  clearCachedData,
}) => {
  const [visibleSources, setVisibleSources] = useState<string[]>(
    AVAILABLE_SOURCES.map((s) => s.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScreeningType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && supplier) {
      if (getCachedData) {
        const cachedData = getCachedData(supplier);
        if (cachedData) {
          setResults(cachedData);
          setError(null);
          return;
        }
      }

      const fetchScreeningData = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
          const response = await getHighList(supplier, {
            entityName: supplier.legalName || supplier.tradeName,
          });

          if (
            saveCachedData &&
            response &&
            typeof response === "object" &&
            "hitsFound" in response &&
            "results" in response
          ) {
            saveCachedData(supplier, response as ScreeningType);
          }

          setResults(
            response && "hitsFound" in response && "results" in response
              ? (response as ScreeningType)
              : null
          );
        } catch (err) {
          console.error("Error fetching screening data:", err);
          setError(
            "Ocurrió un error al consultar las fuentes de datos. Por favor, intente de nuevo."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchScreeningData();
    }
  }, [open, supplier, getCachedData, saveCachedData]);

  // Se activa cada vez que el usuario hace clic en un checkbox para filtrar
  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sourceId = event.target.value;
    setVisibleSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((s) => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleClose = () => {
    onClose();
  };

  const handleRefresh = () => {
    if (supplier && clearCachedData) {
      // Limpiar el caché para este proveedor usando la función externa
      clearCachedData(supplier);
      setResults(null);
      setError(null);
    }
  };

  const renderTablesForSelectedSources = () => {
    if (!results || results.results.length === 0) {
      // Si no hay resultados, mostrar un mensaje de éxito
      return (
        <Alert severity="success">
          No se encontraron coincidencias en ninguna fuente de datos.
        </Alert>
      );
    }

    return visibleSources.map((sourceId) => {
      // Filtrar los resultados para obtener solo los de esta fuente
      const sourceResults = results.results.filter(
        (result) => result.source === sourceId
      );
      if (sourceResults.length === 0) {
        // No hay datos para esta fuente
        return (
          <Box mt={2} mb={3} key={sourceId}>
            <Typography variant="h6" gutterBottom>
              {sourceId}
            </Typography>
            <Alert severity="info">
              No se encontraron coincidencias en esta fuente.
            </Alert>
          </Box>
        );
      }

      return (
        <Box mt={2} mb={4} key={sourceId}>
          <Typography variant="h6" gutterBottom>
            {sourceId}
          </Typography>
          {
            {
              'The World Bank': <WorldBankTable data={sourceResults as ScreeningResult[]} />,
              'Offshore Leaks Database': <OffshoreTable data={sourceResults as ScreeningResult[]} />,
              'OFAC': <OfacTable data={sourceResults as ScreeningResult[]} />,
            }[sourceId] || null
          }
        </Box>
      );
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Verificación de Riesgos
        <Typography variant="body2" color="text.secondary">
          Proveedor: <strong>{supplier.legalName}</strong> (NIT:{" "}
          {supplier.taxId})
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={10}>
            <CircularProgress />
            <Typography ml={2}>Consultando fuentes de datos...</Typography>
          </Box>
        )}

        {/* Mensaje de Error */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Contenido con Resultados */}
        {results && (
          <>
            {/* Sección 1: Filtros de Visualización */}
            <Box mb={2} p={2} border={1} borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle1" gutterBottom>
                Mostrar resultados de:
              </Typography>
              <FormGroup row>
                {AVAILABLE_SOURCES.map((source) => (
                  <FormControlLabel
                    key={source.id}
                    control={
                      <Checkbox
                        value={source.id}
                        checked={visibleSources.includes(source.id)}
                        onChange={handleSourceChange}
                      />
                    }
                    label={source.label}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Tablas de Resultados */}
            <Box mt={2}>{renderTablesForSelectedSources()}</Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleRefresh} color="warning" disabled={isLoading}>
          Actualizar Datos
        </Button>
        <Button onClick={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningModal;
