import { Routes } from '@angular/router';
import { QuotationFormComponent } from './components/quotation-form/quotation-form';
import { QuotationList } from './components/quotation-list/quotation-list'; // if you have this
import { Home } from './components/home/home';
import { QuotationDetailComponent } from './components/quotation-detail';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'quotations', component: QuotationList },
  { path: 'new-quotation', component: QuotationFormComponent },
  { path: 'quotation-detail', component: QuotationDetailComponent },
  { path: '**', redirectTo: 'quotations' }
  // Add other routes as needed
];
