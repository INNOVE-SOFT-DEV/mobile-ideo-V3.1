import {ComponentFixture, TestBed} from "@angular/core/testing";
import {VehicleDrivingDetailsPage} from "./vehicle-driving-details.page";

describe("VehicleDrivingDetailsPage", () => {
  let component: VehicleDrivingDetailsPage;
  let fixture: ComponentFixture<VehicleDrivingDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDrivingDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
