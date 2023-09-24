import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSolicitudesTotalComponent } from './reporte-solicitudes-total.component';

describe('ReporteSolicitudesTotalComponent', () => {
  let component: ReporteSolicitudesTotalComponent;
  let fixture: ComponentFixture<ReporteSolicitudesTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteSolicitudesTotalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSolicitudesTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
