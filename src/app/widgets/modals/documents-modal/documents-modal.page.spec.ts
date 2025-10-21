import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DocumentsModalPage} from "./documents-modal.page";

describe("DocumentsModalPage", () => {
  let component: DocumentsModalPage;
  let fixture: ComponentFixture<DocumentsModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
