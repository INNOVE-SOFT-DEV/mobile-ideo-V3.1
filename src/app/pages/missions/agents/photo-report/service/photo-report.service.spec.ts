import {TestBed} from "@angular/core/testing";

import {PhotoReportService} from "./photo-report.service";

describe("PhotoReportService", () => {
  let service: PhotoReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoReportService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
