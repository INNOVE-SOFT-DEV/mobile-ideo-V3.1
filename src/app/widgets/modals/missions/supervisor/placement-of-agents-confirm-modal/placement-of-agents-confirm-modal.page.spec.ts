import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PlacementOfAgentsConfirmModalPage} from "./placement-of-agents-confirm-modal.page";

describe("PlacementOfAgentsConfirmModalPage", () => {
  let component: PlacementOfAgentsConfirmModalPage;
  let fixture: ComponentFixture<PlacementOfAgentsConfirmModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementOfAgentsConfirmModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
