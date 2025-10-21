import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AgentAbsencePage} from "./agent-absence.page";

describe("AgentAbsencePage", () => {
  let component: AgentAbsencePage;
  let fixture: ComponentFixture<AgentAbsencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAbsencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
