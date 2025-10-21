import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReportDefectPage} from "./report-defect.page";

describe("ReportDefectPage", () => {
  let component: ReportDefectPage;
  let fixture: ComponentFixture<ReportDefectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDefectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
