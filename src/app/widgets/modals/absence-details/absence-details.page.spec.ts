import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AbsenceDetailsPage} from "./absence-details.page";

describe("AbsenceDetailsPage", () => {
  let component: AbsenceDetailsPage;
  let fixture: ComponentFixture<AbsenceDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
