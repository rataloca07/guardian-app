import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPacientePage } from './register-paciente.page';

describe('RegisterPacientePage', () => {
  let component: RegisterPacientePage;
  let fixture: ComponentFixture<RegisterPacientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
