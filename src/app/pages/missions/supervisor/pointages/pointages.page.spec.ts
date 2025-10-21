import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PointagesPage} from "./pointages.page";

describe("PointagesPage", () => {
  let component: PointagesPage;
  let fixture: ComponentFixture<PointagesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PointagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
