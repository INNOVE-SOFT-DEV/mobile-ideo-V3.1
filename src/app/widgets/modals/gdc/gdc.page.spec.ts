import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GdcPage} from "./gdc.page";

describe("GdcPage", () => {
  let component: GdcPage;
  let fixture: ComponentFixture<GdcPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GdcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
