import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import type { Supplier } from "../types/supplierType";
import type { Country } from "../types/countryType";

type FormData = Omit<Supplier, "country" | "updatedAt">;

interface SupplierFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (supplierData: Supplier, mode: "create" | "edit") => void;
  mode: "create" | "edit";
  initialData?: Supplier | null;
  countries?: Country[];
}

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
  initialData,
  countries
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      taxId: "",
      legalName: "",
      tradeName: "",
      phoneNumber: "",
      email: "",
      website: "",
      physicalAddress: "",
      countryId: "",
      annualRevenueUsd: 0,
    },
  });


  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        taxId: initialData.taxId,
        legalName: initialData.legalName,
        tradeName: initialData.tradeName,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email,
        website: initialData.website,
        physicalAddress: initialData.physicalAddress,
        countryId: initialData.countryId,
        annualRevenueUsd: initialData.annualRevenueUsd,
      });
    } else {
      reset();
    }
  }, [mode, initialData, reset]);

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    const submittedSupplier: Supplier = {
      ...data
    };
    onSubmit(submittedSupplier, mode);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Agregar Nuevo Proveedor" : "Editar Proveedor"}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
          onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="taxId"
            control={control}
            rules={{
              required: "El NIT es obligatorio.",
              pattern: {
                value: /^\d{11}$/, // Exactamente 11 dígitos numéricos
                message: "El NIT debe ser numérico y de 11 dígitos.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="NIT"
                fullWidth
                margin="normal"
                disabled={mode === "edit"}
                required
                error={!!errors.taxId}
                helperText={errors.taxId?.message}
              />
            )}
          />

          <Controller
            name="legalName"
            control={control}
            rules={{ required: "La razón social es obligatoria." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Razón Social"
                fullWidth
                margin="normal"
                required
                error={!!errors.legalName}
                helperText={errors.legalName?.message}
              />
            )}
          />

          <Controller
            name="tradeName"
            control={control}
            rules={{ required: "El nombre comercial es obligatorio." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre Comercial"
                fullWidth
                margin="normal"
                required
                error={!!errors.tradeName}
                helperText={errors.tradeName?.message}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "El número telefónico es obligatorio.",
              pattern: {
                value: /^[0-9\s\-()+]+$/,
                message: "Formato de teléfono inválido.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número Telefónico"
                fullWidth
                margin="normal"
                type="tel"
                required
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "El correo electrónico es obligatorio.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Formato de correo inválido.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Correo Electrónico"
                fullWidth
                margin="normal"
                type="email"
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="website"
            control={control}
            rules={{
              required: "El sitio web es obligatorio.",
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: "Formato de sitio web inválido.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sitio Web"
                fullWidth
                margin="normal"
                type="url"
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            )}
          />

          <Controller
            name="physicalAddress"
            control={control}
            rules={{ required: "La dirección física es obligatoria." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dirección Física"
                fullWidth
                margin="normal"
                required
                error={!!errors.physicalAddress}
                helperText={errors.physicalAddress?.message}
              />
            )}
          />

          <Controller
            name="countryId"
            control={control}
            rules={{
              required: "El país es obligatorio.",
              min: { value: 1, message: "Por favor, selecciona un país." }, // Asumiendo que 0 no es un ID válido
            }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="País"
                fullWidth
                margin="normal"
                required
                error={!!errors.countryId}
                helperText={errors.countryId?.message}>
                {(countries ?? []).map((option) => (
                  <MenuItem key={option.countryId} value={option.countryId}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="annualRevenueUsd"
            control={control}
            rules={{
              required: "La facturación anual es obligatoria.",
              min: {
                value: 0,
                message: "La facturación no puede ser negativa.",
              },
              validate: (value) =>
                !isNaN(value) || "Debe ser un número válido.",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Facturación Anual (USD)"
                fullWidth
                margin="normal"
                type="number"
                inputProps={{ step: "0.01" }}
                required
                error={!!errors.annualRevenueUsd}
                helperText={errors.annualRevenueUsd?.message}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          color="warning"
          disabled={isSubmitting}>
          {mode === "create" ? "Agregar" : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierFormModal;
