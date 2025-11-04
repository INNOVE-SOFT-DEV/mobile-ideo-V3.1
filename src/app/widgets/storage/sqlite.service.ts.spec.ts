import { TestBed } from '@angular/core/testing';

import { SqliteServiceTs } from './sqlite.service.ts';

describe('SqliteServiceTs', () => {
  let service: SqliteServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
