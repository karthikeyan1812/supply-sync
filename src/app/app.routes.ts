import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { QuotationDetailComponent } from './components/quotation-detail';
import { QuotationList } from './components/quotation-list/quotation-list'; // if you have this

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'quotations', component: QuotationList },
  { path: 'new-quotation', component: QuotationDetailComponent },
  { path: 'quotation-detail/:quotationId', component: QuotationDetailComponent },
  { path: '**', redirectTo: 'quotations' }
  // Add other routes as needed
];
