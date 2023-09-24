import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluviogramasDetailComponent } from './pluviogramas-detail.component';

describe('PluviogramasDetailComponent', () => {
  let component: PluviogramasDetailComponent;
  let fixture: ComponentFixture<PluviogramasDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluviogramasDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluviogramasDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
