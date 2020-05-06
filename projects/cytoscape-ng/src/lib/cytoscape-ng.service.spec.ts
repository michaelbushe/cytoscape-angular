import { TestBed } from '@angular/core/testing';

import { CytoscapeNgService } from './cytoscape-ng.service';

describe('NgCytoscapeService', () => {
  let service: CytoscapeNgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CytoscapeNgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
