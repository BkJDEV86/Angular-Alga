import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NaoAutorizadoComponent } from "./core/nao-autorizado.component";

import { PaginaNaoEncontradaComponent } from "./core/pagina-nao-encontrada.component";


const routes: Routes = [

  /* Implementando o carregamento tardio(lazy-loading)*/
  { path: 'lancamentos', loadChildren: () => import('../app/lancamentos/lancamentos.module').then(m => m.LancamentosModule) },
  { path: 'pessoas', loadChildren: () => import('../app/pessoas/pessoas.module').then(m => m.PessoasModule) },
  /* O path vazio por padrão é o / . E o pathMatch: 'full' é o caminho completo, no caso vazio. */
  { path: '', redirectTo: 'lancamentos', pathMatch: 'full' },
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },
  { path: 'dashboard', loadChildren: () => import('../app/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent},
  /* O símbolo de ** é para qualquer coisa que não for encontrada */
  { path: '**', redirectTo:  'pagina-nao-encontrada'}
];

@NgModule({

  imports: [

    RouterModule.forRoot(routes) /*Agora ele já sabe a configuração
    de rotas, bastando colocar <router-outlet></router-outlet> no
    app.component.html */


  ],
  exports: [RouterModule]

})
export class AppRoutingModule { }
