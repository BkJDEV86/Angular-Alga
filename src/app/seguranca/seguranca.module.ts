import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';


export function tokenGetter(): string {
  return localStorage.getItem('token')!;
}
@NgModule({
  declarations: [
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    /* Com isso, indicamos que no domínio "localhost:8080", todas as requisições serão interceptadas e o token será adicionado.
Já para "http://localhost:8080/oauth/token" não ocorrerá nenhuma interceptação,
 pois neste endpoint, não utilizamos o token armazenado, e sim a autenticação
 básica, como vimos em aulas anteriores. */
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8080'],
        disallowedRoutes: ['http://localhost:8080/oauth/token']
      }
    }),

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule
  ],
  providers: [JwtHelperService]
})
export class SegurancaModule { }
