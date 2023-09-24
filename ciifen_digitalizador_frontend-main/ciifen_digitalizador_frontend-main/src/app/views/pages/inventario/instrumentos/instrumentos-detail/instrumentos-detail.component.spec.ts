import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentosDetailComponent } from './instrumentos-detail.component';

describe('InstrumentosDetailComponent', () => {
  let component: InstrumentosDetailComponent;
  let fixture: ComponentFixture<InstrumentosDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentosDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
