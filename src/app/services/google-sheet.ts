import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuotationMasterDetail } from './quotation';

// This is the interface you provided, defining the structure of the data.
export interface QuotationMaster {
  quotationId: string;
  date?: string; // This property is not in your API response, so it remains optional.
  clientName: string;
  clientContact: string;
  clientEmail?: string;
  clientAddress?: string;
  taxPercent: number;
  quotationRecievedDate: string; // Added new property
  quotationUploadedDate: string; // Added new property
  status: string,
  items: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleSheetService {
  // Your Google Apps Script web app URL
  private getAllQuotationApi =
    'https://script.google.com/macros/s/AKfycbzcwLAskiqO1dxklyTWxA634frf8P33-ju1t13qJMNmCwOqdTZtnIA7KRboVP7Pn5Qsew/exec';
private getQuotationByIdApi =
    'https://script.google.com/macros/s/AKfycbwoZaen2klgqJhrjVU-6VZMRZpNLEfD33kAT2wTbGcUFegnNZmydNFMqpyNh9g5mez6aw/exec';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all quotations from the Google Sheet API.
   * The API returns a JSON array, which is then mapped to the QuotationMaster model.
   *
   * @returns An Observable of an array of QuotationMaster objects.
   */
  fetchQuotations(): Observable<QuotationMaster[]> {
    // We now directly return the http.get observable because the server-side
    // script is handling the data transformation.
    // The <QuotationMaster[]> type annotation tells Angular how to deserialize the JSON.
    return this.http.get<QuotationMaster[]>(this.getAllQuotationApi);
  }

  /**
   * Fetches a single quotation by its ID from the Google Sheets API.
   * This method adds the 'quotationId' parameter to the API URL.
   *
   * @param id The quotationId to search for.
   * @returns An Observable of a single QuotationMaster object, or null if not found.
   */
  getQuotationById(id: string): Observable<QuotationMasterDetail | null> {
    const params = new HttpParams().set('quotationId', id);
    return this.http.get<QuotationMasterDetail | null>(this.getQuotationByIdApi, { params });
  }

  /**
   * Maps an array of raw data objects from the API to an array of QuotationMaster objects.
   *
   * @param rawDataArray The raw data array from the API response.
   * @returns An array of QuotationMaster objects.
   */
  private mapRawToQuotationMaster(rawDataArray: any[]): QuotationMaster[] {
    // This logs the raw data to the console for debugging. It's a good practice
    // to keep this for a bit to ensure the API response is what you expect.
    console.log('Raw data from API:', rawDataArray);
    
    return rawDataArray.map(raw => ({
      quotationId: raw['Quotation ID'],
      clientName: raw['Client Name'],
      clientContact: raw['Client Contact'],
      taxPercent: raw['Tax Percent'],
      status: raw['Status'],
      quotationRecievedDate: raw['Quotation Recieved Date'],
      quotationUploadedDate: raw['Quotation Uploaded Date'],
      // We initialize the items array as empty because the API response
      // does not contain this data.
      items: []
    }));
  }
}
