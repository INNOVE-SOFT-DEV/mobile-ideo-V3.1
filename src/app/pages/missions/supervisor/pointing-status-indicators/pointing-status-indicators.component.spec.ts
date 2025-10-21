import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {PointingStatusIndicatorsComponent} from "./pointing-status-indicators.component";

describe("PointingStatusIndicatorsComponent", () => {
  let component: PointingStatusIndicatorsComponent;
  let fixture: ComponentFixture<PointingStatusIndicatorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PointingStatusIndicatorsComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PointingStatusIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
