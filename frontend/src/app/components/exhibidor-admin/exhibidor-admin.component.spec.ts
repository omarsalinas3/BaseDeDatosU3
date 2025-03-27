import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibidorAdminComponent } from './exhibidor-admin.component';

describe('ExhibidorAdminComponent', () => {
  let component: ExhibidorAdminComponent;
  let fixture: ComponentFixture<ExhibidorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibidorAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExhibidorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
