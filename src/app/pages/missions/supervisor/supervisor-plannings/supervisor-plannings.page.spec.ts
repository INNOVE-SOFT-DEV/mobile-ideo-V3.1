import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SupervisorPlanningsPage} from "./supervisor-plannings.page";

describe("SupervisorPlanningsPage", () => {
  let component: SupervisorPlanningsPage;
  let fixture: ComponentFixture<SupervisorPlanningsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorPlanningsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
