import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReturnRecurringMissionAgentPage} from "./return-recurring-mission-agent.page";

describe("ReturnRecurringMissionAgentPage", () => {
  let component: ReturnRecurringMissionAgentPage;
  let fixture: ComponentFixture<ReturnRecurringMissionAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRecurringMissionAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
