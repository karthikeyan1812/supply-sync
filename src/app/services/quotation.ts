import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  // Your GAS Web App URL
  private apiUrl = 'https://script.google.com/macros/s/AKfycbxpRtLTx7kXbIEu-Km-rYUrSpiF1XG4YteFcbWaM0-FjGNaKgMFvFQYdFAfUDLCHDSfjg/exec';

  constructor(private http: HttpClient) {}

  saveQuotation(data: any): Observable<any> {
  const body = new URLSearchParams();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      body.set(key, data[key]);
    }
  }
  return this.http.post(this.apiUrl, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'text',  // important!
  }).pipe(
    map(res => JSON.parse(res))
  );
}
}
