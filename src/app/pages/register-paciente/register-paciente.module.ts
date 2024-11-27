import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPacientePageRoutingModule } from './register-paciente-routing.module';

import { RegisterPacientePage } from './register-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPacientePageRoutingModule
  ],
  declarations: [RegisterPacientePage]
})
export class RegisterPacientePageModule {}
