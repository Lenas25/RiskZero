import { AxiosError } from "axios";
import type { Country } from "../types/countryType";
import { api } from "./axiosConfig";
import { API_ENDPOINTS } from "./endpoints";


export const getCountries = async (token: string | null): Promise<{ data: Country[], message: string } | { message: string }> => {
  try {
    const response = await api.get<{ data: Country[], message: string }>(API_ENDPOINTS.COUNTRY, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {

    if (error instanceof AxiosError && error.response?.data?.message) {
      return { message: error.response.data.message };
    }
    console.error("Error fetching countries:", error);
    throw error;
  }
}