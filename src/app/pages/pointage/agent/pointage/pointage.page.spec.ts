import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PointagePage} from "./pointage.page";

describe("PointagePage", () => {
  let component: PointagePage;
  let fixture: ComponentFixture<PointagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PointagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
