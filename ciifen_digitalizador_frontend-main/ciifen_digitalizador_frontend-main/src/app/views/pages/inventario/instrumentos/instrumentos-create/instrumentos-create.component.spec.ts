import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentosCreateComponent } from './instrumentos-create.component';

describe('InstrumentosCreateComponent', () => {
  let component: InstrumentosCreateComponent;
  let fixture: ComponentFixture<InstrumentosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentosCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
