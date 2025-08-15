import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  // Your GAS Web App URL
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbwK7stkuakOrQHHRtni6twEaj1USuhy3JURrBfTdy1vWY6WC-F9vBhLwb8yy-Bg2sDfdg/exec';
  private lastQuotationUrl =
    'https://script.google.com/macros/s/AKfycbwj42oYFW9MoE40C8v9upn39BksNZid19rNUK94j4w3jbuQMgIB4SD5J0RiZ9S14e7abA/exec';

  constructor(private http: HttpClient) {}

  saveQuotation(data: any): Observable<any> {
    return this.http
      .post(this.apiUrl, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      })
      .pipe(map((res) => JSON.parse(res)));
  }

  getLastQuotationNumber() {
    return this.http.get(this.lastQuotationUrl);
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
  quotationNumber: number;
  quotationId: string;
  rfqId: string;
  quotationDate: string;
  rfqDate: string;
  clientName: string;
  clientContact: string;
  clientAddress: string;
  taxPercent: number;
  quotationRecievedDate: string;
  quotationUploadedDate: string;
  status: string;
  items: QuotationItemDetail[];
}
