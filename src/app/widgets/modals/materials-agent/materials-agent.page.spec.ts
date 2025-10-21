import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MaterialsAgentPage} from "./materials-agent.page";

describe("MaterialsAgentPage", () => {
  let component: MaterialsAgentPage;
  let fixture: ComponentFixture<MaterialsAgentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsAgentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
