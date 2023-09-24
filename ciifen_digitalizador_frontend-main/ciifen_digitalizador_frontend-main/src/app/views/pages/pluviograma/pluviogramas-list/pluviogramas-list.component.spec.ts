import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluviogramasListComponent } from './pluviogramas-list.component';

describe('PluviogramasListComponent', () => {
  let component: PluviogramasListComponent;
  let fixture: ComponentFixture<PluviogramasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluviogramasListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluviogramasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
