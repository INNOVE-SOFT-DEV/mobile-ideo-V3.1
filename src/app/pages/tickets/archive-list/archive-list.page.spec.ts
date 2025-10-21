import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ArchiveListPage} from "./archive-list.page";

describe("ArchiveListPage", () => {
  let component: ArchiveListPage;
  let fixture: ComponentFixture<ArchiveListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
