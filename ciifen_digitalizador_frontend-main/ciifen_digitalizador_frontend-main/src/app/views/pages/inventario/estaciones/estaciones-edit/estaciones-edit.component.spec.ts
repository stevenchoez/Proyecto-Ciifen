import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesEditComponent } from './estaciones-edit.component';

describe('EstacionesEditComponent', () => {
  let component: EstacionesEditComponent;
  let fixture: ComponentFixture<EstacionesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
