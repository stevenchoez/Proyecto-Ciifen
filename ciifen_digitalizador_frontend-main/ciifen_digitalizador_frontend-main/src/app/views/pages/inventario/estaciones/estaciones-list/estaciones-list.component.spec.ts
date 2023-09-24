import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesListComponent } from './estaciones-list.component';

describe('EstacionesListComponent', () => {
  let component: EstacionesListComponent;
  let fixture: ComponentFixture<EstacionesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
