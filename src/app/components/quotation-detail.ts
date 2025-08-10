import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleSheetService } from './../services/google-sheet'; // Adjust the path as needed
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor
import { ActivatedRoute, Router } from '@angular/router'; // For getting the ID from the URL
import { QuotationItemDetail, QuotationMasterDetail } from '../services/quotation';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.html',
  styleUrls: ['./quotation-detail.css'],
  standalone: true, // Use this for standalone components in Angular 14+
  imports: [CommonModule, MatCardModule,
    MatTableModule,
    MatDividerModule,FormsModule]
})
export class QuotationDetailComponent implements OnInit {
  // Variable to hold the fetched quotation data.
    @ViewChild('quotationContainer') quotationContainer!: ElementRef;

  quotation: QuotationMasterDetail  = {
      quotationId: 'RFQ-12345',
      clientName: 'ABC Private Limited',
      clientContact: '9876543210',
      clientAddress: 'Plant-2, Revenue Survey No.06, North Kotpura Village, Sanand Taluk, Ahmedabad - 382170',
      taxPercent: 18,
      quotationRecievedDate: '2025-08-10',
      quotationUploadedDate: '2025-08-12',
      status: 'Pending',
      items: [
        {
          hsnCode: 'HSN001',
          description: 'Test Item',
          qty: 42,
          unitPrice: 2800.00,
          total: 117600.00,
          unitBuyingPrice: 0,
          profit: 0
        },
        {
          hsnCode: 'HSN002',
          description: 'Test Item 2',
          qty: 42,
          unitPrice: 2200.00,
          total: 92400.00,
          unitBuyingPrice: 0,
          profit: 0
        }
      ]
    };
  // A boolean to track the loading state for UI feedback.
  isLoading = true;
  // A boolean to show a "not found" message.
  quotationNotFound = false;
    quotationId = ''; 
 displayedColumns: string[] = [
    'hsnCode',
    'description',
    'qty',
    'unitPrice',
    'total',
    'unitBuyingPrice',
    'profit'
  ];

  constructor(
    private googleSheetService: GoogleSheetService,
    private router: Router // Used to get the ID from the URL
  ) {
    console.log(this.router.getCurrentNavigation()?.extras.state);
    const navData = this.router.getCurrentNavigation()?.extras.state as { quotation?: any };
    console.log(navData);
    this.quotationId = navData.quotation.quotationId;
    if (this.quotationId) {
      this.googleSheetService.getQuotationById(this.quotationId).subscribe({
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

  ngOnInit(): void {
    // In a real app, you would get the ID from the route.
    // For this example, we'll use a hardcoded ID for demonstration.
    // Uncomment the next line and comment out the hardcoded ID for a real routing setup.
    // const quotationId = this.route.snapshot.paramMap.get('id');

    // Hardcoded ID for a single quotation. Replace with a real ID from your data.
    // const quotationId = 'Q16810962001'; 
    
    

    
  }

    // Getter to calculate total amount for quotation items
  get totalAmount(): number {
    return this.quotation?.items.reduce((sum, item) => sum + item.total, 0) ?? 0;
  }

  // Recalculate total when qty or unitPrice changes for an item
  recalcItemTotal(item: QuotationItemDetail) {
    item.total = item.qty * item.unitPrice;
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
      html2canvas(data, { scale: 2 }).then(canvas => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const doc = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save(`Quotation_${this.quotation.quotationId}.pdf`);
      });
    }
  }

  downloadPDF() {
    const DATA = this.quotationContainer.nativeElement;

    // Use html2canvas to capture the component as an image
    html2canvas(DATA, { scale: 2 }).then(canvas => {
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
}