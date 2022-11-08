import { Component, OnInit } from '@angular/core';
import { LancamentoService } from '../lancamento.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit  {

  /* É o  this.lancamentos lá embaixo*/
  lancamentos: any[] = [] ;


  constructor(private lancamentoService: LancamentoService) {}

  /* Quando o componente for inicializado chame o método pesquisar  */
  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar(): void {
    this.lancamentoService.pesquisar()
      .then(lancamentos => this.lancamentos = lancamentos);
  }

}
