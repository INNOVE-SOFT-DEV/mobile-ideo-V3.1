import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MissionReturnsSupervisorPage} from "./mission-returns-supervisor.page";

describe("MissionReturnsSupervisorPage", () => {
  let component: MissionReturnsSupervisorPage;
  let fixture: ComponentFixture<MissionReturnsSupervisorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionReturnsSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
