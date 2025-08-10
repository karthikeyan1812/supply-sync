import { Component, OnInit } from '@angular/core';
import { GoogleSheetService } from './../services/google-sheet'; // Adjust the path as needed
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor
import { ActivatedRoute } from '@angular/router'; // For getting the ID from the URL
import { QuotationMasterDetail } from '../services/quotation';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.html',
  styleUrls: ['./quotation-detail.css'],
  standalone: true, // Use this for standalone components in Angular 14+
  imports: [CommonModule]
})
export class QuotationDetailComponent implements OnInit {
  // Variable to hold the fetched quotation data.
  quotation: QuotationMasterDetail | null = null;
  // A boolean to track the loading state for UI feedback.
  isLoading = true;
  // A boolean to show a "not found" message.
  quotationNotFound = false;

  constructor(
    private googleSheetService: GoogleSheetService,
    private route: ActivatedRoute // Used to get the ID from the URL
  ) {}

  ngOnInit(): void {
    // In a real app, you would get the ID from the route.
    // For this example, we'll use a hardcoded ID for demonstration.
    // Uncomment the next line and comment out the hardcoded ID for a real routing setup.
    // const quotationId = this.route.snapshot.paramMap.get('id');

    // Hardcoded ID for a single quotation. Replace with a real ID from your data.
    const quotationId = 'Q16810962001'; 

    if (quotationId) {
      this.googleSheetService.getQuotationById(quotationId).subscribe({
        next: (data) => {
          this.isLoading = false;
          if (data) {
            this.quotation = data;
          } else {
            this.quotationNotFound = true;
          }
        },
        error: (err) => {
          console.error('Error fetching quotation details', err);
          this.isLoading = false;
          this.quotationNotFound = true;
        },
      });
    } else {
      this.isLoading = false;
      this.quotationNotFound = true;
    }
  }

  /**
   * Calculates the subtotal of all items in the quotation.
   * @returns The sum of all item totals.
   */
  calculateSubtotal(): number {
    if (!this.quotation) {
      return 0;
    }
    return this.quotation.items.reduce((sum, item) => sum + item.total, 0);
  }

  /**
   * Calculates the tax amount based on the subtotal and tax percentage.
   * @returns The total tax amount.
   */
  calculateTax(): number {
    const subtotal = this.calculateSubtotal();
    if (!this.quotation) {
      return 0;
    }
    return subtotal * (this.quotation.taxPercent / 100);
  }

  /**
   * Calculates the grand total, including subtotal and tax.
   * @returns The final grand total.
   */
  calculateGrandTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }
}