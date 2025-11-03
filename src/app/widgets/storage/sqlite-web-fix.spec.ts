import { TestBed } from '@angular/core/testing';

import { SqliteWebFix } from './sqlite-web-fix';

describe('SqliteWebFix', () => {
  let service: SqliteWebFix;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteWebFix);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
