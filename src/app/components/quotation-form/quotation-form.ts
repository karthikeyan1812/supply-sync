import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuotationService } from '../../services/quotation';
import { Router } from '@angular/router';

@Component({
    imports: [CommonModule, FormsModule, DecimalPipe],
  selector: 'app-new-quotation',
  templateUrl: './quotation-form.html',
  styleUrls: ['./quotation-form.css']
})
export class QuotationFormComponent {

  /**
   *
   */
  constructor(
    private quotationService: QuotationService,
    private router: Router
  ) {
    // Read navigation state to pre-fill form if data passed
    const navData = this.router.getCurrentNavigation()?.extras.state as { quotation?: any };
    if (navData && navData.quotation) {
      this.quotation = JSON.parse(JSON.stringify(navData.quotation));
      // Normalize date format for input type=date
      if (this.quotation.date) {
        this.quotation.date = new Date(this.quotation.date).toISOString().substring(0, 10);
      }
      // Calculate totals for items
      this.quotation.items.forEach(item => {
        item.total = item.qty * item.unitPrice;
      });
    }
  }
  quotation = {
    quotationId: '',
    date: new Date().toISOString().substring(0,10),
    clientName: '',
    clientContact: '',
    clientEmail: '',
    clientAddress: '',
    taxPercent: 0,
    items: [
      { description: '', qty: 1, unitPrice: 0, total: 0 }
    ]
  };

  addItem() {
    this.quotation.items.push({ description: '', qty: 1, unitPrice: 0, total: 0 });
  }

  removeItem(index: number) {
    this.quotation.items.splice(index, 1);
    this.updateTotals();
  }

  updateItemTotal(index: number) {
    const item = this.quotation.items[index];
    item.total = item.qty * item.unitPrice;
    this.updateTotals();
  }

  calculateSubtotal() {
    return this.quotation.items.reduce((sum, item) => sum + item.total, 0);
  }

  calculateTaxAmount() {
    return this.calculateSubtotal() * (this.quotation.taxPercent / 100);
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateTaxAmount();
  }

  updateTotals() {
    // This can trigger recalculation if you bind to template properties
  }

  saveQuotation() {
    // your save logic here
    console.log('Save quotation:', this.quotation);
    this.quotationService.saveQuotation(this.quotation).subscribe({
  next: (res) => {
    console.log('Quotation saved', res);
    // show success message or navigate
  },
  error: (err) => {
    console.error('Error saving quotation', err);
    // show error message
  }
});
  }

  generatePDF() {
    // your PDF generation logic here
    alert('Generating PDF (to be implemented)');
  }
}
