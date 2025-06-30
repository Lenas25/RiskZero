import { AxiosError } from "axios";
import type { ScreeningType } from "../types/screeningType";
import type { Supplier } from "../types/supplierType";
import { apiExternal } from "./axiosConfig";
import { API_ENDPOINTS } from "./endpoints";

export const getHighList = async (
  supplier: Supplier,
  queryParams?: Record<string, string | number | boolean>
): Promise<ScreeningType | { message: string }> => {
  try {
    const response = await apiExternal.get<ScreeningType>(`${API_ENDPOINTS.SCREENING}`, {
      params: {
        entityName: supplier.legalName || supplier.tradeName,
        ...queryParams
      }
    });
    return response.data;
  } catch (error) {

    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    console.error('Error fetching high list screening data:', error);
    throw error;
  }
}

