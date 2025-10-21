import {TestBed} from "@angular/core/testing";

import {LoadingControllerService} from "./loading-controller.service";

describe("LoadingControllerService", () => {
  let service: LoadingControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingControllerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
