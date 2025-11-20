import {ComponentFixture, TestBed} from "@angular/core/testing";
import {OcrScannerPage} from "./ocr-scanner.page";

describe("OcrScannerPage", () => {
  let component: OcrScannerPage;
  let fixture: ComponentFixture<OcrScannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
