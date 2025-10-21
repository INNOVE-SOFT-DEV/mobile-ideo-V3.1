import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MaterialsRequestsSupervisorPage} from "./materials-requests-supervisor.page";

describe("MaterialsRequestsSupervisorPage", () => {
  let component: MaterialsRequestsSupervisorPage;
  let fixture: ComponentFixture<MaterialsRequestsSupervisorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsRequestsSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
