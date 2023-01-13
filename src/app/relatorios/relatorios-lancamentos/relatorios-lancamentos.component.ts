import { Component, OnInit } from '@angular/core';
import { RelatoriosService } from './../relatorios.service';


@Component({
  selector: 'app-relatorios-lancamentos',
  templateUrl: './relatorios-lancamentos.component.html',
  styleUrls: ['./relatorios-lancamentos.component.css']
})
export class RelatoriosLancamentosComponent implements OnInit {


  periodoInicio?: Date;
  periodoFim?: Date;

  constructor(private relatoriosService: RelatoriosService) { }

  ngOnInit()  {
  }

  // Acontece que agora o toPromisse (que foi depreciado) retorna um valor
  // tipado, no seu caso o Blob, ou um undefined. Sendo assim, é necessário
  // realizar o check, para saber se é undefined ou não. Logo colocamos !
  gerar() {
    this.relatoriosService.relatorioLancamentosPorPessoa(this.periodoInicio!, this.periodoFim!)
      .then(relatorio => {
        const url = window.URL.createObjectURL(relatorio!);
        window.open(url);
      });
  }
}

