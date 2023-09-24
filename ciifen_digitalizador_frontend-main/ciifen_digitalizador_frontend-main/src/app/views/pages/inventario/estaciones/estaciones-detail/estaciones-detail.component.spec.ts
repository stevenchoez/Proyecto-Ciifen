import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesDetailComponent } from './estaciones-detail.component';

describe('EstacionesDetailComponent', () => {
  let component: EstacionesDetailComponent;
  let fixture: ComponentFixture<EstacionesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
