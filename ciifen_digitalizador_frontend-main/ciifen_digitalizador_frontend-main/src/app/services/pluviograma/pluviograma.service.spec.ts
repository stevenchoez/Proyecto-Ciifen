import { TestBed } from '@angular/core/testing';

import { PluviogramaService } from './pluviograma.service';

describe('PluviogramaService', () => {
  let service: PluviogramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PluviogramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
