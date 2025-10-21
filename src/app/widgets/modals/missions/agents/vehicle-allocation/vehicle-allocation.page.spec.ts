import {ComponentFixture, TestBed} from "@angular/core/testing";
import {VehicleAllocationPage} from "./vehicle-allocation.page";

describe("VehicleAllocationPage", () => {
  let component: VehicleAllocationPage;
  let fixture: ComponentFixture<VehicleAllocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleAllocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
