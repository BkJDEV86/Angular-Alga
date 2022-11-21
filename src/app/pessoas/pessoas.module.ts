


import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedModule } from '../shared/shared.module';
import { InputMaskModule } from 'primeng/inputmask';
import { RouterModule } from '@angular/router';
import { PessoasRoutingModule } from './pessoas-routing.module';


@NgModule({
  declarations: [
      PessoaCadastroComponent,
      PessoasPesquisaComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    CurrencyMaskModule,
    RouterModule,
    PessoasRoutingModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    SharedModule,
    InputMaskModule

  ],
  /* Não precisa mais exportar só declarar pois ao acessar as rotas
  o acesso agora é direto */
  exports: [

  ]
})
export class PessoasModule { }
