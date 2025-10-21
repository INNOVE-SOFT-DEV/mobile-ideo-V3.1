import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AgentTrackingPage} from "./agent-tracking.page";

describe("AgentTrackingPage", () => {
  let component: AgentTrackingPage;
  let fixture: ComponentFixture<AgentTrackingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
