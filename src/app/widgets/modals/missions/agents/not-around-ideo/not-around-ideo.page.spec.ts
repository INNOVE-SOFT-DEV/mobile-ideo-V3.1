import {ComponentFixture, TestBed} from "@angular/core/testing";
import {NotAroundIdeoPage} from "./not-around-ideo.page";

describe("NotAroundIdeoPage", () => {
  let component: NotAroundIdeoPage;
  let fixture: ComponentFixture<NotAroundIdeoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAroundIdeoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
