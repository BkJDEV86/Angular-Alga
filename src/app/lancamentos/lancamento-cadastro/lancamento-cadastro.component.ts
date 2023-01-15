import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';

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

   uploadEmAndamento = false;

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


  //Para obtermos acesso ao objeto de response, precisamos acessar a propriedade
  // "originalEvent" e, dentro da mesma, acessamos a propriedade "body":
  // Assim teremos acesso ao objeto da resposta. Ainda dentro do mesmo método
  // precisaremos fazer uma outra alteração, para que no momento em que formos acessar
  // o anexo possamos ser redirecionados corretamente para a url na AWS.

//Nosso backend está retornando um protocolo padrão com "\\\\" no início na url, o que
// significa que o próprio navegador será o encarregado de entender se o protocolo
//utilizado seria http ou https, porém, o protocolo assumido pelo navegador acaba sendo
//o "file", o que implica que não seremos redirecionados corretamente para o servidor da
//Amazon, no S3.

//Precisaremos manualmente substituir esse protocolo padrão para o https, e o faremos
// no momento em que terminarmos de fazer o upload do arquivo e recebermos a resposta
//do nosso backend.

  aoTerminarUploadAnexo(event: any) {
    const anexo = event.originalEvent.body;
    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url.replace('\\\\', 'https://')
    });

    this.uploadEmAndamento = false;
  }


  antesUploadAnexo() {
    this.uploadEmAndamento = true;
  }

  erroUpload(event: any) {
    this.messageService.add({ severity: 'error', detail: 'Erro ao tentar enviar anexo!' });
    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    console.log('nomeAnexo')
    const nome = this.formulario?.get('anexo')?.value;
    console.log(nome)
    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }



  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  get uploadHeaders() {
    return this.lancamentoService.uploadHeaders();
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
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }



   /* Aqui abaixo irá retornar true se estiver editando... */
  get editando() {
    return Boolean(this.formulario.get('codigo')?.value)
  }

  // Utilizando a versão 3 do PrimeFlex, não será necessário retirar o p-fluid da div que contém o botão de remover anexo,
  // pois, já será assumido o tamanho correto do botão.

//Uma outra alteração será necessária em função do problema explicado na aula 23.20, em relação ao protocolo assumido
//pelo navegador.

// No momento em que carregamos o lançamento do nosso backend, ele também vem com o '\\\\' e, nesse momento, também
//será necessário substituir este protocolo pelo 'https://'. Para isso, no método carregarLancamento(), após atribuir
// o lançamento do backend no nosso formulário, acrescentaremos o seguinte:

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
       // this.lancamento = lancamento;
       this.formulario.patchValue(lancamento);

       if (this.formulario.get('urlAnexo')?.value)
          this.formulario.patchValue({
            urlAnexo: this.formulario.get('urlAnexo')?.value.replace('\\\\', 'https://')
          });


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
