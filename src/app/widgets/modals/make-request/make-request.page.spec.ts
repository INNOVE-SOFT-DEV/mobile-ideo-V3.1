import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MakeRequestPage} from "./make-request.page";

describe("MakeRequestPage", () => {
  let component: MakeRequestPage;
  let fixture: ComponentFixture<MakeRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
