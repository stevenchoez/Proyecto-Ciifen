import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInfimaCuantiaTotalComponent } from './reporte-infima-cuantia-total.component';

describe('ReporteInfimaCuantiaTotalComponent', () => {
  let component: ReporteInfimaCuantiaTotalComponent;
  let fixture: ComponentFixture<ReporteInfimaCuantiaTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteInfimaCuantiaTotalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteInfimaCuantiaTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
