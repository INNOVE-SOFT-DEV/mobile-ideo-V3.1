import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PlacementOfAgentsPage} from "./placement-of-agents.page";

describe("PlacementOfAgentsPage", () => {
  let component: PlacementOfAgentsPage;
  let fixture: ComponentFixture<PlacementOfAgentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOfAgentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
