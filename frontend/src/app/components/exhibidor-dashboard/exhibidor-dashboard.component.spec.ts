import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibidorDashboardComponent } from './exhibidor-dashboard.component';

describe('ExhibidorDashboardComponent', () => {
  let component: ExhibidorDashboardComponent;
  let fixture: ComponentFixture<ExhibidorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibidorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExhibidorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
