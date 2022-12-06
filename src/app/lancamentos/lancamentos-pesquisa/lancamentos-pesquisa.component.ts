import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { LancamentoFiltro, LancamentoService } from './../lancamento.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit  {



  filtro = new LancamentoFiltro();

  totalRegistros: number = 0

  /* É o  this.lancamentos lá embaixo*/
  lancamentos: any[] = [];

  /* Aqui agente consegue ter acesso ao objeto que representa um componente de primeg */
  @ViewChild('tabela') grid!: Table;

  constructor(
    private auth: AuthService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) { }

  /* Quando o componente for inicializado chame o método pesquisar  */
  /* A questão é que quando temos um componente lazy iniciado o evento onlazyload é chamado
  automaticamente, se colocarmos o pesquisar dentro do ngOnInit estaríamos chamando o método
  pesquisar 2 vezes. */
  /*Aqui é para alterar o título da página , fica uma expereiência
  melhor para o usuário */
  ngOnInit(): void {
        this.title.setTitle('Pesquisa de lançamentos')
  }

  pesquisar(pagina: number = 0): void {
    this.filtro.pagina = pagina;



    /* Aqui abaixo tem que passar a propriedade descrição e
  o valor this.descrição o uso de chave é a forma de declarar uma propiedade e um valor
  em javascript */
    this.lancamentoService.pesquisar(this.filtro)
    /*Aqui agora vai ter que retornar resultado pegando this.lançamento que é um array vazio
    e igualando a resultado.lançamento  */
    .then((resultado: any) => {
      this.lancamentos = resultado.lancamentos;
      this.totalRegistros = resultado.total;
    })
    .catch(erro => this.errorHandler.handle(erro));
}

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!; /* Essa conta é para saber em qual
    página estamos... depois pegamos essa página e colocamos dentro do método pesquisar
    abaixo */
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }



  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        /*Aqui abaixo é caso esteja na primeira página aí chamamos o métod pesuisar() */
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' })
      })
  }

  naoTemPermissao(permissao: string) {
    return !this.auth.temPermissao(permissao);
  }


}
