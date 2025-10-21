import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AbsenceRequestPage} from "./absence-request.page";

describe("AbsenceRequestPage", () => {
  let component: AbsenceRequestPage;
  let fixture: ComponentFixture<AbsenceRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
