import {ComponentFixture, TestBed} from "@angular/core/testing";
import {AbsenceSupervisorPage} from "./absence-supervisor.page";

describe("AbsenceSupervisorPage", () => {
  let component: AbsenceSupervisorPage;
  let fixture: ComponentFixture<AbsenceSupervisorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
