import { TestBed } from '@angular/core/testing';

import { NgCytoscapeService } from './ng-cytoscape.service';

describe('NgCytoscapeService', () => {
  let service: NgCytoscapeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgCytoscapeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
