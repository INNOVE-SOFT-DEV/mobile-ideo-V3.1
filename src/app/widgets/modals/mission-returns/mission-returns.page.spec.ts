import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MissionReturnsPage} from "./mission-returns.page";

describe("MissionReturnsPage", () => {
  let component: MissionReturnsPage;
  let fixture: ComponentFixture<MissionReturnsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionReturnsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
