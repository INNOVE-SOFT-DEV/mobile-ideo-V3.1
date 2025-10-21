import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReturnRecurringMissionPage} from "./return-recurring-mission.page";

describe("ReturnRecurringMissionPage", () => {
  let component: ReturnRecurringMissionPage;
  let fixture: ComponentFixture<ReturnRecurringMissionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRecurringMissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
