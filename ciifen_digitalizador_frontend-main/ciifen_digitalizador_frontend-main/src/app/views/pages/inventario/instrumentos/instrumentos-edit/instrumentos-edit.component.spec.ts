import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentosEditComponent } from './instrumentos-edit.component';

describe('InstrumentosEditComponent', () => {
  let component: InstrumentosEditComponent;
  let fixture: ComponentFixture<InstrumentosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentosEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
