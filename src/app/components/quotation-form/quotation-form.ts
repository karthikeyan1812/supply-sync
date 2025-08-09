import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuotationService } from '../../services/quotation';

@Component({
  selector: 'app-quotation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quotation-form.html',
  styleUrls: ['./quotation-form.css'],
})
export class QuotationFormComponent {
  quotationForm: FormGroup;

  constructor(private fb: FormBuilder, private quotationService: QuotationService) {
    this.quotationForm = this.fb.group({
      quotation_id: ['', Validators.required],
      client_name: ['', Validators.required],
      client_mobile: ['', Validators.required],
      quotation_date: ['', Validators.required],
      status: ['Pending', Validators.required],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      approval_date: ['']
    });
  }

  onSubmit() {
    if (this.quotationForm.valid) {
      this.quotationService.saveQuotation(this.quotationForm.value).subscribe({
        next: res => {
          alert('Quotation saved successfully!');
          this.quotationForm.reset({ status: 'Pending', total_amount: 0 });
        },
        error: err => {
          alert('Error saving quotation.');
          console.error(err);
        }
      });
    }
  }
}
