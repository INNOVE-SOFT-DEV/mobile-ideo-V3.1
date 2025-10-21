import {TestBed} from "@angular/core/testing";

import {PdfTakerService} from "./pdf-taker.service";

describe("PdfTakerService", () => {
  let service: PdfTakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfTakerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
