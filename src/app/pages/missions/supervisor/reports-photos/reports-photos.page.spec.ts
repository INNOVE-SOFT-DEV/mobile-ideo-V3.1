import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ReportsPhotosPage} from "./reports-photos.page";

describe("ReportsPhotosPage", () => {
  let component: ReportsPhotosPage;
  let fixture: ComponentFixture<ReportsPhotosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsPhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
