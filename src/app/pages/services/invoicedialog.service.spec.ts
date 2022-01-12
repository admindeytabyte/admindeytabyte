import { TestBed } from '@angular/core/testing';

import { InvoicedialogService } from './invoicedialog.service';

describe('InvoicedialogService', () => {
  let service: InvoicedialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicedialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
