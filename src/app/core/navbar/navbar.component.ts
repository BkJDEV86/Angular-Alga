import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';
import { AuthService } from './../../seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

/*Aqui abaixo é para colocar o administrador local logado */
export class NavbarComponent implements OnInit {

  exibindoMenu: boolean = false;
  usuarioLogado: string = ''

  constructor(private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router) { }

  ngOnInit() {
    this.usuarioLogado = this.auth.jwtPayload?.nome;
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
