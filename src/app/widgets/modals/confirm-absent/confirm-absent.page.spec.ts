import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmAbsentPage } from './confirm-absent.page';

describe('ConfirmAbsentPage', () => {
  let component: ConfirmAbsentPage;
  let fixture: ComponentFixture<ConfirmAbsentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAbsentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
