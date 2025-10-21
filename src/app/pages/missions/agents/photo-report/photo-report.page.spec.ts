import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PhotoReportPage} from "./photo-report.page";

describe("PhotoReportPage", () => {
  let component: PhotoReportPage;
  let fixture: ComponentFixture<PhotoReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
