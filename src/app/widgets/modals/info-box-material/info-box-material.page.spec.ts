import {ComponentFixture, TestBed} from "@angular/core/testing";
import {InfoBoxMaterialPage} from "./info-box-material.page";

describe("InfoBoxMaterialPage", () => {
  let component: InfoBoxMaterialPage;
  let fixture: ComponentFixture<InfoBoxMaterialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBoxMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
