import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesInfimaListComponent } from './solicitudes-infima-list.component';

describe('SolicitudesInfimaListComponent', () => {
  let component: SolicitudesInfimaListComponent;
  let fixture: ComponentFixture<SolicitudesInfimaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesInfimaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesInfimaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
