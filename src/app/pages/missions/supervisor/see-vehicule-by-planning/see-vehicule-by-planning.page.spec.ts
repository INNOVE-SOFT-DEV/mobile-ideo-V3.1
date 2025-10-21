import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SeeVehiculeByPlanningPage} from "./see-vehicule-by-planning.page";

describe("SeeVehiculeByPlanningPage", () => {
  let component: SeeVehiculeByPlanningPage;
  let fixture: ComponentFixture<SeeVehiculeByPlanningPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeVehiculeByPlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
