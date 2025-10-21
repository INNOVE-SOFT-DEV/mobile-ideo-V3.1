import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PlacementOfAgentsAffectPage} from "./placement-of-agents-affect.page";

describe("PlacementOfAgentsAffectPage", () => {
  let component: PlacementOfAgentsAffectPage;
  let fixture: ComponentFixture<PlacementOfAgentsAffectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOfAgentsAffectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
