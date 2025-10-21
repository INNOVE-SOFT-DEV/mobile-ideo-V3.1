import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PlacementOfAgentsDetailsPage} from "./placement-of-agents-details.page";

describe("PlacementOfAgentsDetailsPage", () => {
  let component: PlacementOfAgentsDetailsPage;
  let fixture: ComponentFixture<PlacementOfAgentsDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOfAgentsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
