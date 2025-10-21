import {ComponentFixture, TestBed} from "@angular/core/testing";
import {RequestProcessedPage} from "./request-processed.page";

describe("RequestProcessedPage", () => {
  let component: RequestProcessedPage;
  let fixture: ComponentFixture<RequestProcessedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestProcessedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
