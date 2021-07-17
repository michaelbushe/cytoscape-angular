import { TestBed } from '@angular/core/testing';

import { CyNodeService } from './cy-node.service';

describe('CyNodeServiceService', () => {
  let service: CyNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
