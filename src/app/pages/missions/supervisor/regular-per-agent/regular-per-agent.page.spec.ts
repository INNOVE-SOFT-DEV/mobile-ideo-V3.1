import {ComponentFixture, TestBed} from "@angular/core/testing";
import {RegularPerAgentPage} from "./regular-per-agent.page";

describe("RegularPerAgentPage", () => {
  let component: RegularPerAgentPage;
  let fixture: ComponentFixture<RegularPerAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularPerAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
