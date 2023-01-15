
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SegurancaModule } from './seguranca/seguranca.module';






@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    /*Agora ele já sabe a configuração
    de rotas, bastando colocar <router-outlet></router-outlet> no
    app.component.html */
    /* Removemos o LancamentosModule e o PessoasModule para que não seja carregado inicialmente */
    //LancamentosModule,
    CoreModule,

    //PessoasModule,
    SegurancaModule,
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
