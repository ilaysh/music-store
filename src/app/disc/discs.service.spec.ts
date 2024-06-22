import { TestBed } from '@angular/core/testing';

import { DiscsService } from './discs.service';

describe('DiscsService', () => {
  let service: DiscsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
