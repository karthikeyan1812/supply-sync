import { Routes } from '@angular/router';
import { QuotationFormComponent } from './components/quotation-form/quotation-form';
import { QuotationList } from './components/quotation-list/quotation-list'; // if you have this

export const routes: Routes = [

  { path: '', redirectTo: 'quotations', pathMatch: 'full' },
  { path: 'quotations', component: QuotationList },
  { path: 'new-quotation', component: QuotationFormComponent },
  { path: '**', redirectTo: 'quotations' }
  // Add other routes as needed
];
