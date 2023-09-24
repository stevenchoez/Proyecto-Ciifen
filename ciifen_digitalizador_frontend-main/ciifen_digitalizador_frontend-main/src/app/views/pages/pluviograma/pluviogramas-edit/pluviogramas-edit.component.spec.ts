import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluviogramasEditComponent } from './pluviogramas-edit.component';

describe('PluviogramasEditComponent', () => {
  let component: PluviogramasEditComponent;
  let fixture: ComponentFixture<PluviogramasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluviogramasEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluviogramasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
