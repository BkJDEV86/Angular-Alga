import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';

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

  //lancamento: Lancamento = new Lancamento();
  formulario!: FormGroup;

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
    private title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.configurarFormulario();

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

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      /* Abaixo recebemos o primeiro parâmetro inicial e após a validação */
      /* Estaremos utilizando formulários reativos que reagem melhor aos eventos do usuários,
      dando mais controle e mais funcionalidades para o desenvolvedor*/
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [Validators.required, Validators.minLength(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: []
    });
  }

   /* Aqui abaixo irá retornar true se estiver editando... */
  get editando() {
    return Boolean(this.formulario.get('codigo')?.value)
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
       // this.lancamento = lancamento;
       this.formulario.patchValue(lancamento);
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
/* Não precisa mais passar parâmetro pois temos acesso através desta classe*/
/*form: NgForm) */
  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
      .then((lancamento: Lancamento) => {
       // this.lancamento = lancamento;
       this.formulario.patchValue(lancamento);
        this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso!' });
        this.atualizarTituloEdicao()
      }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then((lancamentoAdicionado) => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        // form.reset();
        // this.lancamento = new Lancamento();
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo])
      }
      ).catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    /*Aqui é para limpar o formulário toda vez que clica em novo
    O patchValue() passando um novo lançamento fará com que todas as propriedades sejam atualizadas
     dentro do formulário para que seja como um novo lançamento. Se você utilizar o setValue
      diretamente, receberá um erro indicando que o valor "código" precisa ser passado.
       Por esse motivo utilizamos aqui o patch em vez do set.*/
    this.formulario.reset();

    this.formulario.patchValue(new Lancamento())
    this.router.navigate(['lancamentos/novo']);
  }

 atualizarTituloEdicao() {
  this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao')?.value}`);
 }


}
