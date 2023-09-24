import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesInfimaDetailComponent } from './solicitudes-infima-detail.component';

describe('SolicitudesInfimaDetailComponent', () => {
  let component: SolicitudesInfimaDetailComponent;
  let fixture: ComponentFixture<SolicitudesInfimaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesInfimaDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesInfimaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
