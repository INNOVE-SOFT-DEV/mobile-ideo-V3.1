import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SendReportPage} from "./send-report.page";

describe("SendReportPage", () => {
  let component: SendReportPage;
  let fixture: ComponentFixture<SendReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
