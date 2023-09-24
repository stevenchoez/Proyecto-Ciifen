import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentosListComponent } from './instrumentos-list.component';

describe('InstrumentosListComponent', () => {
  let component: InstrumentosListComponent;
  let fixture: ComponentFixture<InstrumentosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
