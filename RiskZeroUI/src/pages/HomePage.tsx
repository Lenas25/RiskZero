import { useState, useEffect, useCallback } from "react";
import { Divider, Box, Snackbar, Alert } from "@mui/material";

import Nav from "../components/Nav";

// Importación de Tipos y Servicios
import type { Supplier } from "../types/supplierType";
import {
  getSuppliers,
  createOrUpdateSupplier,
  deleteSupplier,
} from "../api/supplierService";
import Head from "../components/Head";
import Table from "../components/Table";
import SupplierFormModal from "../components/SupplierFormModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ScreeingModal from "../components/ScreeingModal";
import type { Country } from "../types/countryType";
import { getCountries } from "../api/countryService";
import type { ScreeningType } from "../types/screeningType";

const HomePage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [screeningCache, setScreeningCache] = useState<Map<string, ScreeningType>>(new Map());

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await getSuppliers(token);
      setSuppliers("data" in response ? response.data : []);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setNotification({
        type: "error",
        message: "No se pudieron cargar los proveedores.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await getCountries(localStorage.getItem("accessToken"));
      if (response && "data" in response) {
        setCountries(response.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, []);


  useEffect(() => {
    fetchSuppliers();
    fetchCountries();
  }, [fetchSuppliers, fetchCountries]);

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setSelectedSupplier(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setFormMode("edit");
    setSelectedSupplier(supplier);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetailsModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedSupplier(null);
  };

  // Funciones para manejar el caché de screening
  const getScreeningFromCache = (supplier: Supplier): ScreeningType | null => {
    const key = `${supplier.taxId}-${supplier.legalName}`;
    return screeningCache.get(key) || null;
  };

  const saveScreeningToCache = (supplier: Supplier, data: ScreeningType) => {
    const key = `${supplier.taxId}-${supplier.legalName}`;
    setScreeningCache(prev => new Map(prev).set(key, data));
  };

  const clearScreeningFromCache = (supplier: Supplier) => {
    const key = `${supplier.taxId}-${supplier.legalName}`;
    setScreeningCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  };

  const handleFormSubmit = async (
    supplierData: Supplier,
    mode: "create" | "edit"
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      await createOrUpdateSupplier(supplierData, token, mode);
      setNotification({
        type: "success",
        message: `Proveedor ${
          mode === "create" ? "creado" : "actualizado"
        } con éxito.`,
      });
      fetchSuppliers();
    } catch (error) {
      console.error(`Error en el formulario:`, error);
      setNotification({
        type: "error",
        message: `Error al ${
          mode === "create" ? "crear" : "actualizar"
        } el proveedor.`,
      });
    } finally {
      handleCloseModals();
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedSupplier?.taxId) {
      try {
        const token = localStorage.getItem("accessToken");
        await deleteSupplier(selectedSupplier.taxId, token);
        setNotification({
          type: "success",
          message: "Proveedor eliminado con éxito.",
        });
        fetchSuppliers();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setNotification({
          type: "error",
          message: "Error al eliminar el proveedor.",
        });
      } finally {
        handleCloseModals();
      }
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen p-10">
      <Nav />
      <Box sx={{ p: { xs: 2, lg: 4 } }}>
        <Head onOpenCreateModal={handleOpenCreateModal} suppliers={suppliers} />
        <Divider orientation="horizontal" flexItem sx={{ my: 2 }} />

        <Table
          rows={suppliers}
          loading={loading}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteModal}
          onViewClick={handleOpenDetailsModal}
        />

        {isFormModalOpen && (
          <SupplierFormModal
            open={isFormModalOpen}
            onClose={handleCloseModals}
            onSubmit={handleFormSubmit}
            mode={formMode}
            initialData={selectedSupplier}
            countries={countries}
          />
        )}

        {isDeleteModalOpen && selectedSupplier && (
          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onClose={handleCloseModals}
            onConfirm={handleDeleteConfirm}
            supplierName={selectedSupplier.legalName}
          />
        )}

        {isDetailsModalOpen && selectedSupplier && (
          <ScreeingModal
            open={isDetailsModalOpen}
            onClose={handleCloseModals}
            supplier={selectedSupplier}
            getCachedData={getScreeningFromCache}
            saveCachedData={saveScreeningToCache}
            clearCachedData={clearScreeningFromCache}
          />
        )}

        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert
            onClose={() => setNotification(null)}
            severity={notification?.type}
            sx={{ width: "100%" }}>
            {notification?.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default HomePage;
