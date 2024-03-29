import { RelatoriosService } from './../relatorios/relatorios.service';

import { AuthService } from './../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';


import { NgModule } from '@angular/core';
/* O calendário do PrimeNG é apresentado, por padrão, em inglês. Para alterar esta
 configuração, na versão 14 da biblioteca, é necessário trabalhar com o sistema de
 internacionalização i18n. Para isso é necessário adicionar algumas novas dependências,
  com os comandos  */

  /*módulo de tradução: TranslateModule e definição do provedor de tradução: (TranslateService)  */
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ErrorHandlerService } from './error-handler.service';

import { NavbarComponent } from './navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

registerLocaleData(localePt, 'pt-BR');

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    ToastModule,
    ConfirmDialogModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    NavbarComponent,

    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    DatePipe,
    ErrorHandlerService,
    AuthService,
    MessageService,
    ConfirmationService,
    Title,
    RelatoriosService,
    TranslateService
  ]
})
export class CoreModule { }
