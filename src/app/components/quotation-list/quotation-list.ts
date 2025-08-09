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
}
