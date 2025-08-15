import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  QuotationItemDetail,
  QuotationMasterDetail,
  QuotationService,
} from '../services/quotation';
import { GoogleSheetService } from './../services/google-sheet';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.html',
  styleUrls: ['./quotation-detail.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    FormsModule,
  ],
})
export class QuotationDetailComponent implements OnInit {
  @ViewChild('quotationContainer') quotationContainer!: ElementRef;

  quotation: QuotationMasterDetail = {
    quotationNumber: 0,
    quotationId: '',
    rfqId: '',
    quotationDate: '',
    rfqDate: '',
    clientName: '',
    clientContact: '',
    clientAddress: '',
    taxPercent: 18,
    quotationRecievedDate: '',
    quotationUploadedDate: '',
    status: '',
    items: [],
  };

  isQuotationDetailsLoading = false;
  isLastQuotationFetchLoading = false;
  isSaveQuotationLoading = false;
  quotationNotFound = false;
  quotationId = '';
  isNewQuotation = false;

  private destroy$ = new Subject<void>();

  constructor(
    private googleSheetService: GoogleSheetService,
    private quotationService: QuotationService,
    private route: ActivatedRoute
  ) {
    this.quotationId = this.route.snapshot.paramMap.get('quotationId') || '';
  }

  ngOnInit(): void {
    if (this.quotationId) {
      this.getQuotationById();
    } else {
      this.isNewQuotation = true;
      this.getLastQuotationNumber();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getQuotationById() {
    this.isQuotationDetailsLoading = true;
    this.googleSheetService
      .getQuotationById(this.quotationId)
      .pipe(
        finalize(() => {
          this.isQuotationDetailsLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.quotation = data;
            this.quotation.quotationRecievedDate = this.toDateInputValue(
              this.quotation.quotationRecievedDate
            );
            this.quotation.quotationUploadedDate = this.toDateInputValue(
              this.quotation.quotationUploadedDate
            );
          } else {
            this.quotationNotFound = true;
          }
        },
        error: (err) => {
          console.error('Error fetching quotation details', err);
          this.quotationNotFound = true;
        },
      });
  }

  getLastQuotationNumber() {
    this.isLastQuotationFetchLoading = true;
    this.quotationService
      .getLastQuotationNumber()
      .pipe(
        finalize(() => {
          this.isLastQuotationFetchLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.quotation.quotationId = this.generateQuotationId(
            res.maxQuotationNumber + 1
          );
        },
        error: () => {},
      });
  }

  generateQuotationId(quotationNumber: number): string {
    // Pad quotation number to 3 digits
    const paddedNumber = String(quotationNumber).padStart(3, '0');

    // Get current date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Determine tax year
    let startYear: number;
    let endYear: number;
    if (month >= 4) {
      startYear = year % 100;
      endYear = (year + 1) % 100;
    } else {
      startYear = (year - 1) % 100;
      endYear = year % 100;
    }

    const taxYear = `${startYear.toString().padStart(2, '0')}-${endYear
      .toString()
      .padStart(2, '0')}`;

    // Build final ID
    return `JB-GJ/${paddedNumber}/${taxYear}`;
  }

  // Getter to calculate total amount for quotation items
  get totalAmount(): number {
    return (
      this.quotation?.items.reduce((sum, item) => sum + item.total, 0) ?? 0
    );
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
   * Updates the total amount for a single item whenever its quantity or unit price changes.
   * @param item The quotation item to update.
   */
  updateTotal(item: QuotationItemDetail): void {
    item.total = item.qty * item.unitPrice;
  }

  /**
   * Calculates the grand total amount for all items in the quotation.
   * @returns The total amount.
   */
  calculateTotalAmount(): number {
    return this.quotation.items.reduce((total, item) => total + item.total, 0);
  }

  generatePdf(): void {
    const data = document.querySelector('.quotation-container') as HTMLElement;

    if (data) {
      html2canvas(data, { scale: 2 }).then((canvas) => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        doc.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            position,
            imgWidth,
            imgHeight
          );
          heightLeft -= pageHeight;
        }

        doc.save(`Quotation_${this.quotation.quotationId}.pdf`);
      });
    }
  }

  downloadPDF() {
    const DATA = this.quotationContainer.nativeElement;

    // Use html2canvas to capture the component as an image
    html2canvas(DATA, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // A4 size page at 72dpi is 595x842 px, using higher scale so fit more
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('quotation.pdf');
    });
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

  toDateInputValue(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveQuotation() {
    console.log('Save quotation:', this.quotation);
    this.quotationService
      .saveQuotation(this.quotation)
      .pipe(
        finalize(() => {
          this.isSaveQuotationLoading = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          console.log('Quotation saved', res);
          // show success message or navigate
        },
        error: (err) => {
          console.error('Error saving quotation', err);
          // show error message
        },
      });
  }

  addItem() {
    const newItem = {
      hsnCode: '',
      description: '',
      qty: 0,
      unitPrice: 0.0,
      total: 0.0,
      unitBuyingPrice: 0,
      profit: 0,
    };
    this.quotation.items.push(newItem);
  }
}
