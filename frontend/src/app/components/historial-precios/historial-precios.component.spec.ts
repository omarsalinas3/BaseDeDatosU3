import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPreciosComponent } from './historial-precios.component';

describe('HistorialPreciosComponent', () => {
  let component: HistorialPreciosComponent;
  let fixture: ComponentFixture<HistorialPreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPreciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
