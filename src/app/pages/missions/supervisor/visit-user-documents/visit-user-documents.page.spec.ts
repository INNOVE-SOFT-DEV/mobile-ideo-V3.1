import {ComponentFixture, TestBed} from "@angular/core/testing";
import {VisitUserDocumentsPage} from "./visit-user-documents.page";

describe("VisitUserDocumentsPage", () => {
  let component: VisitUserDocumentsPage;
  let fixture: ComponentFixture<VisitUserDocumentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitUserDocumentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
