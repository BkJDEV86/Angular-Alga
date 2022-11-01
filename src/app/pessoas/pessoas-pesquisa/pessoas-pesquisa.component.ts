import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent  {





  pessoas = [
  {nome: 'Rafael Oliveira', cidade: 'Rio de Janeiro', estado: 'RJ',
  status: true},
  {nome: 'Joana Silva', cidade: 'São Paulo', estado: 'SP',
  status: true},
  {nome: 'Joaquim Teixeira', cidade: 'Espírito Santo', estado: 'ES',
  status: false},
  {nome: 'Luana Malta', cidade: 'Minas Gerais', estado: 'MG',
  status: true},
  {nome: 'Bruno Souza', cidade: 'Amazonas', estado: 'AM',
  status:  false},
  {nome: 'Glauber Oliveira', cidade: 'Rio Grande do Sul', estado: 'RS',
  status:  false},
  {nome: 'Josué Martins', cidade: 'Rio Grande do Norte', estado: 'RN',
  status: true}


];

}
