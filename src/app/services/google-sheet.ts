import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as Papa from 'papaparse';

export interface QuotationMaster {
  'Quotation ID': string;
  'Client Name': string;
  'Client Contact': string;
  'Request Date': string;
  'Quotation Status': string;
  'Total Quotation Price': string;
  'Total Purchase Price': string;
  'Payment Status': string;
  'Profit': string;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetService {
  // Replace these values with your Google Sheet's CSV export URL
  private csvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwgtUArqkYRp1xAwCjLacPMuXSjh_7xwiUEcyerpOIU-0rtDciILhGw-D-IyGq73Zq1SPqHDSNgnpj/pub?gid=0&single=true&output=csv';

  constructor(private http: HttpClient) {}

  fetchQuotations(): Observable<QuotationMaster[]> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map((csvData) => {
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
        });
        return parsedData.data as QuotationMaster[];
      })
    );
  }
}
