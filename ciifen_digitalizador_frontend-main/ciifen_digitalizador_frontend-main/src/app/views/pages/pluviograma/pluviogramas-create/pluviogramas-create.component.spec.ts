import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluviogramasCreateComponent } from './pluviogramas-create.component';

describe('PluviogramasCreateComponent', () => {
  let component: PluviogramasCreateComponent;
  let fixture: ComponentFixture<PluviogramasCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluviogramasCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluviogramasCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
