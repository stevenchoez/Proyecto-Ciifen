import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesCreateComponent } from './estaciones-create.component';

describe('EstacionesCreateComponent', () => {
  let component: EstacionesCreateComponent;
  let fixture: ComponentFixture<EstacionesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionesCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
