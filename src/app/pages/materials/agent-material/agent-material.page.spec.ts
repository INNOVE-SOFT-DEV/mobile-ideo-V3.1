import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AgentMaterialPage} from "./agent-material.page";

describe("AgentMaterialPage", () => {
  let component: AgentMaterialPage;
  let fixture: ComponentFixture<AgentMaterialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
