
export interface ScreeningType {
  hitsFound: number;
  results: ScreeningResult[];
}

export interface ScreeningResult {
  source: string;
  data: WorldBankResult | OffshoreResult | OfacResult;
}

export interface WorldBankResult {
  "Firm Name": string;
  Address: string;
  City: string;
  Country: string;
  "From Date": string;
  "To Date": string;
  Grounds: string;
}

export interface OffshoreResult {
  Entity: string;
  Jurisdiction: string;
  "Linked to": string;
  "Data From": string;
}

export interface OfacResult {
  Name: string;
  Address: string;
  Type: string;
  "Program(s)": string;
  List: string;
  Score: string;
}