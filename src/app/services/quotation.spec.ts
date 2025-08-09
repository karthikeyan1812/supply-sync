import { TestBed } from '@angular/core/testing';

import { Quotation } from './quotation';

describe('Quotation', () => {
  let service: Quotation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Quotation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
