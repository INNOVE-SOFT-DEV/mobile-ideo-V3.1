import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ChangeVehiclePage} from "./change-vehicle.page";

describe("ChangeVehiclePage", () => {
  let component: ChangeVehiclePage;
  let fixture: ComponentFixture<ChangeVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
