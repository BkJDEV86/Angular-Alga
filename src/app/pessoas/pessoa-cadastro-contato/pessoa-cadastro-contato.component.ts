import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contato } from 'src/app/core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

  // O @imput é uma referencia de lista de contatos que esta dentro de pessoas
  //( pessoa = new Pessoa()) agora podemos acessá-la. Tornado a propriedade
  // contato do próprio componente
  @Input() contatos: Array<Contato> = []
  exbindoFormularioContato = false;
  contato?: Contato;
  contatoIndex?: number;


  constructor() { }

  ngOnInit(): void {
  }

   // Tem que ter o índice para poder alterar o contato corretamente!!!
   prepararNovoContato() {
    this.exbindoFormularioContato = true;
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length;
  }


  prepararEdicaoContato(contato: Contato, index: number) {
    this.contato = this.clonarContato(contato);
    this.exbindoFormularioContato = true;
    this.contatoIndex = index;
  }

  confirmarContato(frm: NgForm) {
    this.contatos[this.contatoIndex!] = this.clonarContato(this.contato!);
    this.exbindoFormularioContato = false;
    // É preciso resetar a lista de contatos para não aparecer os campos pedindo para
    // inserir
    frm.reset();
  }

  // Parâmetros abaixo índice e a quantidade de parâmetros que queremos remover!!
  removerContato(index: number) {
    this.contatos.splice(index, 1);
  }

  // É preciso criar uma nova instância de contato ante de dar o push pois senão ele utilizara´
  // a mesma instância de contato e apagará os dados na tela
  clonarContato(contato: Contato): Contato {
    return new Contato(contato.codigo, contato.nome, contato.email, contato.telefone);
  }


  get editando() {
    return this.contato && this.contato?.codigo;
  }

}
