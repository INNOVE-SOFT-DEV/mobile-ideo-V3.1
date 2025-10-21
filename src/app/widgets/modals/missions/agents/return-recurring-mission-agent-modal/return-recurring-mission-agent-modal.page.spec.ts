import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReturnRecurringMissionAgentModalPage} from "./return-recurring-mission-agent-modal.page";

describe("ReturnRecurringMissionAgentModalPage", () => {
  let component: ReturnRecurringMissionAgentModalPage;
  let fixture: ComponentFixture<ReturnRecurringMissionAgentModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRecurringMissionAgentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
