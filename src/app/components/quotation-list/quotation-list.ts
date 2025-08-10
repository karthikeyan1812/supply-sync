import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // For *ngIf, *ngFor
import { GoogleSheetService, QuotationMaster } from '../../services/google-sheet';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [CommonModule],  // add more if needed
  templateUrl: './quotation-list.html',
  styleUrls: ['./quotation-list.css'],
})
export class QuotationList implements OnInit {
  quotations: QuotationMaster[] = [];
  loading = true;

  constructor(private sheetService: GoogleSheetService,private router: Router) {}

  ngOnInit(): void {
    this.sheetService.fetchQuotations().subscribe({
      next: (data) => {
        console.log('Data')
        console.log( data)
        this.quotations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching quotations', err);
        this.loading = false;
      },
    });
  }
  goToNewQuotation() {
    this.router.navigate(['/new-quotation']);
  }
  getTotalAmount(items: any[]): number {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  }

  formatDate(dateString: string): string {
    // Check if the date string is invalid or empty.
    if (!dateString) {
      return '';
    }
    const d = new Date(dateString);
    // Check if the date object is valid.
    if (isNaN(d.getTime())) {
      return '';
    }
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }
  editQuotation(quotation: QuotationMaster) {
    // Navigate to the form component and pass the selected quotation as state
    this.router.navigate(['new-quotation'], { state: { quotation } });
  }
}
