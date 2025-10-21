import {ComponentFixture, TestBed} from "@angular/core/testing";
import {NonRollingVehiclePage} from "./non-rolling-vehicle.page";

describe("NonRollingVehiclePage", () => {
  let component: NonRollingVehiclePage;
  let fixture: ComponentFixture<NonRollingVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NonRollingVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
