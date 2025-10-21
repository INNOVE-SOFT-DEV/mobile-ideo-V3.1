import {ComponentFixture, TestBed} from "@angular/core/testing";
import {VehicleConfirmationPage} from "./vehicle-confirmation.page";

describe("VehicleConfirmationPage", () => {
  let component: VehicleConfirmationPage;
  let fixture: ComponentFixture<VehicleConfirmationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
