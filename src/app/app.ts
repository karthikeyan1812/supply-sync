import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuotationList } from './components/quotation-list/quotation-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,QuotationList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('supply-sync');
}
