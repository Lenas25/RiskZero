import { AxiosError } from "axios";
import type { Supplier } from "../types/supplierType";
import { api } from "./axiosConfig";
import { API_ENDPOINTS } from "./endpoints";


export const getSuppliers = async (token: string | null): Promise<{ data: Supplier[], message: string } | { message: string }> => {
  try {
    const response = await api.get<{ data: Supplier[], message: string }>(API_ENDPOINTS.SUPPLIER, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {

    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    console.error("Error fetching suppliers:", error);
    throw error;
  }
}

export const createOrUpdateSupplier = async (
  supplier: Supplier,
  token: string | null,
  type: 'create' | 'edit'
): Promise<{ message: string }> => {
  try {
    let response;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    if (type === "create") {
      response = await api.post<{ message: string }>(
        API_ENDPOINTS.SUPPLIER,
        supplier,
        { headers }
      );
      return response.data;
    } else if (type === "edit") {
      if (!supplier.taxId) {
        throw new Error('Tax ID is required for editing a supplier.');
      }
      response = await api.put<{ message: string }>(
        `${API_ENDPOINTS.SUPPLIER}/${supplier.taxId}`,
        supplier,
        { headers }
      );
      return response.data;
    } else {
      throw new Error('Operacion invalida. Use "create" o "edit".');
    }
  } catch (error) {

    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    console.error("Error creating or updating supplier:", error);
    throw error;
  }
};

export const deleteSupplier = async (taxId: string, token: string | null): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`${API_ENDPOINTS.SUPPLIER}/${taxId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    console.error("Error deleting supplier:", error);
    throw error;
  }
}