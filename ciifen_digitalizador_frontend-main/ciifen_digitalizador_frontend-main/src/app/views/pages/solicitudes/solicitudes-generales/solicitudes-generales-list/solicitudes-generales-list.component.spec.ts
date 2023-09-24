import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGeneralesListComponent } from './solicitudes-generales-list.component';

describe('SolicitudesGeneralesListComponent', () => {
  let component: SolicitudesGeneralesListComponent;
  let fixture: ComponentFixture<SolicitudesGeneralesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesGeneralesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesGeneralesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
