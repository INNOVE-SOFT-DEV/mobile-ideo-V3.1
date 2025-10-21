import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MaterialRequestPage} from "./material-request.page";

describe("MaterialRequestPage", () => {
  let component: MaterialRequestPage;
  let fixture: ComponentFixture<MaterialRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
