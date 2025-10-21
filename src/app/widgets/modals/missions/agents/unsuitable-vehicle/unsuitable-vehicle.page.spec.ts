import {ComponentFixture, TestBed} from "@angular/core/testing";
import {UnsuitableVehiclePage} from "./unsuitable-vehicle.page";

describe("UnsuitableVehiclePage", () => {
  let component: UnsuitableVehiclePage;
  let fixture: ComponentFixture<UnsuitableVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsuitableVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
