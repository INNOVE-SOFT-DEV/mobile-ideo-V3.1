import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MenuMessionPage} from "./menu-mession.page";

describe("MenuMessionPage", () => {
  let component: MenuMessionPage;
  let fixture: ComponentFixture<MenuMessionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
