import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  // Your GAS Web App URL
  private apiUrl = 'https://script.google.com/macros/s/AKfycbzC8-VrwN1FndtxESmdGDKrrI8dwQxvKflL5Wf6MRiHqxCf3DE3DeWBCnz8l7iq9vDDZg/exec';

  constructor(private http: HttpClient) {}

  saveQuotation(data: any): Observable<any> {
  const body = new URLSearchParams();

  // Iterate all keys in data
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'items') {
        // Stringify the items array
        body.set(key, JSON.stringify(data[key]));
      } else {
        // Normal scalar values
        body.set(key, data[key]);
      }
    }
  }
console.log(body.toString())
  return this.http.post(this.apiUrl, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'text'  // GAS returns text which we parse later
  }).pipe(
    map(res => JSON.parse(res)) // parse the JSON string response
  );
}

}

/**
 * Defines the detailed structure for each line item within a quotation.
 * This interface reflects the data returned by the 'Quotation Items' sheet.
 */
export interface QuotationItemDetail {
  hsnCode: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
  unitBuyingPrice: number;
  profit: number;
}

/**
 * Defines the complete structure for a single quotation, including client
 * information and all associated line items. This combines data from all
 * three of your Google Sheets.
 */
export interface QuotationMasterDetail {
  quotationId: string;
  clientName: string;
  clientContact: string;
  clientAddress: string;
  taxPercent: number;
  quotationRecievedDate: string;
  quotationUploadedDate: string;
  status: string;
  items: QuotationItemDetail[];
}

