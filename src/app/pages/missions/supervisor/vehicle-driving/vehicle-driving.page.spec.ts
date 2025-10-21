import {ComponentFixture, TestBed} from "@angular/core/testing";
import {VehicleDrivingPage} from "./vehicle-driving.page";

describe("VehicleDrivingPage", () => {
  let component: VehicleDrivingPage;
  let fixture: ComponentFixture<VehicleDrivingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDrivingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
