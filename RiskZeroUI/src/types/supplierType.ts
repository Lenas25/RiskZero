import type { Country } from "./countryType";

export interface Supplier{
  taxId:string;
  legalName:string;
  tradeName:string;
  phoneNumber:string;
  email:string;
  website: string;
  physicalAddress: string;
  countryId: number | string;
  country?: Country;
  annualRevenueUsd: number;
  updatedAt?: string;
}