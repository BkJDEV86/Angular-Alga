import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatoriosLancamentosComponent } from './relatorios-lancamentos/relatorios-lancamentos.component';


@NgModule({
  declarations: [
    RelatoriosLancamentosComponent
  ],
  imports: [
    CommonModule,
    RelatoriosRoutingModule,
    SharedModule,
    FormsModule,
    CalendarModule
  ]
})
export class RelatoriosModule { }
