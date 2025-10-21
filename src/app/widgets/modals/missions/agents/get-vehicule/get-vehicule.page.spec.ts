import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GetVehiculePage} from "./get-vehicule.page";

describe("GetVehiculePage", () => {
  let component: GetVehiculePage;
  let fixture: ComponentFixture<GetVehiculePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GetVehiculePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
