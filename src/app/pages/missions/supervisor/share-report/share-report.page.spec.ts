import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ShareReportPage} from "./share-report.page";

describe("ShareReportPage", () => {
  let component: ShareReportPage;
  let fixture: ComponentFixture<ShareReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
