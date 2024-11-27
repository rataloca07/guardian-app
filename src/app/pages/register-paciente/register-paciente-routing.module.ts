import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPacientePage } from './register-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPacientePageRoutingModule {}
