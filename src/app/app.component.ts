import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'algamoney-ui';

  /* A configuração do serviço de tradução é feita no AppComponent através da definição
   da linguagem padrão do sistema e de uma chamada assíncrona do tipo get. Esta operação
    é realizada na inicialização do componente, ou seja, deve ser colocada no método ngOnInit */

  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang('pt');
    this.translateService.get('primeng')
      .subscribe(res => this.config.setTranslation(res));
  }

   /* Aqui é se estiver na página de login não exibir o navbar */
   exibindoNavbar() {
    return this.router.url !== '/login'
   }


}
