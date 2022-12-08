import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../seguranca/auth.guard";

import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';

const routes: Routes = [
  /*Como já foi alterado pelo app-routing-modules teremos que tirar os lanaçemntos abaixo
  para não haver lançanmentos/lançamentos  . Esta configuração é o que precisamos para fazer o lazy loading */
  {
    path: '',
    component: LancamentosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_LANCAMENTO'] }
  },
  {
    path: 'novo',
    component: LancamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
  },
  {
    path: ':codigo',
    component: LancamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
  }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class LancamentosRoutingModule { }
