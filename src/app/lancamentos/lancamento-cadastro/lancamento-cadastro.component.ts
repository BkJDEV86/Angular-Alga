import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Lancamento } from './../../core/model';
import { CategoriaService } from 'src/app/categorias/categorias.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  lancamento: Lancamento = new Lancamento();

   tipos = [
    {label: 'Receita', value: 'RECEITA'},
    {label: 'Despesa', value: 'DESPESA'},
   ];

   categorias: any[] = [];
  pessoas: any[] = []

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,  /* Pega a rota ativada  */
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {


    this.title.setTitle('Novo lançamento');

    /* Pega uma cópia instantânea de todos os parâmetros  */
  /* No método de inicialização do componente, ngOnInit(), o parâmetro 'codigo'
   acaba sendo preenchido, mesmo quando acessamos a rota com um "/novo", invés do
    "/:codigo", logo, quando é feita a verificação para saber se existe um código
     passado na URL para fazer a edição do lançamento, essa verificação acaba
     retornando true e fazendo com que seja buscado em nosso backend um lançamento
      de código "novo", causando erro */
  const codigoLancamento = this.route.snapshot.params['codigo'];

  if (codigoLancamento && codigoLancamento !== 'novo') {
    this.carregarLancamento(codigoLancamento)
  }

    this.carregarCategorias()
    this.carregarPessoas()
  }

   /* Aqui abaixo irá retornar true se estiver editando... */
  get editando() {
    return Boolean(this.lancamento.codigo)
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao()
      },
      erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        /*O map vai retornar um array com novos objetos na forma de label e value */
        this.categorias = categorias.map((c: any) => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas
          .map((p: any) => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarLancamento(form)
    } else {
      this.adicionarLancamento(form)
    }
  }

  atualizarLancamento(form: NgForm) {
    this.lancamentoService.atualizar(this.lancamento)
      .then((lancamento: Lancamento) => {
        this.lancamento = lancamento;
        this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso!' });
        this.atualizarTituloEdicao()
      }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarLancamento(form: NgForm) {
    this.lancamentoService.adicionar(this.lancamento)
      .then((lancamentoAdicionado) => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        // form.reset();
        // this.lancamento = new Lancamento();
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo])
      }
      ).catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: NgForm) {
    /*Aqui é para limpar o formulário toda vez que clica em novo */
    form.reset();

    /* Função abaixo que excutará uma nova instanciação depois de 1 milisegundo*/
    setTimeout(() => {
      this.lancamento = new Lancamento();
    }, 1);

    this.router.navigate(['lancamentos/novo']);
  }

 atualizarTituloEdicao() {
  this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
 }


}
