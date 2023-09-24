import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGeneralesDetailComponent } from './solicitudes-generales-detail.component';

describe('SolicitudesGeneralesDetailComponent', () => {
  let component: SolicitudesGeneralesDetailComponent;
  let fixture: ComponentFixture<SolicitudesGeneralesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesGeneralesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesGeneralesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
