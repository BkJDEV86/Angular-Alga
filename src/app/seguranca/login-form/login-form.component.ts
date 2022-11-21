import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  /* A versão 14 do Angular não permite o acesso a variáveis private
   dentro do template. Sendo assim, para que seja utilizada a
   interpolação é necessário alterar o modificador de acesso de
    private para public no construtor do componente LoginForm */
   /* Esta alteração deve ser realizada apenas para efeito de
   visualização da variável no template. Quando esta interpolação
    for retirada é adequado retornar o modificador para private */

    constructor(
      private auth: AuthService,
      private errorHandler: ErrorHandlerService,
      private router: Router
    ) { }

  ngOnInit(): void {
  }

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha)
      .then(() => {
        this.router.navigate(['/lancamentos']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }
}
